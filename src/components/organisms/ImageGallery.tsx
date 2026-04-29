import { prisma } from '@/lib/prisma'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { getUrl } from '@/lib/r2'

type PostSummary = Readonly<{
  id: string
  imageUrl: string
  caption: string | null
}>

async function getLatestPosts(limit: number): Promise<PostSummary[]> {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { id: true, imageUrl: true, caption: true },
  })
}

export async function ImageGallery({ limit = 20 }: { limit?: number }) {
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
              <img
                src={await getUrl(post.imageUrl)}
                alt={post.caption ?? 'Uploaded image'}
                className="block h-full w-full object-cover aspect-[3/4]"
                loading="lazy"
              />
              {post.caption ? (
                <figcaption className="overflow-hidden px-2 pb-1.5 pt-1 text-[11px] leading-snug text-muted-foreground whitespace-nowrap text-ellipsis">
                  {post.caption}
                </figcaption>
              ) : null}
            </figure>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function ImageGallerySkeleton({ count = 20 }: { count?: number }) {
  const tileCount = Math.max(Math.min(count, 30), 0)

  return (
    <section className="space-y-3">
      <h2 className="font-heading text-xl">
        <Skeleton className="h-7 w-28" />
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1">
        {Array.from({ length: tileCount }).map((_, index) => (
          <div key={index} className="space-y-1">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        ))}
      </div>
    </section>
  )
}
