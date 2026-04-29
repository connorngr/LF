'use server'

import { z } from 'zod'
import { uploadToR2 } from '@/lib/r2'
import { prisma } from '@/lib/prisma'

const MIME_TYPE_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'File cannot be empty')
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'Only JPEG, PNG, WebP, and GIF images are allowed'
    ),
  caption: z.string().max(500).optional(),
})


function getExtension(mimeType: string): string {
  return MIME_TYPE_TO_EXT[mimeType] || 'jpg'
}

function generateSecureKey(mimeType: string): string {
  const timestamp = Date.now()
  const randomBytes = Math.random().toString(36).slice(2, 10)
  const ext = getExtension(mimeType)
  return `${timestamp}-${randomBytes}.${ext}`
}

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File | null
  const caption = (formData.get('caption') as string | null) || undefined

  const validationResult = uploadSchema.safeParse({
    file,
    caption,
  })

  if (!validationResult.success) {
    const errors = validationResult.error.issues.map((err) => err.message).join('; ')
    return { error: errors }
  }

  const { file: validFile, caption: validCaption } = validationResult.data

  const key = generateSecureKey(validFile.type)
  const buffer = Buffer.from(await validFile.arrayBuffer())
  const savedKey = await uploadToR2(buffer, key, validFile.type)

  const post = await prisma.post.create({
    data: { imageUrl: savedKey, caption: validCaption },
  })

  return { success: true, postId: post.id }
}