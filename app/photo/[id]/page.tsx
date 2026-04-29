import { ImageDetail } from '@/components/organisms/ImageDetail'

type PhotoPageProps = {
  params: {
    id: string
  }
}

export default function PhotoPage({ params }: PhotoPageProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <ImageDetail id={params.id} />
    </main>
  )
}
