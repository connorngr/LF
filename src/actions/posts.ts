'use server'

import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromR2 } from '@/lib/r2'
import { generateUniqueSlug } from '@/lib/slug'
import { deletePostSchema, updatePostSchema } from '@/schemas/post'
import { revalidatePath } from 'next/cache'

export async function updatePost(postId: string, name: string, caption: string) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return { error: 'Unauthorized: Admin authentication required' }
  }

  const validationResult = updatePostSchema.safeParse({ postId, name, caption })
  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => err.message).join('; ')
    return { error: errors }
  }

  const { postId: validPostId, name: validName, caption: validCaption } =
    validationResult.data

  const existing = await prisma.post.findUnique({
    where: { id: validPostId },
    select: { id: true, name: true, slug: true },
  })

  if (!existing) {
    return { error: 'Post not found' }
  }

  const nameChanged = validName !== existing.name
  const slug = nameChanged
    ? await generateUniqueSlug(validName, validPostId)
    : existing.slug

  await prisma.post.update({
    where: { id: validPostId },
    data: {
      name: validName,
      caption: validCaption,
      ...(nameChanged ? { slug } : {}),
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
    ...post.images.map((image) => image.imageUrl),
  ]

  await Promise.all(keysToDelete.map((key) => deleteFromR2(key)))

  await prisma.post.delete({ where: { id: validPostId } })

  revalidatePath('/')
  revalidatePath('/upload')
  revalidatePath(`/photo/${post.slug}`)

  return { success: true }
}
