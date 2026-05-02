import { z } from 'zod';

const MIME_TYPE_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export const uploadSchema = z.object({
  // Fix next.js issue with FileList type on SSR
  files: globalThis.window === undefined ? z.any() : z.instanceof(FileList).refine((fileList) => fileList.length > 0, 'File list cannot be empty')
    .refine((fileList) => fileList.length <= 10, 'Maximum 10 images per post')
    .refine((files) => Array.from(files).every((file) => file.size > 0), 'File cannot be empty')
    .refine((files) => Array.from(files).every((file) => file.size <= 30 * 1024 * 1024), 'Each file must be less than 30MB')
    .refine((files) => Array.from(files).every((file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)), 'Only JPEG, PNG, WebP, and GIF images are allowed'),
  name: z.string()
    .min(1, 'Name is required')
    .max(10, 'Name must be less than 10 characters'),
  caption: z.string()
    .min(1, 'Caption is required')
    .max(500, 'Caption must be less than 500 characters'),
})

export type UploadInput = z.infer<typeof uploadSchema>

export function getExtension(mimeType: string): string {
  return MIME_TYPE_TO_EXT[mimeType] || 'jpg'
}

export function generateSecureKey(mimeType: string): string {
  const timestamp = Date.now()
  const randomBytes = Math.random().toString(36).slice(2, 10)
  const ext = getExtension(mimeType)
  return `images/${timestamp}-${randomBytes}.${ext}`
}
