import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { UploadForm } from './UploadForm'
import { ImageGallery } from '@/components/organisms/ImageGallery'

export default function UploadPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 lg:py-16">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Upload</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Upload Images</h1>
          <p className="text-base text-muted-foreground">
            Add new photos to your gallery with optional captions. Images are stored securely and can be managed from your gallery.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <UploadForm />
          </div>

          <div className="lg:col-span-2">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Uploads</h2>
              </div>
              <ImageGallery />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
