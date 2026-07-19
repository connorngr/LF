import { z } from 'zod'
import { optionalSoundCloudUrlSchema } from '@/schemas/soundcloud'

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

export type UpdatePostInput = z.input<typeof updatePostSchema>
