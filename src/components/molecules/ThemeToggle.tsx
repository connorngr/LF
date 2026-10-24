'use client'

import { useSyncExternalStore } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  THEME_CHANGE_EVENT,
  nextThemePreference,
  readThemePreference,
  setThemePreference,
  type ThemePreference,
} from '@/lib/theme'

const themeLabels: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} satisfies Record<ThemePreference, unknown>

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onChange)
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange)
}

// Server and hydration render as "system"; the real stored value is picked up right after.
function getServerSnapshot(): ThemePreference {
  return 'system'
}

export function ThemeToggle({ className }: { className?: string }) {
  const preference = useSyncExternalStore(subscribe, readThemePreference, getServerSnapshot)
  const next = nextThemePreference(preference)
  const Icon = themeIcons[preference]
  const label = `Theme: ${themeLabels[preference]}. Switch to ${themeLabels[next].toLowerCase()} theme`

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label={label}
      title={label}
      onClick={() => setThemePreference(next)}
      className={cn('rounded-full text-muted-foreground hover:text-foreground', className)}
    >
      <Icon aria-hidden />
    </Button>
  )
}
