import { useEffect, useState } from 'react'

import type { ThemeMode } from '@/lib/utils/theme'

import { getDocumentThemeMode } from '@/lib/utils/theme'

export default function useDocumentThemeMode(): ThemeMode {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getDocumentThemeMode())

  useEffect(() => {
    const updateThemeMode = () => {
      setThemeMode(getDocumentThemeMode())
    }

    updateThemeMode()

    const themeObserver = new MutationObserver(updateThemeMode)
    themeObserver.observe(document.documentElement, {
      attributeFilter: ['class', 'data-theme', 'style'],
    })

    return () => {
      themeObserver.disconnect()
    }
  }, [])

  return themeMode
}
