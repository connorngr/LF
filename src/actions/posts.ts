'use server'

import { isAuthenticated } from '@/lib/auth'
import { resolveSoundCloudTrack } from '@/lib/iframely'
import { prisma } from '@/lib/prisma'
import { getDerivedImageKeys, planImageEdit } from '@/lib/post-images'
import {
  deleteFromR2,
  getObjectBufferFromR2,
  getUrl,
  headObjectFromR2,
  uploadThumbnailToR2,
} from '@/lib/r2'
import { generateUniqueSlug } from '@/lib/slug'
import {
  deletePostSchema,
  postIdSchema,
  updatePostImagesSchema,
  updatePostSchema,
} from '@/schemas/post'
import { MAX_IMAGE_BYTES, getContentTypeFromKey } from '@/schemas/upload'
import type { z } from 'zod'
import { revalidatePath } from 'next/cache'

type UpdatePostPayload = z.input<typeof updatePostSchema>

export async function updatePost(input: UpdatePostPayload) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return { error: 'Unauthorized: Admin authentication required' }
  }

  const validationResult = updatePostSchema.safeParse(input)
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => err.message).join('; ')
    return { error: errors }
  }

  const {
    postId: validPostId,
    name: validName,
    caption: validCaption,
    soundCloudUrl: validSoundCloudUrl,
    changeSoundtrack,
    isPrivate: validIsPrivate,
    isPinned: validIsPinned,
  } = validationResult.data

  const existing = await prisma.post.findUnique({
    where: { id: validPostId },
    select: { id: true, name: true, slug: true, soundCloudTrackId: true },
  })

  if (!existing) {
    return { error: 'Post not found' }
  }

  const nameChanged = validName !== existing.name
  const slug = nameChanged
    ? await generateUniqueSlug(validName, validPostId)
    : existing.slug

  let soundCloudTrackId: string | null | undefined = undefined
  const hasExistingTrack = Boolean(existing.soundCloudTrackId)
  const shouldUpdateSoundtrack =
    validSoundCloudUrl &&
    (!hasExistingTrack || changeSoundtrack === true)

  if (shouldUpdateSoundtrack) {
    try {
      const resolved = await resolveSoundCloudTrack(validSoundCloudUrl)
      soundCloudTrackId = resolved.trackId
    } catch {
      return { error: 'Could not resolve SoundCloud track. Check the URL and try again.' }
    }
  }

  await prisma.post.update({
    where: { id: validPostId },
    data: {
      name: validName,
      caption: validCaption,
      isPrivate: validIsPrivate,
      isPinned: validIsPinned,
      ...(nameChanged ? { slug } : {}),
      ...(soundCloudTrackId !== undefined ? { soundCloudTrackId } : {}),
    },
  })

  revalidatePath('/')
  revalidatePath('/upload')
  if (nameChanged) {
    revalidatePath(`/photo/${existing.slug}`)
    revalidatePath(`/photo/${slug}`)
  } else {
    revalidatePath(`/photo/${existing.slug}`)
  }

  return { success: true, newSlug: nameChanged ? slug : undefined }
}

export async function deletePost(postId: string) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return { error: 'Unauthorized: Admin authentication required' }
  }

  const validationResult = deletePostSchema.safeParse({ postId })
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => err.message).join('; ')
    return { error: errors }
  }

  const { postId: validPostId } = validationResult.data

  const post = await prisma.post.findUnique({
    where: { id: validPostId },
    select: {
      imageUrl: true,
      slug: true,
      images: { select: { imageUrl: true } },
    },
  })

  if (!post) {
    return { error: 'Post not found' }
  }

  const keysToDelete = [
    post.imageUrl,
    ...post.images.map((image: { imageUrl: string }) => image.imageUrl),
  ]

  await Promise.all(keysToDelete.map((key) => deleteFromR2(key)))

  await prisma.post.delete({ where: { id: validPostId } })

  revalidatePath('/')
  revalidatePath('/upload')
  revalidatePath(`/photo/${post.slug}`)

  return { success: true }
}
export async function getPostImages(postId: string) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return { error: 'Unauthorized: Admin authentication required' }
  }

  const validationResult = postIdSchema.safeParse({ postId })
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => err.message).join('; ')
    return { error: errors }
  }

  const images = await prisma.image.findMany({
    where: { postId: validationResult.data.postId },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, imageUrl: true },
  })

  return {
    images: await Promise.all(
      images.map(async (image) => ({ id: image.id, src: await getUrl(image.imageUrl) })),
    ),
  }
}

type UpdatePostImagesPayload = z.input<typeof updatePostImagesSchema>

async function isValidUploadedObject(key: string): Promise<boolean> {
  try {
    const { contentLength, contentType } = await headObjectFromR2(key)
    return (
      contentLength > 0 &&
      contentLength <= MAX_IMAGE_BYTES &&
      contentType === getContentTypeFromKey(key)
    )
  } catch {
    return false
  }
}

export async function updatePostImages(input: UpdatePostImagesPayload) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return { error: 'Unauthorized: Admin authentication required' }
  }

  const validationResult = updatePostImagesSchema.safeParse(input)
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => err.message).join('; ')
    return { error: errors }
  }

  const { postId: validPostId, order } = validationResult.data
  const newKeys = order.flatMap((item) => (item.kind === 'new' ? [item.key] : []))
  // Only delete keys no Image row references, so a bad request cannot remove another image.
  const cleanupNewKeys = async () => {
    if (newKeys.length === 0) return
    const referenced = await prisma.image.findMany({
      where: { imageUrl: { in: newKeys } },
      select: { imageUrl: true },
    })
    const referencedKeys = new Set(referenced.map((image) => image.imageUrl))
    await Promise.all(
      newKeys.filter((key) => !referencedKeys.has(key)).map((key) => deleteFromR2(key)),
    )
  }

  const post = await prisma.post.findUnique({
    where: { id: validPostId },
    select: {
      slug: true,
      imageUrl: true,
      images: {
        orderBy: { sortOrder: 'asc' },
        select: { id: true, imageUrl: true },
      },
    },
  })

  if (!post) {
    await cleanupNewKeys()
    return { error: 'Post not found' }
  }

  // Server-side limit check: existing - removed + added must stay within 1..MAX_IMAGES_PER_POST.
  const planResult = planImageEdit(post.images, order)
  if (!planResult.ok) {
    await cleanupNewKeys()
    return { error: planResult.error }
  }
  const { plan } = planResult

  const uploadsValid = await Promise.all(newKeys.map((key) => isValidUploadedObject(key)))
  if (uploadsValid.includes(false)) {
    await cleanupNewKeys()
    return { error: 'Uploaded image is missing or invalid. Please try again.' }
  }

  let newThumbnailKey: string | null = null
  try {
    if (plan.firstImageChanged) {
      const firstBuffer = await getObjectBufferFromR2(plan.firstImageKey)
      newThumbnailKey = await uploadThumbnailToR2(firstBuffer, plan.firstImageKey)
    }

    await prisma.$transaction([
      prisma.image.deleteMany({
        where: { postId: validPostId, id: { in: plan.removed.map((image) => image.id) } },
      }),
      ...plan.keep.map(({ id, sortOrder }) =>
        prisma.image.update({ where: { id }, data: { sortOrder } }),
      ),
      prisma.image.createMany({
        data: plan.create.map(({ imageUrl, sortOrder }) => ({
          imageUrl,
          sortOrder,
          postId: validPostId,
        })),
      }),
      ...(newThumbnailKey
        ? [prisma.post.update({ where: { id: validPostId }, data: { imageUrl: newThumbnailKey } })]
        : []),
    ])
  } catch {
    await Promise.all([
      cleanupNewKeys(),
      ...(newThumbnailKey && newThumbnailKey !== post.imageUrl
        ? [deleteFromR2(newThumbnailKey)]
        : []),
    ])
    return { error: 'Failed to update images. Please try again.' }
  }

  // Storage cleanup runs only after the DB commit so a failed update never loses files.
  const keysToDelete = [
    ...plan.removed.flatMap((image) => [image.imageUrl, ...getDerivedImageKeys(image.imageUrl)]),
    ...(newThumbnailKey && newThumbnailKey !== post.imageUrl ? [post.imageUrl] : []),
  ]
  await Promise.all(keysToDelete.map((key) => deleteFromR2(key)))

  revalidatePath('/')
  revalidatePath('/upload')
  revalidatePath(`/photo/${post.slug}`)

  return { success: true }
}
