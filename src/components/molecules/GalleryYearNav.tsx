'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { galleryYearSectionId } from '@/lib/gallery-years'
import { cn } from '@/lib/utils'

type GalleryYearNavProps = Readonly<{
  years: readonly number[]
}>

// Extra space below the sticky nav that still counts as "reached" so a year
// heading scrolled to via its scroll-margin becomes active.
const ACTIVE_LINE_OFFSET = 16
// Quiet time after the last scroll event that ends a click-triggered jump.
const SCROLL_SETTLE_MS = 150

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// Active year = the last section whose top has passed below the nav. At the
// very bottom of a scrolled page the last year wins, since a short final
// section can never reach the top of the viewport.
function findActiveYear(years: readonly number[], activeLine: number): number | undefined {
  const atBottom =
    window.scrollY > 0 &&
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  if (atBottom) return years.at(-1)

  let active = years[0]
  for (const year of years) {
    const section = document.getElementById(galleryYearSectionId(year))
    if (section && section.getBoundingClientRect().top <= activeLine) active = year
  }
  return active
}

export function GalleryYearNav({ years }: GalleryYearNavProps) {
  const [activeYear, setActiveYear] = useState(years[0])
  const navRef = useRef<HTMLElement>(null)
  // Year chosen in the nav; holds the highlight while its jump scrolls, since a
  // year near the end may stop short of the nav line.
  const clickedYear = useRef<number | null>(null)
  const yearsKey = years.join(',')

  useEffect(() => {
    const orderedYears = yearsKey.split(',').map(Number)
    let frame = 0
    let settleTimer: ReturnType<typeof setTimeout> | undefined

    const update = () => {
      frame = 0
      const activeLine = (navRef.current?.offsetHeight ?? 0) + ACTIVE_LINE_OFFSET
      const year = findActiveYear(orderedYears, activeLine)
      if (year !== undefined) setActiveYear(year)
    }
    const schedule = () => {
      if (clickedYear.current !== null) {
        clearTimeout(settleTimer)
        settleTimer = setTimeout(() => {
          clickedYear.current = null
        }, SCROLL_SETTLE_MS)
        return
      }
      if (frame === 0) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== 0) window.cancelAnimationFrame(frame)
      clearTimeout(settleTimer)
    }
  }, [yearsKey])

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>, year: number) {
    const sectionId = galleryYearSectionId(year)
    const section = document.getElementById(sectionId)
    if (!section) return

    event.preventDefault()
    clickedYear.current = year
    setActiveYear(year)
    section.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
    // Move keyboard focus to the year heading without a second scroll jump.
    document.getElementById(`${sectionId}-heading`)?.focus({ preventScroll: true })
  }

  return (
    <nav
      ref={navRef}
      aria-label="Gallery years"
      className="sticky top-0 z-20 -mx-1 border-b border-border bg-background/90 px-1 backdrop-blur-sm"
    >
      <ol className="flex h-11 items-center gap-1 overflow-x-auto text-sm">
        {years.map((year, index) => {
          const isActive = year === activeYear
          return (
            <Fragment key={year}>
              {index > 0 ? (
                <li aria-hidden className="select-none text-muted-foreground">
                  ·
                </li>
              ) : null}
              <li>
                <a
                  href={`#${galleryYearSectionId(year)}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(event) => handleClick(event, year)}
                  className={cn(
                    'rounded-md px-2 py-1 tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'font-semibold text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {year}
                </a>
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
