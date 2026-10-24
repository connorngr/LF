export const THEME_STORAGE_KEY = 'lifeframe:theme:v1'
export const THEME_CHANGE_EVENT = 'lifeframe:themechange'

export const themePreferences = ['light', 'dark', 'system'] as const
export type ThemePreference = (typeof themePreferences)[number]
export type ResolvedTheme = 'light' | 'dark'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (themePreferences as readonly string[]).includes(value)
}

export function readThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isThemePreference(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== 'system') return preference
  try {
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function applyTheme(preference: ThemePreference) {
  const theme = resolveTheme(preference)
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

export function setThemePreference(preference: ThemePreference) {
  try {
    if (preference === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY)
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, preference)
    }
  } catch {
    // Storage unavailable (private mode, quota, disabled): apply for this page only.
  }
  applyTheme(preference)
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: preference }))
}

export function nextThemePreference(preference: ThemePreference): ThemePreference {
  const index = themePreferences.indexOf(preference)
  return themePreferences[(index + 1) % themePreferences.length]
}

/**
 * Inline script rendered in <head> so the theme class is set before first paint
 * (AGENTS.md 6.5). It also keeps the page in sync with OS theme changes and with
 * choices made in other tabs. Must stay self-contained ES5: it runs before any bundle.
 */
export const themeInitScript = `(function () {
  var key = ${JSON.stringify(THEME_STORAGE_KEY)};
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia(${JSON.stringify(DARK_QUERY)}) : null;
  function read() {
    try {
      var v = localStorage.getItem(key);
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch (e) {
      return 'system';
    }
  }
  function apply() {
    var pref = read();
    var theme = pref === 'system' ? (media && media.matches ? 'dark' : 'light') : pref;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
  }
  apply();
  if (media && media.addEventListener) {
    media.addEventListener('change', function () {
      if (read() === 'system') apply();
    });
  }
  window.addEventListener('storage', function (e) {
    if (e.key === key || e.key === null) {
      apply();
      window.dispatchEvent(new Event(${JSON.stringify(THEME_CHANGE_EVENT)}));
    }
  });
})();`
