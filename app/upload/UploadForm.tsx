'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadImage } from '@/actions/upload'
import { uploadSchema, type UploadInput } from '@/schemas/upload'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type UploadFormResult =
  | { status: 'idle'; message: '' }
  | { status: 'success'; message: string; postId: string }
  | { status: 'error'; message: string }

const initialState: UploadFormResult = {
  status: 'idle',
  message: '',
}

export function UploadForm() {
  const [uploadState, setUploadState] = useState<UploadFormResult>(initialState)
  const [previews, setPreviews] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<UploadInput>({
    resolver: zodResolver(uploadSchema),
  })

  const files = watch('files')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    const newPreviews = Array.from(selectedFiles).map(file => URL.createObjectURL(file))
    setPreviews(newPreviews)
  }

  const onSubmit = async (data: UploadInput) => {
    const formData = new FormData()
    Array.from(data.files as FileList).forEach((file: File) => {
      formData.append('files', file)
    })
    formData.append('name', data.name)
    formData.append('caption', data.caption)

    const result = await uploadImage(formData)

    if ('error' in result) {
      setUploadState({
        status: 'error',
        message: result.error || 'Upload failed',
      })
    } else {
      setUploadState({
        status: 'success',
        message: 'Upload successful',
        postId: result.postId,
      })
      setPreviews([])
      reset()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="sticky top-4 space-y-5 rounded-lg border border-border/50 bg-linear-to-b from-card to-card/95 p-6 shadow-sm backdrop-blur-sm"
    >
      <div className="space-y-1">
        <h3 className="font-semibold">Add Photos</h3>
        <p className="text-xs text-muted-foreground">Upload up to 10 images to your gallery</p>
      </div>

      <div className="space-y-2.5">
        <label htmlFor="files" className="block text-sm font-medium">Images</label>
        <input
          {...register('files', {onChange: handleFileChange})}
          id="files"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="block w-full cursor-pointer rounded-md border border-dashed border-input/50 bg-background/50 px-3 py-4 text-sm transition-colors hover:border-input hover:bg-background focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          disabled={isSubmitting}
        />
        {errors.files && (
          <p className="text-xs text-destructive">{errors.files.message as string}</p>
        )}
      </div>

      {previews.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Selected: {previews.length} image(s)</p>
          <div className="grid grid-cols-4 gap-2">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="aspect-square w-full rounded-md object-cover border border-border/30"
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        <label htmlFor="name" className="block text-sm font-medium">
          Name <span className="text-xs font-normal text-muted-foreground">(required)</span>
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          className="block w-full rounded-md border border-input/50 bg-background/50 px-3 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/60 hover:border-input focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          placeholder="Title for this post"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2.5">
        <label htmlFor="caption" className="block text-sm font-medium">
          Caption <span className="text-xs font-normal text-muted-foreground">(required)</span>
        </label>
        <textarea
          {...register('caption')}
          id="caption"
          rows={3}
          maxLength={500}
          className="block w-full resize-none rounded-md border border-input/50 bg-background/50 px-3 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/60 hover:border-input focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          placeholder="Add a short caption or description..."
          disabled={isSubmitting}
        />
        {errors.caption && (
          <p className="text-xs text-destructive">{errors.caption.message}</p>
        )}
      </div>

      <Button type="submit" size="sm" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
            Uploading...
          </div>
        ) : (
          `Upload ${files?.length || ''} Image${files?.length === 1 ? '' : 's'}`
        )}
      </Button>

      {uploadState.status === 'error' && (
        <div className="space-y-1.5 rounded-md bg-destructive/10 p-3">
          <p className="text-xs font-medium text-destructive">Upload failed</p>
          <p className="text-xs text-destructive/80">{uploadState.message}</p>
        </div>
      )}

      {uploadState.status === 'success' && (
        <div className="space-y-3 rounded-md bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
          <div className="space-y-1">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{uploadState.message}</p>
            <p className="text-xs text-muted-foreground">
              Post ID: <span className="font-mono text-xs">{uploadState.postId}</span>
            </p>
          </div>
        </div>
      )}
    </form>
  )
}
