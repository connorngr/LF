import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getUrl } from '@/lib/r2'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { MarkdownContent } from '@/components/molecules/MarkdownContent'
import { BackButtonWrapper } from '../atoms/BackButtonWrapper'
import { LoadingPhoto } from './LoadingPhoto'

type PostDetail = Readonly<{
  imageUrl: string
  caption: string | null
  createdAt: Date
  images: { imageUrl: string; sortOrder: number }[]
}>

async function getPostById(id: string): Promise<PostDetail | null> {
  return prisma.post.findFirst({
    where: { id },
    select: {
      imageUrl: true,
      caption: true,
      createdAt: true,
      images: {
        orderBy: { sortOrder: 'asc' },
        select: { imageUrl: true, sortOrder: true },
      },
    },
  })
}

export async function ImageDetail({ id }: Readonly<{ id: string }>) {
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  const imageKeys = post.images.length > 0
    ? post.images.map((img) => img.imageUrl)
    : [post.imageUrl]

  const images = await Promise.all(
    imageKeys.map(async (imageKey) => ({
      key: imageKey,
      url: await getUrl(imageKey),
    }))
  )
  const imageCountLabel = `${images.length} image${images.length === 1 ? '' : 's'}`

  return (
    <article>
      <Carousel
        opts={{ align: 'start', loop: images.length > 1 }}
        className="grid overflow-hidden bg-card lg:grid-cols-[minmax(0,1fr)_18rem] rounded-2xl"
      >
        <div className="relative min-w-0 ">
          <CarouselContent className="ml-0">
            {images.map((image, index) => (
              <CarouselItem key={image.key} className="pl-0">
                <figure className="relative flex aspect-photo max-h-[80vh] min-h-[80vh] w-full items-center justify-center">
                  <LoadingPhoto
                    src={image.url}
                    alt={`${post.caption ?? 'Uploaded image'} - ${index + 1}`}
                  />
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        <aside className="flex items-center justify-between gap-3 bg-background/85 px-3 py-2.5 lg:flex-col lg:items-stretch lg:justify-between lg:px-4 lg:py-5">
          <div className="hidden space-y-3 lg:block">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Photo details
            </p>
            <div className="space-y-2">
              {post.caption?.trim() ? (
                <MarkdownContent
                  source={post.caption}
                  className="text-sm leading-6 text-foreground [&_*:first-child]:mt-0 [&_*:last-child]:mb-0"
                />
              ) : (
                <p className="text-sm leading-6 text-foreground">No caption was added.</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 lg:w-full">
            <BackButtonWrapper>
              <Link
                href="/"
                className="inline-flex text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                Back to gallery
              </Link>
            </BackButtonWrapper>


            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {imageCountLabel}
              </span>
              {images.length > 1 ? (
                <div className="flex items-center gap-1">
                  <CarouselPrevious className="static translate-y-0 border-border bg-card shadow-none hover:bg-muted disabled:opacity-40" />
                  <CarouselNext className="static translate-y-0 border-border bg-card shadow-none hover:bg-muted disabled:opacity-40" />
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </Carousel>
    </article>
  )
}
