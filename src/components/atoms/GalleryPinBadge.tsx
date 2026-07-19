import { Pin } from 'lucide-react'

export function GalleryPinBadge() {
  return (
    <span
      className="pointer-events-none absolute left-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white backdrop-blur-sm"
      aria-label="Pinned post"
    >
      <Pin className="size-3" aria-hidden />
    </span>
  )
}
