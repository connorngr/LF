import Link from 'next/link'
import { ImageDetail } from '@/components/organisms/ImageDetail'
import { BackButtonWrapper } from '@/components/atoms/BackButtonWrapper'
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
      <div className="absolute right-4 top-4">
        <BackButtonWrapper>
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-black hover:bg-white"
          >
            Close
          </Link>
        </BackButtonWrapper>
      </div>
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
        <ImageDetail id={id} />
      </div>
    </div>
  )
}