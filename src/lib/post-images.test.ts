import { describe, expect, it } from 'vitest'
import {
  getDerivedImageKeys,
  isWithinImageLimit,
  planImageEdit,
  remainingImageSlots,
  type ExistingPostImage,
} from '@/lib/post-images'
import { MAX_IMAGES_PER_POST } from '@/schemas/upload'

function makeExisting(count: number): ExistingPostImage[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `id-${index}`,
    imageUrl: `images/100${index}-abc.jpg`,
  }))
}

describe('image limit math', () => {
  it('computes remaining slots from existing - removed + added', () => {
    expect(remainingImageSlots(7, 0, 0)).toBe(3)
    expect(remainingImageSlots(7, 2, 1)).toBe(4)
    expect(remainingImageSlots(10, 0, 0)).toBe(0)
    expect(remainingImageSlots(10, 0, 3)).toBe(0)
  })

  it('accepts totals between 1 and the maximum', () => {
    expect(isWithinImageLimit(7, 0, 3)).toBe(true)
    expect(isWithinImageLimit(10, 1, 1)).toBe(true)
    expect(isWithinImageLimit(1, 0, 0)).toBe(true)
  })

  it('rejects totals above the maximum or below one', () => {
    expect(isWithinImageLimit(7, 0, 4)).toBe(false)
    expect(isWithinImageLimit(10, 0, 1)).toBe(false)
    expect(isWithinImageLimit(3, 3, 0)).toBe(false)
  })
})

describe('planImageEdit', () => {
  it('keeps unchanged order without changing the first image', () => {
    const existing = makeExisting(3)
    const result = planImageEdit(
      existing,
      existing.map(({ id }) => ({ kind: 'existing' as const, id })),
    )
    expect(result).toEqual({
      ok: true,
      plan: {
        keep: [
          { id: 'id-0', sortOrder: 0 },
          { id: 'id-1', sortOrder: 1 },
          { id: 'id-2', sortOrder: 2 },
        ],
        create: [],
        removed: [],
        firstImageKey: existing[0].imageUrl,
        firstImageChanged: false,
      },
    })
  })

  it('reorders and flags a new first image', () => {
    const existing = makeExisting(3)
    const result = planImageEdit(existing, [
      { kind: 'existing', id: 'id-2' },
      { kind: 'existing', id: 'id-0' },
      { kind: 'existing', id: 'id-1' },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.plan.keep).toEqual([
      { id: 'id-2', sortOrder: 0 },
      { id: 'id-0', sortOrder: 1 },
      { id: 'id-1', sortOrder: 2 },
    ])
    expect(result.plan.firstImageKey).toBe(existing[2].imageUrl)
    expect(result.plan.firstImageChanged).toBe(true)
  })

  it('treats missing existing images as removed and changes the cover when the first is removed', () => {
    const existing = makeExisting(3)
    const result = planImageEdit(existing, [
      { kind: 'existing', id: 'id-1' },
      { kind: 'existing', id: 'id-2' },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.plan.removed).toEqual([existing[0]])
    expect(result.plan.firstImageChanged).toBe(true)
    expect(result.plan.firstImageKey).toBe(existing[1].imageUrl)
  })

  it('interleaves new images with their sortOrder', () => {
    const existing = makeExisting(2)
    const result = planImageEdit(existing, [
      { kind: 'existing', id: 'id-0' },
      { kind: 'new', key: 'images/200-new.png' },
      { kind: 'existing', id: 'id-1' },
    ])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.plan.create).toEqual([{ imageUrl: 'images/200-new.png', sortOrder: 1 }])
    expect(result.plan.keep).toEqual([
      { id: 'id-0', sortOrder: 0 },
      { id: 'id-1', sortOrder: 2 },
    ])
    expect(result.plan.firstImageChanged).toBe(false)
  })

  it('allows reaching exactly the limit after removals', () => {
    const existing = makeExisting(MAX_IMAGES_PER_POST)
    const order = [
      ...existing.slice(1).map(({ id }) => ({ kind: 'existing' as const, id })),
      { kind: 'new' as const, key: 'images/300-new.jpg' },
    ]
    const result = planImageEdit(existing, order)
    expect(result.ok).toBe(true)
  })

  it('rejects going over the limit', () => {
    const existing = makeExisting(MAX_IMAGES_PER_POST)
    const result = planImageEdit(existing, [
      ...existing.map(({ id }) => ({ kind: 'existing' as const, id })),
      { kind: 'new', key: 'images/300-new.jpg' },
    ])
    expect(result).toEqual({ ok: false, error: `Maximum ${MAX_IMAGES_PER_POST} images per post` })
  })

  it('rejects removing every image', () => {
    const result = planImageEdit(makeExisting(2), [])
    expect(result).toEqual({ ok: false, error: 'A post needs at least one image' })
  })

  it('rejects ids from another post and duplicates', () => {
    const existing = makeExisting(2)
    expect(planImageEdit(existing, [{ kind: 'existing', id: 'other' }]).ok).toBe(false)
    expect(
      planImageEdit(existing, [
        { kind: 'existing', id: 'id-0' },
        { kind: 'existing', id: 'id-0' },
      ]).ok,
    ).toBe(false)
    expect(
      planImageEdit(existing, [
        { kind: 'existing', id: 'id-0' },
        { kind: 'new', key: existing[1].imageUrl },
      ]).ok,
    ).toBe(false)
    expect(
      planImageEdit(existing, [
        { kind: 'new', key: 'images/1-a.jpg' },
        { kind: 'new', key: 'images/1-a.jpg' },
      ]).ok,
    ).toBe(false)
  })
})

describe('getDerivedImageKeys', () => {
  it('maps an original key to its display derivative', () => {
    expect(getDerivedImageKeys('images/123-abc.jpg')).toEqual(['displays/123-abc.webp'])
  })
})
