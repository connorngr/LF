import { Briefcase } from 'lucide-react'

type GalleryBusinessBadgeProps = Readonly<{
  /** Sits left of the soundtrack badge when both are shown. */
  besideSoundBadge?: boolean
}>

export function GalleryBusinessBadge({ besideSoundBadge = false }: GalleryBusinessBadgeProps) {
  return (
    <span
      role="img"
      className={`pointer-events-none absolute bottom-1.5 rounded-full bg-black/70 p-1 text-white backdrop-blur-sm ${
        besideSoundBadge ? 'right-8' : 'right-1.5'
      }`}
      aria-label="Business post"
    >
      <Briefcase className="size-3" aria-hidden />
    </span>
  )
}
