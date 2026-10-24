type YearGroupablePost = Readonly<{
  isPinned: boolean
  createdAt: Date
}>

export type GalleryYearGroup<T> = Readonly<{
  year: number
  posts: T[]
}>

// Year is the UTC upload year so it matches EXTRACT(YEAR FROM created_at) in the
// gallery query (Prisma stores `createdAt` as UTC).
export function getGalleryYear(createdAt: Date): number {
  return createdAt.getUTCFullYear()
}

export function galleryYearSectionId(year: number): string {
  return `gallery-year-${year}`
}

// Order: year desc -> isPinned desc -> createdAt desc. Pinned posts lead their
// own year instead of forming one global block.
export function compareGalleryPosts(a: YearGroupablePost, b: YearGroupablePost): number {
  const yearDiff = getGalleryYear(b.createdAt) - getGalleryYear(a.createdAt)
  if (yearDiff !== 0) return yearDiff
  if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
  return b.createdAt.getTime() - a.createdAt.getTime()
}

export function groupPostsByYear<T extends YearGroupablePost>(
  posts: readonly T[],
): GalleryYearGroup<T>[] {
  const groups: { year: number; posts: T[] }[] = []

  for (const post of posts.toSorted(compareGalleryPosts)) {
    const year = getGalleryYear(post.createdAt)
    const current = groups.at(-1)
    if (current?.year === year) {
      current.posts.push(post)
    } else {
      groups.push({ year, posts: [post] })
    }
  }

  return groups
}
