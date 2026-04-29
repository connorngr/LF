'use server'

import { uploadSchema, generateSecureKey } from '@/schemas/upload'
import { uploadToR2 } from '@/lib/r2'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function uploadImage(formData: FormData) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return { error: 'Unauthorized: Admin authentication required' }
  }

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

  return { success: true, url: savedKey, postId: post.id }
}