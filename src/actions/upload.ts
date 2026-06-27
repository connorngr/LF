'use server'

import { uploadSchema, generateSecureKey } from '@/schemas/upload'
import { uploadToR2, uploadThumbnailToR2 } from '@/lib/r2'
import { prisma } from '@/lib/prisma'
import { generateUniqueSlug } from '@/lib/slug'
import { isAuthenticated } from '@/lib/auth'
import { resolveSoundCloudTrack } from '@/lib/iframely'
import { revalidatePath } from 'next/cache'

export async function uploadImage(formData: FormData) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return { error: 'Unauthorized: Admin authentication required' }
  }

  const files = formData.getAll('files') as File[]
  const name = (formData.get('name') as string | null)?.trim() || undefined
  const caption = (formData.get('caption') as string | null) || undefined
  const soundCloudUrl = (formData.get('soundCloudUrl') as string | null)?.trim() || undefined

  const validationResult = uploadSchema.safeParse({
    files,
    name,
    caption,
    soundCloudUrl,
  })

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => err.message).join('; ')
    return { error: errors }
  }

  const {
    files: validFiles,
    name: validName,
    caption: validCaption,
    soundCloudUrl: validSoundCloudUrl,
  } = validationResult.data

  let soundCloudTrackId: string | null = null
  if (validSoundCloudUrl) {
    try {
      const resolved = await resolveSoundCloudTrack(validSoundCloudUrl)
      soundCloudTrackId = resolved.trackId
    } catch {
      return { error: 'Could not resolve SoundCloud track. Check the URL and try again.' }
    }
  }

  const firstFile = validFiles[0]
  const firstKey = generateSecureKey(firstFile.type)
  const firstBuffer = Buffer.from(await firstFile.arrayBuffer())

  // Upload first image: thumbnail (to thumbnails/) + full-size
  const thumbnailKey = await uploadThumbnailToR2(firstBuffer, firstKey, firstFile.type)
  const savedFirstKey = await uploadToR2(firstBuffer, firstKey, firstFile.type)

  const slug = await generateUniqueSlug(validName)

  // Create post with thumbnail as imageUrl (for gallery display)
  const post = await prisma.post.create({
    data: {
      name: validName,
      slug,
      soundCloudTrackId,
      imageUrl: thumbnailKey,
      caption: validCaption,
    },
  })

  // Create Image records: first image has both thumbnail + full-size reference
  await prisma.image.create({
    data: { imageUrl: savedFirstKey, postId: post.id, sortOrder: 0 },
  })

  // Upload remaining images in parallel
  if (validFiles.length > 1) {
    const remainingUploads = validFiles.slice(1).map(async (file: File, index: number) => {
      const key = generateSecureKey(file.type)
      const buffer = Buffer.from(await file.arrayBuffer())
      const savedKey = await uploadToR2(buffer, key, file.type)
      return {
        imageUrl: savedKey,
        postId: post.id,
        sortOrder: index + 1,
      }
    })

    const remainingImages = await Promise.all(remainingUploads)
    await prisma.image.createMany({ data: remainingImages })
  }
  revalidatePath('/upload')
  revalidatePath('/')
  return { success: true, postId: post.id }
}
