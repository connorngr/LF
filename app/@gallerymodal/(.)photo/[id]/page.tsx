import { ImageDetail } from '@/components/organisms/ImageDetail'

type GalleryModalPageProps = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function GalleryModalPage({ params }: GalleryModalPageProps) {
  const { id } = await params
  return <ImageDetail id={id} />
}
