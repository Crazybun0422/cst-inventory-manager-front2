const VALID_THEMES = new Set(['defaultTheme', 'darkTheme'])
export const THEME_DEFAULT = 'darkTheme'

export function normalizeTheme(theme) {
  if (typeof theme !== 'string') return THEME_DEFAULT
  const trimmed = theme.trim()
  if (VALID_THEMES.has(trimmed)) return trimmed
  // Accept legacy tokens
  if (/dark/i.test(trimmed)) return 'darkTheme'
  if (/default|light/i.test(trimmed)) return 'defaultTheme'
  return THEME_DEFAULT
}

export function applyDocumentTheme(theme) {
  const normalized = normalizeTheme(theme)
  if (typeof document === 'undefined') return normalized
  const root = document.documentElement
  const opposite = normalized === 'darkTheme' ? 'defaultTheme' : 'darkTheme'
  root.classList.remove(opposite)
  root.classList.add(normalized)
  return normalized
}

export function getValidThemes() {
  return Array.from(VALID_THEMES)
}
