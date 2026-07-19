import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function getLatestPostTrackId(): Promise<string | null> {
  const isAdmin = await isAuthenticated()
  const post = await prisma.post.findFirst({
    where: {
      soundCloudTrackId: { not: null },
      ...(isAdmin ? {} : { isPrivate: false }),
    },
    orderBy: { createdAt: 'desc' },
    select: { soundCloudTrackId: true },
  })

  return post?.soundCloudTrackId ?? null
}
