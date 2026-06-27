'use client'

import { deletePost } from '@/actions/posts'
import { PostEditForm } from '@/components/molecules/PostEditForm'
import { GallerySoundBadge } from '@/components/atoms/GallerySoundBadge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type AdminPostTileProps = Readonly<{
  postId: string
  slug: string
  name: string
  caption: string
  imageSrc: string
  imageCount: number
  hasSoundtrack: boolean
}>

export function AdminPostTile({
  postId,
  slug,
  name,
  caption,
  imageSrc,
  imageCount,
  hasSoundtrack,
}: AdminPostTileProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = async () => {
    setDeleteError(null)
    setIsDeleting(true)
    const result = await deletePost(postId)
    setIsDeleting(false)

    if ('error' in result) {
      setDeleteError(result.error || 'Delete failed')
      return
    }

    setDeleteOpen(false)
    router.refresh()
  }

  return (
    <>
      <div className="relative">
        <Link
          href={`/photo/${slug}`}
          className="group bg-muted relative isolate block overflow-hidden rounded-lg"
        >
          <figure>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={name}
                className="block aspect-photo h-full w-full object-cover transition-[filter] duration-300 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
                loading="lazy"
              />
              <p
                className="pointer-events-none uppercase absolute bottom-2 left-2 max-w-[min(100%,12rem)] truncate text-left text-[0.75rem] font-bold tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_12px_rgba(0,0,0,0.65)]"
              >
                {name}
              </p>
              {imageCount > 1 ? (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm">
                  +{imageCount}
                </span>
              ) : null}
              {hasSoundtrack ? <GallerySoundBadge /> : null}
            </div>
          </figure>
        </Link>

        <div className="absolute right-1.5 top-1.5 z-10 flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-6 px-2 text-[10px] bg-black/70 text-white border-white/20 hover:bg-black/90 hover:text-white"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setEditOpen(true)
            }}
            disabled={isDeleting}
          >
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="h-6 px-2 text-[10px]"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDeleteError(null)
              setDeleteOpen(true)
            }}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>
            <DialogDescription>
              Update the name, caption, or soundtrack. Renaming changes the public URL slug.
            </DialogDescription>
          </DialogHeader>
          <PostEditForm
            postId={postId}
            name={name}
            caption={caption}
            hasExistingTrack={hasSoundtrack}
            onSuccess={() => {
              setEditOpen(false)
              router.refresh()
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the post, its images from storage, and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <p className="text-sm text-destructive">{deleteError}</p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete post'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
