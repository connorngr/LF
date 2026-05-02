import { ImageDetail } from '@/components/organisms/ImageDetail'

export default async function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params 
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <ImageDetail id={id} />
    </main>
  )
}
