import { z } from 'zod';
import { optionalSoundCloudUrlSchema } from '@/schemas/soundcloud';

export const IMAGE_TYPE_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
} as const

export type AllowedImageType = keyof typeof IMAGE_TYPE_TO_EXT

export const MAX_IMAGE_BYTES = 30 * 1024 * 1024
export const MAX_IMAGES_PER_POST = 10

const allowedImageTypeSchema = z
  .string()
  .refine(
    (value): value is AllowedImageType => value in IMAGE_TYPE_TO_EXT,
    'Only JPEG, PNG, WebP, and GIF images are allowed',
  )

export const fileDescriptorSchema = z.object({
  contentType: allowedImageTypeSchema,
  size: z
    .number()
    .int()
    .positive('File cannot be empty')
    .max(MAX_IMAGE_BYTES, 'Each file must be less than 30MB'),
})

export const prepareUploadSchema = z.object({
  files: z
    .array(fileDescriptorSchema)
    .min(1, 'File list cannot be empty')
    .max(MAX_IMAGES_PER_POST, 'Maximum 10 images per post'),
})

export const postMetadataSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(10, 'Name must be less than 10 characters'),
  caption: z
    .string()
    .min(1, 'Caption is required')
    .max(500, 'Caption must be less than 500 characters'),
  soundCloudUrl: optionalSoundCloudUrlSchema,
  isPrivate: z.boolean().default(false),
  isPinned: z.boolean().default(false),
})

function fileListToDescriptors(fileList: FileList) {
  return Array.from(fileList).map((file) => ({
    contentType: file.type,
    size: file.size,
  }))
}

/** All upload validation lives here (client form only). */
export const uploadSchema = postMetadataSchema
  .extend({
    files:
      globalThis.window === undefined
        ? z.any()
        : z.instanceof(FileList).superRefine((fileList, ctx) => {
            const result = prepareUploadSchema.safeParse({
              files: fileListToDescriptors(fileList),
            })
            if (!result.success) {
              ctx.addIssue({
                code: 'custom',
                message: result.error.issues.map((issue) => issue.message).join('; '),
              })
            }
          }),
  })
  .superRefine((data, ctx) => {
    if (data.isPrivate && data.isPinned) {
      ctx.addIssue({
        code: 'custom',
        message: 'Private posts cannot be pinned',
        path: ['isPinned'],
      })
    }
  })

export type UploadInput = z.input<typeof uploadSchema>
export type FileDescriptor = z.infer<typeof fileDescriptorSchema>

const EXT_TO_IMAGE_TYPE = Object.fromEntries(
  Object.entries(IMAGE_TYPE_TO_EXT).map(([mime, ext]) => [ext, mime]),
) as Record<string, AllowedImageType>

export function getExtension(mimeType: AllowedImageType): string {
  return IMAGE_TYPE_TO_EXT[mimeType]
}

export function getContentTypeFromKey(key: string): AllowedImageType {
  const ext = key.split('.').pop()
  const contentType = ext ? EXT_TO_IMAGE_TYPE[ext] : undefined
  if (!contentType) {
    throw new Error(`Unknown image key: ${key}`)
  }
  return contentType
}

export function generateSecureKey(mimeType: AllowedImageType): string {
  const timestamp = Date.now()
  const randomBytes = Math.random().toString(36).slice(2, 10)
  const ext = getExtension(mimeType)
  return `images/${timestamp}-${randomBytes}.${ext}`
}
