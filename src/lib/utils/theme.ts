type ThemeMode = 'dark' | 'light'
const UI_PREFERENCES_STORAGE_KEY = 'ui-preferences'

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement

  root.classList.remove('light', 'dark')
  root.classList.add(mode)
  root.dataset.theme = mode
  root.style.colorScheme = mode
}

function getDocumentThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const stored = getStoredThemeMode()
  return resolveThemeMode(stored)
}

function getStoredThemeMode(): null | string {
  if (typeof window === 'undefined') {
    return null
  }

  const persistedState = globalThis.localStorage.getItem(UI_PREFERENCES_STORAGE_KEY)
  if (persistedState !== null) {
    try {
      const parsed = JSON.parse(persistedState) as {
        state?: {
          themeMode?: string
        }
      }

      const persistedTheme = parsed.state?.themeMode
      if (persistedTheme === 'dark' || persistedTheme === 'light') {
        return persistedTheme
      }
    } catch {
      // Ignore malformed persisted JSON and use legacy fallback.
    }
  }

  return globalThis.localStorage.getItem('theme')
}

function resolveThemeMode(stored: null | string): ThemeMode {
  if (stored === 'dark' || stored === 'light') {
    return stored
  }

  return 'dark'
}

const THEME_INIT_SCRIPT = `(function(){try{var persisted=window.localStorage.getItem('ui-preferences');var stored=null;if(persisted!==null){try{var parsed=JSON.parse(persisted);var persistedTheme=parsed&&parsed.state&&parsed.state.themeMode;if(persistedTheme==='light'||persistedTheme==='dark'){stored=persistedTheme;}}catch(_){}}if(stored===null){stored=window.localStorage.getItem('theme');}var mode=(stored==='light'||stored==='dark')?stored:'dark';var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(mode);root.dataset.theme=mode;root.style.colorScheme=mode;}catch(e){}})();`

export {
  applyThemeMode,
  getDocumentThemeMode,
  getInitialThemeMode,
  getStoredThemeMode,
  resolveThemeMode,
  THEME_INIT_SCRIPT,
  UI_PREFERENCES_STORAGE_KEY,
}
export type { ThemeMode }
