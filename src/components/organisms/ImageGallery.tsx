import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminPostTile } from '@/components/molecules/AdminPostTile'
import { GallerySoundBadge } from '@/components/atoms/GallerySoundBadge'
import { GalleryPrivateBadge } from '@/components/atoms/GalleryPrivateBadge'
import { GalleryPinBadge } from '@/components/atoms/GalleryPinBadge'
import { GalleryTileLink } from '@/components/molecules/GalleryTileLink'
import Image from 'next/image'
import { getUrl } from '@/lib/r2'

type GalleryMode = 'view' | 'edit'

const galleryOrderBy = [{ isPinned: 'desc' as const }, { createdAt: 'desc' as const }]

type EditPostSummary = Readonly<{
  id: string
  slug: string
  name: string
  caption: string
  imageUrl: string
  soundCloudTrackId: string | null
  isPrivate: boolean
  isPinned: boolean
  _count: { images: number }
}>

type ViewPostSummary = Readonly<{
  slug: string
  name: string
  imageUrl: string
  soundCloudTrackId: string | null
  isPrivate: boolean
  isPinned: boolean
  _count: { images: number }
}>

async function getLatestPosts(
  limit: number,
  mode: 'edit',
  includePrivate: boolean,
): Promise<EditPostSummary[]>
async function getLatestPosts(
  limit: number,
  mode: 'view',
  includePrivate: boolean,
): Promise<ViewPostSummary[]>
async function getLatestPosts(
  limit: number,
  mode: GalleryMode,
  includePrivate: boolean,
): Promise<EditPostSummary[] | ViewPostSummary[]> {
  const where = includePrivate ? undefined : { isPrivate: false }

  if (mode === 'edit') {
    return prisma.post.findMany({
      where,
      orderBy: galleryOrderBy,
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        caption: true,
        imageUrl: true,
        soundCloudTrackId: true,
        isPrivate: true,
        isPinned: true,
        _count: { select: { images: true } },
      },
    })
  }

  return prisma.post.findMany({
    where,
    orderBy: galleryOrderBy,
    take: limit,
    select: {
      slug: true,
      name: true,
      imageUrl: true,
      soundCloudTrackId: true,
      isPrivate: true,
      isPinned: true,
      _count: { select: { images: true } },
    },
  })
}

type ImageGalleryProps = Readonly<{
  limit?: number
  mode?: GalleryMode
}>

export async function ImageGallery({ limit = 20, mode = 'view' }: ImageGalleryProps) {
  const includePrivate = await isAuthenticated()
  const posts =
    mode === 'edit'
      ? await getLatestPosts(limit, 'edit', includePrivate)
      : await getLatestPosts(limit, 'view', includePrivate)

  if (posts.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="font-heading text-xl">Photo grid</h2>
        <p className="text-sm text-muted-foreground">No posts have been uploaded yet.</p>
      </section>
    )
  }

  const editTiles =
    mode === 'edit'
      ? await Promise.all(
          (posts as EditPostSummary[]).map(async (post) => (
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
            />
          )),
        )
      : null

  // Avatar keeps priority on `/`; gallery tiles stay lazy so they don't compete for LCP.
  const viewTiles =
    mode === 'view'
      ? await Promise.all(
          (posts as ViewPostSummary[]).map(async (post) => {
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
                    {post.soundCloudTrackId ? <GallerySoundBadge /> : null}
                  </div>
                </figure>
              </GalleryTileLink>
            )
          }),
        )
      : null

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
        {editTiles ?? viewTiles}
      </div>
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
