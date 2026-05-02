import { prisma } from '@/lib/prisma'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { getUrl } from '@/lib/r2'

type PostSummary = Readonly<{
  id: string
  name: string
  imageUrl: string
  _count: { images: number }
}>

async function getLatestPosts(limit: number): Promise<PostSummary[]> {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, name: true, imageUrl: true, _count: { select: { images: true } } },
  })
}

export async function ImageGallery({ limit = 20 }: Readonly<{ limit?: number }>) {
  const posts = await getLatestPosts(limit)

  if (posts.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="font-heading text-xl">Photo grid</h2>
        <p className="text-sm text-muted-foreground">No posts have been uploaded yet.</p>
      </section>
    )
  }

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
        {posts.map(async (post) => (
          <Link
            key={post.id}
            href={`/photo/${post.id}`}
            className="bg-muted relative isolate block overflow-hidden rounded-lg"
          >
            <figure>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={await getUrl(post.imageUrl)}
                  alt={post.name}
                  className="block aspect-photo h-full w-full object-cover"
                  loading="lazy"
                />
                <p
                  className="pointer-events-none uppercase absolute bottom-2 left-2 max-w-[min(100%,12rem)] truncate text-left text-[0.75rem] font-bold tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_12px_rgba(0,0,0,0.65)]"
                >
                  {post.name}
                </p>
                {post._count.images > 1 && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm">
                    +{post._count.images}
                  </span>
                )}
              </div>
            </figure>
          </Link>
        ))}
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
