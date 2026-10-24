import { describe, expect, it } from 'vitest'
import { postMetadataSchema } from './upload'

const base = { name: 'Studio', caption: 'Client shoot' }

describe('postMetadataSchema isBusiness', () => {
  it('defaults to false when omitted', () => {
    expect(postMetadataSchema.parse(base).isBusiness).toBe(false)
  })

  it('keeps an explicit true alongside pinned and private', () => {
    const result = postMetadataSchema.parse({
      ...base,
      isBusiness: true,
      isPinned: true,
    })
    expect(result).toMatchObject({ isBusiness: true, isPinned: true })
    expect(
      postMetadataSchema.parse({ ...base, isBusiness: true, isPrivate: true }),
    ).toMatchObject({ isBusiness: true, isPrivate: true })
  })

  it('rejects a non-boolean value', () => {
    expect(postMetadataSchema.safeParse({ ...base, isBusiness: 1 }).success).toBe(false)
  })
})
