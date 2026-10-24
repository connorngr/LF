import type { ReactNode } from 'react'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminPostTile } from '@/components/molecules/AdminPostTile'
import { GallerySoundBadge } from '@/components/atoms/GallerySoundBadge'
import { GalleryPrivateBadge } from '@/components/atoms/GalleryPrivateBadge'
import { GalleryPinBadge } from '@/components/atoms/GalleryPinBadge'
import { GalleryBusinessBadge } from '@/components/atoms/GalleryBusinessBadge'
import { GalleryTileLink } from '@/components/molecules/GalleryTileLink'
import { GalleryYearNav } from '@/components/molecules/GalleryYearNav'
import Image from 'next/image'
import { getUrl } from '@/lib/r2'
import { galleryYearSectionId, groupPostsByYear, type GalleryYearGroup } from '@/lib/gallery-years'

type GalleryMode = 'view' | 'edit'

// Gallery order is year desc -> isPinned desc -> createdAt desc (pinned posts
// lead their own year). Prisma's orderBy cannot sort by an extracted year, so
// the posts are picked here in SQL and ordered for display by groupPostsByYear.
// LIF-37: paginate with the cursor (year, isPinned, createdAt, id) taken from
// the last row, i.e. continue with rows that sort after it in this ORDER BY.
async function getGalleryPostIds(
  limit: number,
  includePrivate: boolean,
  businessOnly: boolean,
): Promise<string[]> {
  const conditions = [
    ...(includePrivate ? [] : [Prisma.sql`is_private = false`]),
    ...(businessOnly ? [Prisma.sql`is_business = true`] : []),
  ]
  const where =
    conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` : Prisma.empty
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM posts
    ${where}
    ORDER BY EXTRACT(YEAR FROM created_at) DESC, is_pinned DESC, created_at DESC, id DESC
    LIMIT ${limit}
  `
  return rows.map((row) => row.id)
}

type EditPostSummary = Readonly<{
  id: string
  slug: string
  name: string
  caption: string
  imageUrl: string
  soundCloudTrackId: string | null
  isPrivate: boolean
  isPinned: boolean
  isBusiness: boolean
  createdAt: Date
  _count: { images: number }
}>

type ViewPostSummary = Readonly<{
  slug: string
  name: string
  imageUrl: string
  soundCloudTrackId: string | null
  isPrivate: boolean
  isPinned: boolean
  isBusiness: boolean
  createdAt: Date
  _count: { images: number }
}>

async function getLatestPosts(
  limit: number,
  mode: 'edit',
  includePrivate: boolean,
  businessOnly: boolean,
): Promise<EditPostSummary[]>
async function getLatestPosts(
  limit: number,
  mode: 'view',
  includePrivate: boolean,
  businessOnly: boolean,
): Promise<ViewPostSummary[]>
async function getLatestPosts(
  limit: number,
  mode: GalleryMode,
  includePrivate: boolean,
  businessOnly: boolean,
): Promise<EditPostSummary[] | ViewPostSummary[]> {
  const ids = await getGalleryPostIds(limit, includePrivate, businessOnly)
  if (ids.length === 0) return []
  const where = {
    id: { in: ids },
    ...(includePrivate ? {} : { isPrivate: false }),
    ...(businessOnly ? { isBusiness: true } : {}),
  }

  if (mode === 'edit') {
    return prisma.post.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        caption: true,
        imageUrl: true,
        soundCloudTrackId: true,
        isPrivate: true,
        isPinned: true,
        isBusiness: true,
        createdAt: true,
        _count: { select: { images: true } },
      },
    })
  }

  return prisma.post.findMany({
    where,
    select: {
      slug: true,
      name: true,
      imageUrl: true,
      soundCloudTrackId: true,
      isPrivate: true,
      isPinned: true,
      isBusiness: true,
      createdAt: true,
      _count: { select: { images: true } },
    },
  })
}

async function renderEditTile(post: EditPostSummary) {
  return (
    <AdminPostTile
      key={post.slug}
      postId={post.id}
      slug={post.slug}
      name={post.name}
      caption={post.caption}
      imageSrc={await getUrl(post.imageUrl)}
      imageCount={post._count.images}
      hasSoundtrack={Boolean(post.soundCloudTrackId)}
      isPrivate={post.isPrivate}
      isPinned={post.isPinned}
      isBusiness={post.isBusiness}
    />
  )
}

// Avatar keeps priority on `/`; gallery tiles stay lazy so they don't compete for LCP.
async function renderViewTile(post: ViewPostSummary) {
  const hasStatusBadge = post.isPrivate || post.isPinned
  const src = await getUrl(post.imageUrl)
  return (
    <GalleryTileLink
      key={post.slug}
      slug={post.slug}
      className="group bg-muted relative isolate block overflow-hidden rounded-lg transition-transform duration-150 motion-safe:active:scale-[0.98]"
    >
      <figure>
        <div className="relative aspect-photo w-full">
          <Image
            src={src}
            alt={post.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 33vw, 25vw"
            loading="lazy"
            className="object-cover transition-[filter] duration-300 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
          />
          <p
            className="pointer-events-none uppercase absolute bottom-2 left-2 max-w-[min(100%,12rem)] truncate text-left text-[0.75rem] font-bold tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_12px_rgba(0,0,0,0.65)]"
          >
            {post.name}
          </p>
          {post.isPrivate ? <GalleryPrivateBadge /> : null}
          {post.isPinned ? <GalleryPinBadge /> : null}
          {post._count.images > 1 ? (
            <span
              className={`absolute top-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm ${
                hasStatusBadge ? 'left-8' : 'left-1.5'
              }`}
            >
              +{post._count.images}
            </span>
          ) : null}
          {post.isBusiness ? (
            <GalleryBusinessBadge besideSoundBadge={Boolean(post.soundCloudTrackId)} />
          ) : null}
          {post.soundCloudTrackId ? <GallerySoundBadge /> : null}
        </div>
      </figure>
    </GalleryTileLink>
  )
}

type RenderedYearSection = Readonly<{
  year: number
  tiles: ReactNode[]
}>

function renderYearSections<T>(
  groups: GalleryYearGroup<T>[],
  renderTile: (post: T) => Promise<ReactNode>,
): Promise<RenderedYearSection[]> {
  return Promise.all(
    groups.map(async ({ year, posts }) => ({
      year,
      tiles: await Promise.all(posts.map(renderTile)),
    })),
  )
}

type ImageGalleryProps = Readonly<{
  limit?: number
  mode?: GalleryMode
  /** View mode only: show business posts only (`/?mode=business`). */
  businessOnly?: boolean
}>

export async function ImageGallery({
  limit = 20,
  mode = 'view',
  businessOnly = false,
}: ImageGalleryProps) {
  const includePrivate = await isAuthenticated()
  const posts =
    mode === 'edit'
      ? await getLatestPosts(limit, 'edit', includePrivate, false)
      : await getLatestPosts(limit, 'view', includePrivate, businessOnly)

  if (posts.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="font-heading text-xl">Photo grid</h2>
        <p className="text-sm text-muted-foreground">
          {businessOnly && mode === 'view'
            ? 'No business posts yet.'
            : 'No posts have been uploaded yet.'}
        </p>
      </section>
    )
  }

  const sections =
    mode === 'edit'
      ? await renderYearSections(groupPostsByYear(posts as EditPostSummary[]), renderEditTile)
      : await renderYearSections(groupPostsByYear(posts as ViewPostSummary[]), renderViewTile)

  // `/upload` nests the grid under its own h2, so year headings drop a level there.
  const YearHeading = mode === 'edit' ? 'h3' : 'h2'

  return (
    <section className="space-y-4">
      {sections.length > 1 ? <GalleryYearNav years={sections.map(({ year }) => year)} /> : null}
      {sections.map(({ year, tiles }) => {
        const sectionId = galleryYearSectionId(year)
        return (
          <section
            key={year}
            id={sectionId}
            data-gallery-year={year}
            aria-labelledby={`${sectionId}-heading`}
            className="scroll-mt-14 space-y-2"
          >
            <YearHeading
              id={`${sectionId}-heading`}
              tabIndex={-1}
              className="flex items-center gap-3 font-heading text-sm font-semibold tabular-nums text-muted-foreground outline-none after:h-px after:flex-1 after:bg-border"
            >
              {year}
            </YearHeading>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-1">{tiles}</div>
          </section>
        )
      })}
    </section>
  )
}

export function ImageGallerySkeleton({ count = 20 }: Readonly<{ count?: number }>) {
  const tileCount = Math.max(Math.min(count, 30), 0)
  const skeletonKeys = Array.from(
    { length: tileCount },
    (_, index) => `gallery-skeleton-${index}`
  )

  return (
    <section className="space-y-3">
      <h2 className="font-heading text-xl">
        <Skeleton className="h-7 w-28" />
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
        {skeletonKeys.map((skeletonKey) => (
          <div key={skeletonKey} className="space-y-1">
            <Skeleton className="aspect-photo w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ))}
      </div>
    </section>
  )
}
