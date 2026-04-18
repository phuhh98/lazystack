import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { ThemeMode } from '@/lib/utils/theme'

import { getInitialThemeMode, UI_PREFERENCES_STORAGE_KEY } from '@/lib/utils/theme'

interface UiPreferencesStore {
  setThemeMode: (mode: ThemeMode) => void
  themeMode: ThemeMode
}

const noopStorage = {
  getItem: () => null,
  removeItem: () => {},
  setItem: () => {},
}

const useUiPreferencesStore = create<UiPreferencesStore>()(
  persist(
    (set) => ({
      setThemeMode: (mode) => {
        set({ themeMode: mode })
      },
      themeMode: getInitialThemeMode(),
    }),
    {
      name: UI_PREFERENCES_STORAGE_KEY,
      storage: createJSONStorage(() => (typeof window === 'undefined' ? noopStorage : globalThis.localStorage)),
    },
  ),
)

export default useUiPreferencesStore
