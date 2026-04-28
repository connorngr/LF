import { revalidatePath } from 'next/cache'
import { UploadForm } from './UploadForm'
import { getUrl } from '@/lib/r2'
import { uploadImage } from '@/actions/upload'
import { nextPublicBaseUrl } from '@/lib/env'

type Post = {
  id: string
  imageUrl: string
  caption: string | null
  createdAt: string
}

async function getPosts(): Promise<Post[]> {
  try {const response = await fetch(`${nextPublicBaseUrl}/api/posts`, {
      cache: 'no-store',
    })
    if (!response.ok) return []
    return response.json()
  } catch {
    return []
  }
}

async function handleUpload(formData: FormData) {
  'use server'

  const result = await uploadImage(formData)
  
  if (result.success) {
    revalidatePath('/test-upload')
  }

  return result
}

export default async function TestUploadPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">Storage Test — R2 Upload</h1>

        <UploadForm action={handleUpload} />

        <h2 className="mb-4 text-xl font-semibold">Uploaded Images ({posts.length})</h2>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No images yet. Upload one above.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {posts.map(async post => (
              <div key={post.id} className="overflow-hidden rounded-lg border">
                <img
                  src={await getUrl(post.imageUrl)}
                  alt={post.caption || 'Uploaded image'}
                  className="aspect-square w-full object-cover"
                />
                {post.caption && (
                  <p className="truncate p-2 text-xs text-muted-foreground">{post.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
