import { describe, expect, it } from 'vitest'
import { galleryYearSectionId, getGalleryYear, groupPostsByYear } from './gallery-years'

function post(id: string, createdAt: string, isPinned = false) {
  return { id, createdAt: new Date(createdAt), isPinned }
}

describe('groupPostsByYear', () => {
  it('returns no groups for no posts', () => {
    expect(groupPostsByYear([])).toEqual([])
  })

  it('orders years descending and keeps pinned posts within their own year', () => {
    const posts = [
      post('old-pinned', '2024-03-01T00:00:00Z', true),
      post('new-a', '2026-02-01T00:00:00Z'),
      post('mid', '2025-07-01T00:00:00Z'),
      post('new-pinned', '2026-01-01T00:00:00Z', true),
      post('new-b', '2026-05-01T00:00:00Z'),
      post('old', '2024-08-01T00:00:00Z'),
    ]

    const groups = groupPostsByYear(posts)

    expect(groups.map((group) => group.year)).toEqual([2026, 2025, 2024])
    expect(groups.map((group) => group.posts.map((p) => p.id))).toEqual([
      ['new-pinned', 'new-b', 'new-a'],
      ['mid'],
      ['old-pinned', 'old'],
    ])
  })

  it('sorts several pinned posts in a year by date', () => {
    const groups = groupPostsByYear([
      post('pinned-old', '2025-01-01T00:00:00Z', true),
      post('plain', '2025-12-01T00:00:00Z'),
      post('pinned-new', '2025-06-01T00:00:00Z', true),
    ])

    expect(groups).toHaveLength(1)
    expect(groups[0].posts.map((p) => p.id)).toEqual(['pinned-new', 'pinned-old', 'plain'])
  })

  it('does not mutate the input array', () => {
    const posts = [post('a', '2024-01-01T00:00:00Z'), post('b', '2026-01-01T00:00:00Z')]
    groupPostsByYear(posts)
    expect(posts.map((p) => p.id)).toEqual(['a', 'b'])
  })

  it('uses the UTC year at year boundaries', () => {
    const groups = groupPostsByYear([
      post('new-year', '2026-01-01T00:30:00Z'),
      post('new-years-eve', '2025-12-31T23:30:00Z'),
    ])

    expect(groups.map((group) => [group.year, group.posts[0].id])).toEqual([
      [2026, 'new-year'],
      [2025, 'new-years-eve'],
    ])
  })
})

describe('gallery year helpers', () => {
  it('derives the UTC year and a stable section id', () => {
    expect(getGalleryYear(new Date('2024-12-31T23:59:59Z'))).toBe(2024)
    expect(galleryYearSectionId(2025)).toBe('gallery-year-2025')
  })
})
