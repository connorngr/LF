import { Suspense } from "react";
import {
  PersonalInfoHero,
  PersonalInfoHeroSkeleton,
} from "@/components/organisms/PersonalInfoHero";
import {
  ImageGallery,
  ImageGallerySkeleton,
} from "@/components/organisms/ImageGallery";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { GALLERY_MODE_PARAM, isBusinessMode } from "@/lib/gallery-filter";

type HomePageProps = Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

export default async function HomePage({ searchParams }: HomePageProps) {
  const businessOnly = isBusinessMode((await searchParams)[GALLERY_MODE_PARAM]);


  return (
    <main className="relative mx-auto max-w-5xl px-4 py-8 space-y-8">
      <ThemeToggle className="absolute right-4 top-4" />
      <Suspense fallback={<PersonalInfoHeroSkeleton />}>
        <PersonalInfoHero businessOnly={businessOnly} />
      </Suspense>
      {/* Keyed so switching modes shows the skeleton instead of the stale grid. */}
      <Suspense key={String(businessOnly)} fallback={<ImageGallerySkeleton />}>
        <ImageGallery businessOnly={businessOnly} />
      </Suspense>
    </main>
  );
}
