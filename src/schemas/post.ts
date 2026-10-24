import { z } from 'zod'
import { optionalSoundCloudUrlSchema } from '@/schemas/soundcloud'
import { MAX_IMAGES_PER_POST } from '@/schemas/upload'

export const updatePostSchema = z
  .object({
    postId: z.string().uuid('Invalid post ID'),
    name: z
      .string()
      .min(1, 'Name is required')
      .max(10, 'Name must be less than 10 characters'),
    caption: z
      .string()
      .min(1, 'Caption is required')
      .max(500, 'Caption must be less than 500 characters'),
    soundCloudUrl: optionalSoundCloudUrlSchema,
    changeSoundtrack: z.boolean().optional(),
    isPrivate: z.boolean().default(false),
    isPinned: z.boolean().default(false),
    isBusiness: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.changeSoundtrack && !data.soundCloudUrl) {
      ctx.addIssue({
        code: 'custom',
        message: 'SoundCloud URL is required when changing soundtrack',
        path: ['soundCloudUrl'],
      })
    }
    if (data.isPrivate && data.isPinned) {
      ctx.addIssue({
        code: 'custom',
        message: 'Private posts cannot be pinned',
        path: ['isPinned'],
      })
    }
  })

export const deletePostSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
})

/** Matches keys produced by generateSecureKey. */
const uploadedImageKeySchema = z
  .string()
  .regex(/^images\/\d+-[a-z0-9]+\.(jpg|png|webp|gif)$/, 'Invalid image key')

export const imageOrderItemSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('existing'), id: z.string().uuid('Invalid image ID') }),
  z.object({ kind: z.literal('new'), key: uploadedImageKeySchema }),
])

export const updatePostImagesSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
  order: z
    .array(imageOrderItemSchema)
    .min(1, 'A post needs at least one image')
    .max(MAX_IMAGES_PER_POST, `Maximum ${MAX_IMAGES_PER_POST} images per post`),
})

export const postIdSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
})

export type UpdatePostImagesInput = z.input<typeof updatePostImagesSchema>
export type UpdatePostInput = z.input<typeof updatePostSchema>
