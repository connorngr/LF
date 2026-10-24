'use client'

import { useOptimistic, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/analytics/track'
import { buildGalleryModeSearch } from '@/lib/gallery-filter'
import { cn } from '@/lib/utils'

type BusinessModeToggleProps = Readonly<{
  enabled: boolean
}>

// The mode lives in the URL (`/?mode=business`) so the filtered gallery is
// server-rendered and shareable; the switch flips optimistically meanwhile.
export function BusinessModeToggle({ enabled }: BusinessModeToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(enabled)

  const handleClick = () => {
    const next = !optimisticEnabled
    trackEvent('business_mode_toggle', { enabled: next })
    startTransition(() => {
      setOptimisticEnabled(next)
      const search = buildGalleryModeSearch(window.location.search, next)
      router.replace(`${pathname}${search}`, { scroll: false })
    })
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimisticEnabled}
      aria-busy={isPending || undefined}
      onClick={handleClick}
      className="group inline-flex items-center gap-2 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        aria-hidden
        className={cn(
          'relative inline-flex h-4 w-7 shrink-0 items-center rounded-full border border-transparent transition-colors',
          optimisticEnabled ? 'bg-primary' : 'bg-muted-foreground/40',
        )}
      >
        <span
          className={cn(
            'block size-3 rounded-full bg-background shadow-sm transition-transform motion-reduce:transition-none',
            optimisticEnabled ? 'translate-x-3.5' : 'translate-x-0.5',
          )}
        />
      </span>
      <span
        className={cn(
          'transition-colors',
          optimisticEnabled ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
        )}
      >
        Business
      </span>
    </button>
  )
}
