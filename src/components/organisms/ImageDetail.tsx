import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getUrl } from '@/lib/r2'
import { BackButtonWrapper } from '../atoms/BackButtonWrapper'

type PostDetail = Readonly<{
  id: string
  imageUrl: string
  caption: string | null
  createdAt: Date
}>

async function getPostById(id: string): Promise<PostDetail | null> {
  return prisma.post.findFirst({
    where: { id },
    select: { id: true, imageUrl: true, caption: true, createdAt: true },
  })
}

export async function ImageDetail({ id }: { id: string }) {
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <article className="space-y-4">
      <figure className="bg-black">
        <img
          src={await getUrl(post.imageUrl)}
          alt={post.caption ?? 'Uploaded image'}
          className="mx-auto block h-auto max-h-[75vh] w-full max-w-5xl object-contain"
        />
      </figure>
      <div className="space-y-1 text-sm">
        {post.caption ? <p className="leading-relaxed text-foreground">{post.caption}</p> : null}
        <p className="text-xs text-muted-foreground">
          Uploaded {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(post.createdAt)}
        </p>
      </div>
      <BackButtonWrapper>
        <Link href="/" className="inline-block text-sm text-muted-foreground underline underline-offset-4">
          Back to gallery
        </Link>
      </BackButtonWrapper>
    </article>
  )
}
