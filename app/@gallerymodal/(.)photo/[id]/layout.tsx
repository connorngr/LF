// Overlay lives in the segment layout so it renders (and fades in) once, while
// loading.tsx and page.tsx swap inside it without remounting the backdrop.
export default function GalleryModalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 p-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
        {children}
      </div>
    </div>
  )
}
