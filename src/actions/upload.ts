'use server'

import {
  type AllowedImageType,
  generateSecureKey,
  getContentTypeFromKey,
} from '@/schemas/upload'
import {
  deleteFromR2,
  getObjectBufferFromR2,
  getPresignedUploadUrl,
  uploadThumbnailToR2,
} from '@/lib/r2'
import { prisma } from '@/lib/prisma'
import { generateUniqueSlug } from '@/lib/slug'
import { isAuthenticated } from '@/lib/auth'
import { resolveSoundCloudTrack } from '@/lib/iframely'
import { revalidatePath } from 'next/cache'

async function requireAdmin(): Promise<{ error: string } | null> {
  if (!(await isAuthenticated())) {
    return { error: 'Unauthorized: Admin authentication required' }
  }
  return null
}

async function cleanupUploadedKeys(keys: string[]): Promise<void> {
  await Promise.all(keys.map((key) => deleteFromR2(key)))
}

export async function prepareImageUploads(
  files: { contentType: string; size: number }[],
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const uploads = await Promise.all(
    files.map(async (file) => {
      const contentType = file.contentType as AllowedImageType
      const key = generateSecureKey(contentType)
      const uploadUrl = await getPresignedUploadUrl(key, contentType)
      return { key, uploadUrl }
    }),
  )

  return { uploads }
}

export async function finalizeImageUpload(input: {
  name: string
  caption: string
  soundCloudUrl?: string
  imageKeys: string[]
}) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { name, caption, soundCloudUrl, imageKeys } = input

  let soundCloudTrackId: string | null = null
  if (soundCloudUrl) {
    try {
      const resolved = await resolveSoundCloudTrack(soundCloudUrl)
      soundCloudTrackId = resolved.trackId
    } catch {
      await cleanupUploadedKeys(imageKeys)
      return { error: 'Could not resolve SoundCloud track. Check the URL and try again.' }
    }
  }

  const firstKey = imageKeys[0]

  try {
    const firstBuffer = await getObjectBufferFromR2(firstKey)
    const thumbnailKey = await uploadThumbnailToR2(
      firstBuffer,
      firstKey,
      getContentTypeFromKey(firstKey),
    )

    const slug = await generateUniqueSlug(name)

    const post = await prisma.post.create({
      data: {
        name,
        slug,
        soundCloudTrackId,
        imageUrl: thumbnailKey,
        caption,
      },
    })

    await prisma.image.createMany({
      data: imageKeys.map((imageUrl, sortOrder) => ({
        imageUrl,
        postId: post.id,
        sortOrder,
      })),
    })

    revalidatePath('/upload')
    revalidatePath('/')
    return { success: true, postId: post.id }
  } catch {
    await cleanupUploadedKeys(imageKeys)
    return { error: 'Failed to process uploaded images. Please try again.' }
  }
}
