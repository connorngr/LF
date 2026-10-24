import { ImageDetailSkeleton } from '@/components/organisms/ImageDetailSkeleton'

export default function PhotoLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <ImageDetailSkeleton />
    </main>
  )
}
