import { prisma } from '@/lib/prisma'

export async function getLatestPostTrackId(): Promise<string | null> {
  const post = await prisma.post.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { soundCloudTrackId: true },
  })

  return post?.soundCloudTrackId ?? null
}
