import { beforeEach, describe, expect, it, vi } from 'vitest'

const prismaMock = {
  post: { create: vi.fn(async () => ({ id: 'post-1' })) },
  image: { createMany: vi.fn(async () => ({ count: 1 })) },
}

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }))
vi.mock('@/lib/auth', () => ({ isAuthenticated: vi.fn(async () => true) }))
vi.mock('@/lib/iframely', () => ({ resolveSoundCloudTrack: vi.fn() }))
vi.mock('@/lib/slug', () => ({ generateUniqueSlug: vi.fn(async () => 'studio') }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/r2', () => ({
  deleteFromR2: vi.fn(),
  getObjectBufferFromR2: vi.fn(async () => Buffer.from('img')),
  getPresignedUploadUrl: vi.fn(),
  uploadThumbnailToR2: vi.fn(async () => 'images/thumb-1-aaa.webp'),
}))

const { finalizeImageUpload } = await import('@/actions/upload')

const input = { name: 'Studio', caption: 'Client shoot', imageKeys: ['images/1-aaa.jpg'] }

describe('finalizeImageUpload isBusiness', () => {
  beforeEach(() => {
    prismaMock.post.create.mockClear()
  })

  it('persists isBusiness alongside private', async () => {
    const result = await finalizeImageUpload({ ...input, isBusiness: true, isPrivate: true })

    expect(result).toEqual({ success: true, postId: 'post-1' })
    expect(prismaMock.post.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ isBusiness: true, isPrivate: true, isPinned: false }),
    })
  })

  it('defaults isBusiness to false', async () => {
    await finalizeImageUpload(input)

    expect(prismaMock.post.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ isBusiness: false }),
    })
  })
})
