import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import ThemeToggle from '@/components/ThemeToggle'
import { UI_PREFERENCES_STORAGE_KEY } from '@/lib/utils/theme'

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
    delete document.documentElement.dataset.theme

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

  it('renders theme toggle button', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /theme mode/i })
    expect(button).toBeInTheDocument()
  })

  it('displays initial theme mode', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button.textContent).toMatch(/Light|Dark/)
  })

  it('has proper button styling', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('rounded-full', 'border', 'bg-chip-bg', 'border-chip-border')
  })

  it('updates persisted UI preferences when theme is toggled', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    const button = screen.getByRole('button')

    await user.click(button)
    await waitFor(
      () => {
        const raw = localStorage.getItem(UI_PREFERENCES_STORAGE_KEY)
        expect(raw).not.toBeNull()
        const parsed = JSON.parse(raw ?? '{}') as { state?: { themeMode?: string } }
        expect(parsed.state?.themeMode).toBe('dark')
      },
      { timeout: 2000 },
    )
  })

  it('is temporarily disabled while icon transition is running', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    const button = screen.getByRole('button')

    await user.click(button)
    expect(button).toBeDisabled()

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })

  it('cycles between light and dark modes', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    const button = screen.getByRole('button')

    const modes = ['Dark', 'Light', 'Dark']
    for (const mode of modes) {
      await user.click(button)
      await waitFor(
        () => {
          expect(button.textContent).toContain(mode)
        },
        { timeout: 2000 },
      )
    }
  })
})
