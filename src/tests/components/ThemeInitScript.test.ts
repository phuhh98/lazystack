import { beforeEach, describe, expect, it } from 'vitest'

import { THEME_INIT_SCRIPT, UI_PREFERENCES_STORAGE_KEY } from '@/lib/utils/theme'

function runThemeInitScript() {
  const executeScript = new Function(THEME_INIT_SCRIPT)
  executeScript()
}

describe('Theme init script', () => {
  function setPersistedTheme(mode: 'dark' | 'light') {
    localStorage.setItem(
      UI_PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        state: { themeMode: mode },
        version: 0,
      }),
    )
  }

  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
    delete document.documentElement.dataset.theme
    document.documentElement.style.colorScheme = ''

    Object.defineProperty(globalThis, 'matchMedia', {
      value: (query: string) => ({
        addEventListener: () => {},
        addListener: () => {},
        dispatchEvent: () => false,
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: () => {},
        removeListener: () => {},
      }),
      writable: true,
    })
  })

  it('uses stored light theme over system preference', () => {
    setPersistedTheme('light')
    Object.defineProperty(globalThis, 'matchMedia', {
      value: () => ({
        addEventListener: () => {},
        addListener: () => {},
        dispatchEvent: () => false,
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        removeEventListener: () => {},
        removeListener: () => {},
      }),
      writable: true,
    })

    runThemeInitScript()

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('uses stored dark theme over system preference', () => {
    setPersistedTheme('dark')
    Object.defineProperty(globalThis, 'matchMedia', {
      value: () => ({
        addEventListener: () => {},
        addListener: () => {},
        dispatchEvent: () => false,
        matches: false,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        removeEventListener: () => {},
        removeListener: () => {},
      }),
      writable: true,
    })

    runThemeInitScript()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('falls back to system dark when no stored value exists', () => {
    Object.defineProperty(globalThis, 'matchMedia', {
      value: () => ({
        addEventListener: () => {},
        addListener: () => {},
        dispatchEvent: () => false,
        matches: true,
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        removeEventListener: () => {},
        removeListener: () => {},
      }),
      writable: true,
    })

    runThemeInitScript()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('falls back to system light when no stored value exists', () => {
    runThemeInitScript()

    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('uses legacy theme key when Zustand preference is not present', () => {
    localStorage.setItem('theme', 'dark')

    runThemeInitScript()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
