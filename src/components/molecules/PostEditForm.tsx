'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getPostImages, updatePost, updatePostImages } from '@/actions/posts'
import { prepareImageUploads } from '@/actions/upload'
import {
  PostImageManager,
  type EditableImage,
} from '@/components/molecules/PostImageManager'
import { remainingImageSlots } from '@/lib/post-images'
import { updatePostSchema, type UpdatePostInput } from '@/schemas/post'
import { fileDescriptorSchema } from '@/schemas/upload'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { useEffect, useRef, useState } from 'react'

type PostEditFormProps = Readonly<{
  postId: string
  name: string
  caption: string
  hasExistingTrack: boolean
  isPrivate: boolean
  isPinned: boolean
  isBusiness: boolean
  onSuccess: () => void
}>

type EditFormResult =
  | { status: 'idle'; message: '' }
  | { status: 'error'; message: string }

const initialState: EditFormResult = {
  status: 'idle',
  message: '',
}

async function loadEditableImages(
  postId: string,
): Promise<{ images: EditableImage[] } | { error: string }> {
  try {
    const result = await getPostImages(postId)
    if ('error' in result) return { error: result.error || 'Could not load images' }
    return { images: result.images.map((image) => ({ kind: 'existing', ...image })) }
  } catch {
    return { error: 'Could not load images' }
  }
}

function haveImagesChanged(images: EditableImage[], initialIds: string[]): boolean {
  if (images.length !== initialIds.length) return true
  return images.some((image, index) => image.kind !== 'existing' || image.id !== initialIds[index])
}

/** Uploads new files via presigned URLs, then saves the final order. Returns an error message or null. */
async function saveImages(postId: string, images: EditableImage[]): Promise<string | null> {
  const newImages = images.flatMap((image) => (image.kind === 'new' ? [image] : []))
  const keyByLocalId = new Map<string, string>()

  if (newImages.length > 0) {
    const prepareResult = await prepareImageUploads(
      newImages.map(({ file }) => ({ contentType: file.type, size: file.size })),
    )
    if ('error' in prepareResult) {
      return prepareResult.error || 'Upload failed'
    }

    try {
      await Promise.all(
        prepareResult.uploads.map(async (upload, index) => {
          const { file, localId } = newImages[index]
          const response = await fetch(upload.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          })
          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`)
          }
          keyByLocalId.set(localId, upload.key)
        }),
      )
    } catch {
      return 'Failed to upload images to storage. If this persists, check R2 CORS allows PUT from your site origin.'
    }
  }

  const result = await updatePostImages({
    postId,
    order: images.map((image) =>
      image.kind === 'existing'
        ? { kind: 'existing' as const, id: image.id }
        : { kind: 'new' as const, key: keyByLocalId.get(image.localId) ?? '' },
    ),
  })

  return 'error' in result ? result.error || 'Image update failed' : null
}

export function PostEditForm({
  postId,
  name,
  caption,
  hasExistingTrack,
  isPrivate,
  isPinned,
  isBusiness,
  onSuccess,
}: PostEditFormProps) {
  const [editState, setEditState] = useState<EditFormResult>(initialState)
  const [images, setImages] = useState<EditableImage[] | null>(null)
  const [initialImageIds, setInitialImageIds] = useState<string[]>([])
  const [imageLoadError, setImageLoadError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const previewUrlsRef = useRef(new Set<string>())

  const applyLoadedImages = (result: Awaited<ReturnType<typeof loadEditableImages>>) => {
    if ('error' in result) {
      setImageLoadError(result.error)
      return
    }
    setImageLoadError(null)
    setImages(result.images)
    setInitialImageIds(result.images.flatMap((image) => (image.kind === 'existing' ? [image.id] : [])))
  }

  // The form mounts when the edit dialog opens, so this loads the post's images on open.
  useEffect(() => {
    let cancelled = false
    void loadEditableImages(postId).then((result) => {
      if (!cancelled) applyLoadedImages(result)
    })
    return () => {
      cancelled = true
    }
  }, [postId])

  useEffect(() => {
    const previewUrls = previewUrlsRef.current
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
      previewUrls.clear()
    }
  }, [])

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      if (!current) return current
      const target = index + direction
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const removeImage = (index: number) => {
    if (!images || images.length <= 1) return
    setImageError(null)
    const image = images[index]
    if (image.kind === 'new') {
      URL.revokeObjectURL(image.src)
      previewUrlsRef.current.delete(image.src)
    }
    setImages(images.toSpliced(index, 1))
  }

  const addFiles = (files: File[]) => {
    if (!images) return
    const slots = remainingImageSlots(images.length, 0, 0)
    const invalid = files.find(
      (file) => !fileDescriptorSchema.safeParse({ contentType: file.type, size: file.size }).success,
    )
    if (invalid) {
      setImageError(`${invalid.name}: only JPEG, PNG, WebP, and GIF images under 30MB are allowed`)
      return
    }
    if (files.length > slots) {
      setImageError(`You can add ${slots} more image${slots === 1 ? '' : 's'} (maximum 10 per post)`)
      return
    }
    setImageError(null)
    const added: EditableImage[] = files.map((file) => {
      const src = URL.createObjectURL(file)
      previewUrlsRef.current.add(src)
      return { kind: 'new', localId: crypto.randomUUID(), file, src }
    })
    setImages([...images, ...added])
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePostInput>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      postId,
      name,
      caption,
      soundCloudUrl: undefined,
      changeSoundtrack: false,
      isPrivate,
      isPinned,
      isBusiness,
    },
  })

  const changeSoundtrack = useWatch({ control, name: 'changeSoundtrack' })
  const watchedIsPrivate = useWatch({ control, name: 'isPrivate' })
  const watchedIsPinned = useWatch({ control, name: 'isPinned' })
  const showSoundCloudInput = hasExistingTrack ? changeSoundtrack : true

  const onSubmit = async (data: UpdatePostInput) => {
    setEditState(initialState)

    if (images && haveImagesChanged(images, initialImageIds)) {
      const imageSaveError = await saveImages(postId, images)
      if (imageSaveError) {
        setEditState({ status: 'error', message: imageSaveError })
        return
      }
      // Reload so a retry after a metadata error does not upload the same files again.
      applyLoadedImages(await loadEditableImages(postId))
    }

    const result = await updatePost(data)

    if ('error' in result) {
      setEditState({
        status: 'error',
        message: result.error || 'Update failed',
      })
      return
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('postId')} />

      <div className="space-y-2">
        <label htmlFor={`edit-name-${postId}`} className="block text-sm font-medium">
          Name
        </label>
        <input
          {...register('name')}
          id={`edit-name-${postId}`}
          type="text"
          className="block w-full rounded-md border border-input/50 bg-background/50 px-3 py-2.5 text-sm transition-colors hover:border-input focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          disabled={isSubmitting}
        />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor={`edit-caption-${postId}`} className="block text-sm font-medium">
          Caption
        </label>
        <textarea
          {...register('caption')}
          id={`edit-caption-${postId}`}
          rows={4}
          maxLength={500}
          className="block w-full resize-none rounded-md border border-input/50 bg-background/50 px-3 py-2.5 text-sm transition-colors hover:border-input focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          disabled={isSubmitting}
        />
        {errors.caption ? (
          <p className="text-xs text-destructive">{errors.caption.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            {...register('isPrivate', {
              onChange: (event) => {
                if (event.target.checked) {
                  setValue('isPinned', false)
                }
              },
            })}
            type="checkbox"
            className="size-4 rounded border-input"
            disabled={isSubmitting || Boolean(watchedIsPinned)}
          />
          Private
        </label>
        <p className="text-xs text-muted-foreground">
          {watchedIsPinned
            ? 'Unpin the post before making it private.'
            : 'Hidden from the public gallery and photo URLs unless you are logged in as admin.'}
        </p>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            {...register('isPinned', {
              onChange: (event) => {
                if (event.target.checked) {
                  setValue('isPrivate', false)
                }
              },
            })}
            type="checkbox"
            className="size-4 rounded border-input"
            disabled={isSubmitting || Boolean(watchedIsPrivate)}
          />
          Pin to top
        </label>
        <p className="text-xs text-muted-foreground">
          {watchedIsPrivate
            ? 'Private posts cannot be pinned.'
            : 'Pinned posts appear first in the gallery.'}
        </p>
        {errors.isPinned ? (
          <p className="text-xs text-destructive">{errors.isPinned.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            {...register('isBusiness')}
            type="checkbox"
            className="size-4 rounded border-input"
            disabled={isSubmitting}
          />
          Business
        </label>
        <p className="text-xs text-muted-foreground">
          Marks the post as business work with a badge in the gallery.
        </p>
      </div>

      <PostImageManager
        postId={postId}
        images={images}
        loadError={imageLoadError}
        error={imageError}
        disabled={isSubmitting}
        onMove={moveImage}
        onRemove={removeImage}
        onAddFiles={addFiles}
      />

      {hasExistingTrack ? (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              {...register('changeSoundtrack')}
              type="checkbox"
              className="size-4 rounded border-input"
              disabled={isSubmitting}
            />
            Change soundtrack
          </label>
        </div>
      ) : null}

      {showSoundCloudInput ? (
        <div className="space-y-2">
          <label htmlFor={`edit-soundcloud-${postId}`} className="block text-sm font-medium">
            SoundCloud track{' '}
            <span className="text-xs font-normal text-muted-foreground">
              ({hasExistingTrack ? 'required' : 'optional'})
            </span>
          </label>
          <input
            {...register('soundCloudUrl')}
            id={`edit-soundcloud-${postId}`}
            type="url"
            className="block w-full rounded-md border border-input/50 bg-background/50 px-3 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/60 hover:border-input focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            placeholder="https://soundcloud.com/artist/track-name"
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground">
            Paste a SoundCloud track URL to {hasExistingTrack ? 'replace the current' : 'add a'} soundtrack.
          </p>
          {errors.soundCloudUrl ? (
            <p className="text-xs text-destructive">{errors.soundCloudUrl.message}</p>
          ) : null}
        </div>
      ) : null}

      {editState.status === 'error' ? (
        <p className="text-sm text-destructive">{editState.message}</p>
      ) : null}

      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" disabled={isSubmitting} />}>
          Cancel
        </DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </DialogFooter>
    </form>
  )
}
