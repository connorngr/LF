'use server'

import { isAuthenticated } from '@/lib/auth'
import { resolveSoundCloudTrack } from '@/lib/iframely'
import { prisma } from '@/lib/prisma'
import { deleteFromR2 } from '@/lib/r2'
import { generateUniqueSlug } from '@/lib/slug'
import { deletePostSchema, updatePostSchema } from '@/schemas/post'
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