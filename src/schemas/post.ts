import { z } from 'zod'

export const updatePostSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(10, 'Name must be less than 10 characters'),
  caption: z
    .string()
    .min(1, 'Caption is required')
    .max(500, 'Caption must be less than 500 characters'),
})

export const deletePostSchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
})

export type UpdatePostInput = z.infer<typeof updatePostSchema>
