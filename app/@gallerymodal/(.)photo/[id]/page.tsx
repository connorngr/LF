import { ImageDetail } from '@/components/organisms/ImageDetail'
import { use } from 'react'

type GalleryModalPageProps = {
  params: {
    id: string
  }
}

export default function GalleryModalPage({ params }: GalleryModalPageProps) {
  const { id } = use(Promise.resolve(params) as Promise<GalleryModalPageProps['params']>)
  return (
    <div className="fixed inset-0 z-50 bg-black/85 p-4">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
        <ImageDetail id={id} />
      </div>
    </div>
  )
}