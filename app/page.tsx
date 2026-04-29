import { Suspense } from 'react'
import {
  PersonalInfoHero,
  PersonalInfoHeroSkeleton,
} from '@/components/organisms/PersonalInfoHero'
import {
  ImageGallery,
  ImageGallerySkeleton,
} from '@/components/organisms/ImageGallery'

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Suspense fallback={<PersonalInfoHeroSkeleton />}>
        <PersonalInfoHero />
      </Suspense>
      <Suspense fallback={<ImageGallerySkeleton />}>
        <ImageGallery />
      </Suspense>
    </main>
  )
}
