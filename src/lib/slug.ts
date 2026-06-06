import { prisma } from '@/lib/prisma'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || 'post'
  let slug = base
  let counter = 0

  while (await prisma.post.findUnique({ where: { slug }, select: { id: true } })) {
    counter += 1
    slug = `${base}-${counter}`
  }

  return slug
}
