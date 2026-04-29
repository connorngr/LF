import { z } from 'zod'

const MIME_TYPE_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'File cannot be empty')
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'Only JPEG, PNG, WebP, and GIF images are allowed'
    ),
  caption: z.string().max(500, 'Caption must be less than 500 characters').optional(),
})

export type UploadInput = z.infer<typeof uploadSchema>

export function getExtension(mimeType: string): string {
  return MIME_TYPE_TO_EXT[mimeType] || 'jpg'
}

export function generateSecureKey(mimeType: string): string {
  const timestamp = Date.now()
  const randomBytes = Math.random().toString(36).slice(2, 10)
  const ext = getExtension(mimeType)
  return `${timestamp}-${randomBytes}.${ext}`
}
