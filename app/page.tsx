import { Suspense } from 'react'
import {
  PersonalInfoHero,
  PersonalInfoHeroSkeleton,
} from '@/components/organisms/PersonalInfoHero'

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Suspense fallback={<PersonalInfoHeroSkeleton />}>
        <PersonalInfoHero />
      </Suspense>
    </main>
  )
}
