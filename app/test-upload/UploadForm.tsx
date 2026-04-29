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
        postId: result.postId,
    }
}

export function UploadForm() {
    const [state, formAction, isPending] = useActionState(handleUpload, initialState)

    return (
        <form
            action={formAction}
            className="space-y-4 rounded-lg border border-border/60 bg-card p-5"
        >
            <label className="space-y-2">
                <span className="block text-sm font-medium">Image</span>
                <input
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    type="file"
                    name="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required
                />
            </label>

            <label className="space-y-2">
                <span className="block text-sm font-medium">Caption (optional)</span>
                <textarea
                    name="caption"
                    rows={3}
                    maxLength={500}
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Add a short caption..."
                />
            </label>

            <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? 'Uploading...' : 'Upload image'}
            </Button>

            {state.status === 'error' ? <p className="text-sm text-destructive">{state.message}</p> : null}

            {state.status === 'success' ? (
                <div className="space-y-2 text-sm">
                    <p className="font-medium text-emerald-600">{state.message}</p>
                    <p className="text-muted-foreground">Post ID: {state.postId}</p>
                    {state.imageUrl ? (
                        <img
                            src={state.imageUrl}
                            alt="Uploaded image preview"
                            className="max-h-40 w-full rounded-md border border-border object-cover"
                        />
                    ) : null}
                </div>
            ) : null}
        </form>
    )
}
