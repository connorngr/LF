import { Music } from 'lucide-react'

export function GallerySoundBadge() {
  return (
    <span
      className="pointer-events-none absolute bottom-1.5 right-1.5 rounded-full bg-black/70 p-1 text-white backdrop-blur-sm"
      aria-label="Has soundtrack"
    >
      <Music className="size-3" aria-hidden />
    </span>
  )
}
