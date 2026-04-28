'use client'

import { useActionState } from 'react'

export function UploadForm({
  action,
}: {
  action: (formData: FormData) => Promise<{ success?: boolean; postId?: string; error?: string }>
}) {
  const [state, formAction, pending] = useActionState(
    (_prev: any, formData: FormData) => action(formData),
    null,
  )

  return (
    <form action={formAction} className="mb-10 space-y-4 rounded-lg border p-6">
      <div>
        <label className="block text-sm font-medium mb-1">Image File</label>
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          required
          className="block w-full text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Caption (optional)</label>
        <input
          type="text"
          name="caption"
          placeholder="A memorable moment..."
          maxLength={500}
          className="block w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-500">Uploaded! Post ID: {state.postId}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {pending ? 'Uploading...' : 'Upload to R2'}
      </button>
    </form>
  )
}
