// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  nextThemePreference,
  readThemePreference,
  resolveTheme,
  setThemePreference,
  themeInitScript,
} from './theme'

function mockSystemTheme(dark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: dark && query === '(prefers-color-scheme: dark)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

function runInitScript() {
  new Function(themeInitScript)()
}

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.removeAttribute('style')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('uses a versioned storage key', () => {
    expect(THEME_STORAGE_KEY).toBe('lifeframe:theme:v1')
  })

  it('defaults to system and ignores unknown stored values', () => {
    expect(readThemePreference()).toBe('system')
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia')
    expect(readThemePreference()).toBe('system')
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    expect(readThemePreference()).toBe('dark')
  })

  it('falls back to system when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(readThemePreference()).toBe('system')
  })

  it('resolves system from prefers-color-scheme', () => {
    mockSystemTheme(true)
    expect(resolveTheme('system')).toBe('dark')
    mockSystemTheme(false)
    expect(resolveTheme('system')).toBe('light')
    expect(resolveTheme('dark')).toBe('dark')
  })

  it('cycles light -> dark -> system -> light', () => {
    expect(nextThemePreference('light')).toBe('dark')
    expect(nextThemePreference('dark')).toBe('system')
    expect(nextThemePreference('system')).toBe('light')
  })

  it('persists explicit choices, clears storage for system, and notifies listeners', () => {
    mockSystemTheme(false)
    const listener = vi.fn()
    window.addEventListener(THEME_CHANGE_EVENT, listener)

    setThemePreference('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')

    setThemePreference('system')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    expect(listener).toHaveBeenCalledTimes(2)
    window.removeEventListener(THEME_CHANGE_EVENT, listener)
  })

  it('still applies the theme when storage writes throw', () => {
    mockSystemTheme(false)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    setThemePreference('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('inline script applies the stored choice', () => {
    mockSystemTheme(false)
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    runInitScript()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('inline script follows the system preference when nothing is stored', () => {
    mockSystemTheme(true)
    runInitScript()
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    document.documentElement.className = ''
    mockSystemTheme(false)
    runInitScript()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('inline script survives storage and matchMedia being unavailable', () => {
    vi.stubGlobal('matchMedia', undefined)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(runInitScript).not.toThrow()
    expect(document.documentElement.style.colorScheme).toBe('light')
  })
})
