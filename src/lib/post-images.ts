import { MAX_IMAGES_PER_POST } from '@/schemas/upload'

export type ExistingPostImage = Readonly<{
  id: string
  imageUrl: string
}>

/** One slot in the edited image order: either an image already on the post or a freshly uploaded key. */
export type ImageOrderItem =
  | Readonly<{ kind: 'existing'; id: string }>
  | Readonly<{ kind: 'new'; key: string }>

export type ImageEditPlan = Readonly<{
  /** Existing images that stay, with their new sortOrder. */
  keep: { id: string; sortOrder: number }[]
  /** New Image rows to create. */
  create: { imageUrl: string; sortOrder: number }[]
  /** Existing images that were dropped from the order. */
  removed: ExistingPostImage[]
  /** Original key of the image that will be first after the edit. */
  firstImageKey: string
  /** True when the first image differs from the current first image. */
  firstImageChanged: boolean
}>

export type ImageEditPlanResult =
  | { ok: true; plan: ImageEditPlan }
  | { ok: false; error: string }

/** How many more images can be added given the current state of the edit. */
export function remainingImageSlots(
  existingCount: number,
  removedCount: number,
  addedCount: number,
): number {
  return Math.max(0, MAX_IMAGES_PER_POST - (existingCount - removedCount + addedCount))
}

export function isWithinImageLimit(
  existingCount: number,
  removedCount: number,
  addedCount: number,
): boolean {
  const total = existingCount - removedCount + addedCount
  return total >= 1 && total <= MAX_IMAGES_PER_POST
}

/**
 * Turns the edited order into DB changes. `existing` must be in current sortOrder.
 * Existing images missing from `order` are treated as removed.
 */
export function planImageEdit(
  existing: readonly ExistingPostImage[],
  order: readonly ImageOrderItem[],
): ImageEditPlanResult {
  const existingById = new Map(existing.map((image) => [image.id, image]))
  const seenIds = new Set<string>()
  const seenKeys = new Set<string>()
  const keep: { id: string; sortOrder: number }[] = []
  const create: { imageUrl: string; sortOrder: number }[] = []
  const orderedKeys: string[] = []

  for (const [sortOrder, item] of order.entries()) {
    if (item.kind === 'existing') {
      const image = existingById.get(item.id)
      if (!image) {
        return { ok: false, error: 'Image does not belong to this post' }
      }
      if (seenIds.has(item.id)) {
        return { ok: false, error: 'Duplicate image in order' }
      }
      seenIds.add(item.id)
      keep.push({ id: item.id, sortOrder })
      orderedKeys.push(image.imageUrl)
    } else {
      if (seenKeys.has(item.key) || existing.some((image) => image.imageUrl === item.key)) {
        return { ok: false, error: 'Duplicate image in order' }
      }
      seenKeys.add(item.key)
      create.push({ imageUrl: item.key, sortOrder })
      orderedKeys.push(item.key)
    }
  }

  const removed = existing.filter((image) => !seenIds.has(image.id))

  if (!isWithinImageLimit(existing.length, removed.length, create.length)) {
    return {
      ok: false,
      error:
        orderedKeys.length === 0
          ? 'A post needs at least one image'
          : `Maximum ${MAX_IMAGES_PER_POST} images per post`,
    }
  }

  const firstImageKey = orderedKeys[0]
  return {
    ok: true,
    plan: {
      keep,
      create,
      removed,
      firstImageKey,
      firstImageChanged: firstImageKey !== existing[0]?.imageUrl,
    },
  }
}

function keyBase(key: string): string {
  const filename = key.split('/').pop() || ''
  return filename.replace(/\.[^.]+$/, '') || filename
}

/** R2 keys derived from an original image key (WebP display copy). */
export function getDerivedImageKeys(originalKey: string): string[] {
  return [`displays/${keyBase(originalKey)}.webp`]
}
