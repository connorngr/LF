import { ImageGallery } from '@/components/organisms/ImageGallery'
import { UploadForm } from './UploadForm'

export default function TestUploadPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-heading">Upload test</h1>
          <p className="text-sm text-muted-foreground">
            Upload images with captions to verify the server action and R2 flow.
          </p>
        </div>
        <UploadForm />
        <section className="space-y-3">
          <ImageGallery />
        </section>
      </div>
    </main>
  )
}
