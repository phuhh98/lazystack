import { CloudSun, MoonStar } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { ThemeMode } from '@/lib/utils/theme'

import Button from '@/components/basic/Button'
import useUiPreferencesStore from '@/lib/stores/uiPreferencesStore'
import { applyThemeMode } from '@/lib/utils/theme'

export default function ThemeToggle() {
  const mode = useUiPreferencesStore((state) => state.themeMode)
  const setThemeMode = useUiPreferencesStore((state) => state.setThemeMode)
  const [animating, setAnimating] = useState(false)
  const [pendingMode, setPendingMode] = useState<null | ThemeMode>(null)
  const transitionTimerRef = useRef<null | ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    applyThemeMode(mode)
    return () => {
      if (transitionTimerRef.current !== null) {
        clearTimeout(transitionTimerRef.current)
      }
    }
  }, [mode])

  function toggleMode() {
    if (animating) {
      return
    }

    const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light'
    setPendingMode(nextMode)
    setAnimating(true)

    transitionTimerRef.current = setTimeout(() => {
      setThemeMode(nextMode)
      setPendingMode(null)
      setAnimating(false)
      transitionTimerRef.current = null
    }, 700)
  }

  const nextMode = mode === 'light' ? 'dark' : 'light'
  const label = `Theme mode: ${mode}. Click to switch to ${nextMode} mode.`
  const currentIcon = mode === 'light' ? <CloudSun aria-hidden size={16} /> : <MoonStar aria-hidden size={16} />
  const incomingMode = pendingMode ?? mode
  const incomingIcon =
    incomingMode === 'light' ? <CloudSun aria-hidden size={16} /> : <MoonStar aria-hidden size={16} />

  return (
    <Button
      aria-label={label}
      className="border-chip-border bg-chip-bg text-ink rounded-full px-3 py-1.5 shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
      disabled={animating}
      onClick={toggleMode}
      title={label}
      type="button"
      variant="outline"
    >
      <span className="flex items-center gap-2">
        <span className="relative h-4 w-4 overflow-hidden" data-testid="theme-toggle-icon-stack">
          <span
            className="absolute inset-0"
            style={{
              transform: animating ? 'translateY(100%)' : 'translateY(0%)',
              transition: animating ? 'transform 700ms ease' : 'none',
            }}
          >
            {currentIcon}
          </span>
          <span
            className="absolute inset-0"
            style={{
              transform: animating ? 'translateY(0%)' : 'translateY(-100%)',
              transition: animating ? 'transform 700ms ease' : 'none',
            }}
          >
            {incomingIcon}
          </span>
        </span>
        <span>{mode === 'dark' ? 'Dark' : 'Light'}</span>
      </span>
    </Button>
  )
}
