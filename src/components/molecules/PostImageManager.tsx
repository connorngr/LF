'use client'

import { Button } from '@/components/ui/button'
import { MAX_IMAGES_PER_POST } from '@/schemas/upload'
import { ArrowDown, ArrowUp, X } from 'lucide-react'
import Image from 'next/image'
import type { ChangeEvent } from 'react'

export type EditableImage =
  | { kind: 'existing'; id: string; src: string }
  | { kind: 'new'; localId: string; file: File; src: string }

type PostImageManagerProps = Readonly<{
  postId: string
  images: EditableImage[] | null
  loadError: string | null
  error: string | null
  disabled: boolean
  onMove: (index: number, direction: -1 | 1) => void
  onRemove: (index: number) => void
  onAddFiles: (files: File[]) => void
}>

export function imageItemKey(image: EditableImage): string {
  return image.kind === 'existing' ? image.id : image.localId
}

export function PostImageManager({
  postId,
  images,
  loadError,
  error,
  disabled,
  onMove,
  onRemove,
  onAddFiles,
}: PostImageManagerProps) {
  const count = images?.length ?? 0
  const atLimit = count >= MAX_IMAGES_PER_POST
  const inputId = `edit-images-${postId}`

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    event.target.value = ''
    if (files.length > 0) onAddFiles(files)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium">Images</span>
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {count} / {MAX_IMAGES_PER_POST}
        </span>
      </div>

      {loadError ? <p className="text-xs text-destructive">{loadError}</p> : null}

      {images === null && !loadError ? (
        <p className="text-xs text-muted-foreground">Loading images...</p>
      ) : null}

      {images && images.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((image, index) => (
            <li key={imageItemKey(image)} className="relative overflow-hidden rounded-md bg-muted">
              <div className="relative aspect-square w-full">
                <Image
                  src={image.src}
                  alt={`Image ${index + 1}`}
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
                {index === 0 ? (
                  <span className="absolute left-1 top-1 rounded bg-black/70 px-1 text-[10px] text-white">
                    Cover
                  </span>
                ) : null}
                {image.kind === 'new' ? (
                  <span className="absolute bottom-1 left-1 rounded bg-primary px-1 text-[10px] text-primary-foreground">
                    New
                  </span>
                ) : null}
              </div>
              <Button
                type="button"
                size="icon-xs"
                variant="destructive"
                className="absolute right-1 top-1"
                aria-label={`Remove image ${index + 1}`}
                onClick={() => onRemove(index)}
                disabled={disabled || count <= 1}
              >
                <X />
              </Button>
              <div className="absolute bottom-1 right-1 flex gap-1">
                <Button
                  type="button"
                  size="icon-xs"
                  variant="secondary"
                  aria-label={`Move image ${index + 1} up`}
                  onClick={() => onMove(index, -1)}
                  disabled={disabled || index === 0}
                >
                  <ArrowUp />
                </Button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="secondary"
                  aria-label={`Move image ${index + 1} down`}
                  onClick={() => onMove(index, 1)}
                  disabled={disabled || index === count - 1}
                >
                  <ArrowDown />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div>
        <label
          htmlFor={inputId}
          className={`inline-flex cursor-pointer items-center rounded-md border border-input/50 px-3 py-1.5 text-xs transition-colors hover:border-input ${
            disabled || atLimit || images === null ? 'pointer-events-none opacity-50' : ''
          }`}
          aria-disabled={disabled || atLimit || images === null}
        >
          {atLimit ? 'Image limit reached' : 'Add images'}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={handleFileChange}
          disabled={disabled || atLimit || images === null}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        The first image is the cover shown in the gallery.
      </p>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
