"use client"

import { uploadImage } from '@/actions/upload'
import { Button } from '@/components/ui/button'
import { useActionState } from 'react'

type UploadFormResult = {
    status: 'idle' | 'success' | 'error'
    message: string
    imageUrl?: string
    postId?: string
}

const initialState: UploadFormResult = {
    status: 'idle',
    message: '',
}

async function handleUpload(
    _prev: UploadFormResult,
    formData: FormData
): Promise<UploadFormResult> {
    const result = await uploadImage(formData)

    if ('error' in result) {
        return {
            status: 'error',
            message: result.error || 'Upload failed',
        }
    }

    return {
        status: 'success',
        message: 'Upload successful',
        imageUrl: result.url,
        postId: result.postId,
    }
}

export function UploadForm() {
    const [state, formAction, isPending] = useActionState(handleUpload, initialState)

    return (
        <form
            action={formAction}
            className="sticky top-4 space-y-5 rounded-lg border border-border/50 bg-gradient-to-b from-card to-card/95 p-6 shadow-sm backdrop-blur-sm"
        >
            <div className="space-y-1">
                <h3 className="font-semibold">Add Photo</h3>
                <p className="text-xs text-muted-foreground">Upload a new image to your gallery</p>
            </div>

            <label className="space-y-2.5">
                <span className="block text-sm font-medium">Image</span>
                <input
                    className="block w-full cursor-pointer rounded-md border border-dashed border-input/50 bg-background/50 px-3 py-4 text-sm transition-colors hover:border-input hover:bg-background focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    type="file"
                    name="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required
                />
            </label>

            <label className="space-y-2.5">
                <span className="block text-sm font-medium">Caption <span className="text-xs font-normal text-muted-foreground">(optional)</span></span>
                <textarea
                    name="caption"
                    rows={3}
                    maxLength={500}
                    className="block w-full resize-none rounded-md border border-input/50 bg-background/50 px-3 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/60 hover:border-input focus:border-primary focus:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    placeholder="Add a short caption or description..."
                />
            </label>

            <Button type="submit" size="sm" disabled={isPending} className="w-full">
                {isPending ? (
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                        Uploading...
                    </div>
                ) : (
                    'Upload Image'
                )}
            </Button>

            {state.status === 'error' && (
                <div className="space-y-1.5 rounded-md bg-destructive/10 p-3">
                    <p className="text-xs font-medium text-destructive">Upload failed</p>
                    <p className="text-xs text-destructive/80">{state.message}</p>
                </div>
            )}

            {state.status === 'success' && (
                <div className="space-y-3 rounded-md bg-emerald-50/50 p-3 dark:bg-emerald-950/20">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{state.message}</p>
                        <p className="text-xs text-muted-foreground">Post ID: <span className="font-mono text-xs">{state.postId}</span></p>
                    </div>
                    {state.imageUrl && (
                        <img
                            src={state.imageUrl}
                            alt="Uploaded image preview"
                            className="w-full rounded-md border border-border/30 object-cover"
                        />
                    )}
                </div>
            )}
        </form>
    )
}
