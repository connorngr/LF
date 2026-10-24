import { beforeEach, describe, expect, it, vi } from 'vitest'

const calls: string[] = []

const prismaMock = {
  post: { findUnique: vi.fn(), update: vi.fn(() => 'post.update') },
  image: {
    findMany: vi.fn(async () => []),
    deleteMany: vi.fn(() => 'image.deleteMany'),
    update: vi.fn(() => 'image.update'),
    createMany: vi.fn(() => 'image.createMany'),
  },
  $transaction: vi.fn(async () => {
    calls.push('transaction')
  }),
}

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }))
vi.mock('@/lib/auth', () => ({ isAuthenticated: vi.fn(async () => true) }))
vi.mock('@/lib/iframely', () => ({ resolveSoundCloudTrack: vi.fn() }))
vi.mock('@/lib/slug', () => ({ generateUniqueSlug: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/r2', () => ({
  deleteFromR2: vi.fn(async (key: string) => {
    calls.push(`delete:${key}`)
  }),
  getObjectBufferFromR2: vi.fn(async () => Buffer.from('img')),
  getUrl: vi.fn(async (key: string) => `signed:${key}`),
  headObjectFromR2: vi.fn(async (key: string) => ({
    contentLength: 10,
    contentType: key.endsWith('.png') ? 'image/png' : 'image/jpeg',
  })),
  uploadThumbnailToR2: vi.fn(async (_body: Buffer, key: string) => {
    calls.push(`thumbnail:${key}`)
    return `thumbnails/${key.split('/').pop()?.replace(/\.[^.]+$/, '')}.webp`
  }),
}))

const { updatePost, updatePostImages } = await import('@/actions/posts')
const { isAuthenticated } = await import('@/lib/auth')

const POST_ID = '11111111-1111-4111-8111-111111111111'
const IMG_A = '22222222-2222-4222-8222-222222222222'
const IMG_B = '33333333-3333-4333-8333-333333333333'

function mockPost(imageCount = 2) {
  const images = [
    { id: IMG_A, imageUrl: 'images/1-aaa.jpg' },
    { id: IMG_B, imageUrl: 'images/2-bbb.jpg' },
  ].slice(0, imageCount)
  prismaMock.post.findUnique.mockResolvedValue({
    slug: 'post',
    imageUrl: 'thumbnails/1-aaa.webp',
    images,
  })
}

describe('updatePostImages', () => {
  beforeEach(() => {
    calls.length = 0
    vi.clearAllMocks()
  })

  it('requires admin authentication', async () => {
    vi.mocked(isAuthenticated).mockResolvedValueOnce(false)
    const result = await updatePostImages({ postId: POST_ID, order: [{ kind: 'existing', id: IMG_A }] })
    expect(result).toEqual({ error: 'Unauthorized: Admin authentication required' })
    expect(prismaMock.$transaction).not.toHaveBeenCalled()
  })

  it('removes the first image, regenerates the thumbnail, and deletes R2 objects after the DB commit', async () => {
    mockPost()
    const result = await updatePostImages({ postId: POST_ID, order: [{ kind: 'existing', id: IMG_B }] })
    expect(result).toEqual({ success: true })
    expect(calls).toEqual([
      'thumbnail:images/2-bbb.jpg',
      'transaction',
      'delete:images/1-aaa.jpg',
      'delete:displays/1-aaa.webp',
      'delete:thumbnails/1-aaa.webp',
    ])
    expect(prismaMock.post.update).toHaveBeenCalledWith({
      where: { id: POST_ID },
      data: { imageUrl: 'thumbnails/2-bbb.webp' },
    })
  })

  it('adds a new image without touching the thumbnail when the cover stays', async () => {
    mockPost()
    const result = await updatePostImages({
      postId: POST_ID,
      order: [
        { kind: 'existing', id: IMG_A },
        { kind: 'existing', id: IMG_B },
        { kind: 'new', key: 'images/3-ccc.png' },
      ],
    })
    expect(result).toEqual({ success: true })
    expect(calls).toEqual(['transaction'])
    expect(prismaMock.image.createMany).toHaveBeenCalledWith({
      data: [{ imageUrl: 'images/3-ccc.png', sortOrder: 2, postId: POST_ID }],
    })
  })

  it('rejects exceeding the limit on the server', async () => {
    mockPost()
    const order = [
      { kind: 'existing' as const, id: IMG_A },
      { kind: 'existing' as const, id: IMG_B },
      ...Array.from({ length: 9 }, (_, index) => ({
        kind: 'new' as const,
        key: `images/9${index}-new.jpg`,
      })),
    ]
    const result = await updatePostImages({ postId: POST_ID, order })
    expect(result).toEqual({ error: 'Maximum 10 images per post' })
    expect(prismaMock.$transaction).not.toHaveBeenCalled()
  })

  it('cleans up uploaded keys when the plan is rejected', async () => {
    mockPost()
    const result = await updatePostImages({
      postId: POST_ID,
      order: [
        { kind: 'existing', id: '44444444-4444-4444-8444-444444444444' },
        { kind: 'new', key: 'images/5-eee.jpg' },
      ],
    })
    expect(result).toEqual({ error: 'Image does not belong to this post' })
    expect(prismaMock.$transaction).not.toHaveBeenCalled()
    expect(calls).toEqual(['delete:images/5-eee.jpg'])
  })

  it('keeps R2 objects when the DB update fails', async () => {
    mockPost()
    prismaMock.$transaction.mockRejectedValueOnce(new Error('db down'))
    const result = await updatePostImages({ postId: POST_ID, order: [{ kind: 'existing', id: IMG_B }] })
    expect(result).toEqual({ error: 'Failed to update images. Please try again.' })
    expect(calls).toEqual(['thumbnail:images/2-bbb.jpg', 'delete:thumbnails/2-bbb.webp'])
  })
})

describe('updatePost isBusiness', () => {
  beforeEach(() => {
    prismaMock.post.update.mockClear()
    prismaMock.post.findUnique.mockResolvedValue({
      id: POST_ID,
      name: 'Studio',
      slug: 'studio',
      soundCloudTrackId: null,
    })
  })

  it('persists isBusiness together with pinned', async () => {
    const result = await updatePost({
      postId: POST_ID,
      name: 'Studio',
      caption: 'Client shoot',
      isPinned: true,
      isBusiness: true,
    })

    expect(result).toEqual({ success: true, newSlug: undefined })
    expect(prismaMock.post.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isBusiness: true, isPinned: true }),
      }),
    )
  })

  it('clears isBusiness when omitted', async () => {
    await updatePost({ postId: POST_ID, name: 'Studio', caption: 'Client shoot' })

    expect(prismaMock.post.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ isBusiness: false }) }),
    )
  })
})
