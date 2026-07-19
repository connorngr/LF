import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const isAdmin = await isAuthenticated()
  const posts = await prisma.post.findMany({
    where: isAdmin ? undefined : { isPrivate: false },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return NextResponse.json(posts)
}
