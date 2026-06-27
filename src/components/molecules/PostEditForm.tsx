'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updatePost } from '@/actions/posts'
import { updatePostSchema, type UpdatePostInput } from '@/schemas/post'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { useState } from 'react'

type PostEditFormProps = Readonly<{
  postId: string
  name: string
  caption: string
  hasExistingTrack: boolean
  onSuccess: () => void
}>

type EditFormResult =
  | { status: 'idle'; message: '' }
  | { status: 'error'; message: string }

const initialState: EditFormResult = {
  status: 'idle',
  message: '',
}

export function PostEditForm({
  postId,
  name,
  caption,
  hasExistingTrack,
  onSuccess,
}: PostEditFormProps) {
  const [editState, setEditState] = useState<EditFormResult>(initialState)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePostInput>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      postId,
      name,
      caption,
      soundCloudUrl: undefined,
      changeSoundtrack: false,
    },
  })

  const changeSoundtrack = watch('changeSoundtrack')
  const showSoundCloudInput = hasExistingTrack ? changeSoundtrack : true

  const onSubmit = async (data: UpdatePostInput) => {
    setEditState(initialState)
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
