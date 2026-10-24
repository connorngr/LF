import { describe, expect, it } from 'vitest'
import { updatePostSchema } from './post'

const base = {
  postId: '7f1c2a9e-3b4d-4e5f-8a6b-1c2d3e4f5a6b',
  name: 'Studio',
  caption: 'Client shoot',
}

describe('updatePostSchema isBusiness', () => {
  it('defaults to false when omitted', () => {
    const result = updatePostSchema.parse(base)
    expect(result.isBusiness).toBe(false)
  })

  it('keeps an explicit true', () => {
    const result = updatePostSchema.parse({ ...base, isBusiness: true })
    expect(result.isBusiness).toBe(true)
  })

  it('allows business together with pinned', () => {
    const result = updatePostSchema.safeParse({ ...base, isBusiness: true, isPinned: true })
    expect(result.success).toBe(true)
  })

  it('allows business together with private', () => {
    const result = updatePostSchema.safeParse({ ...base, isBusiness: true, isPrivate: true })
    expect(result.success).toBe(true)
  })

  it('rejects a non-boolean value', () => {
    const result = updatePostSchema.safeParse({ ...base, isBusiness: 'yes' })
    expect(result.success).toBe(false)
  })
})
