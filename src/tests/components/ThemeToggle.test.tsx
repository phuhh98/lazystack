import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../../components/ThemeToggle'

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders theme toggle button', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /theme mode/i })
    expect(button).toBeInTheDocument()
  })

  it('displays initial theme mode', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button.textContent).toMatch(/Light|Dark|Auto/)
  })

  it('has proper button styling', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('rounded-full', 'border', 'transition')
  })

  it('updates localStorage when theme is toggled', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    const button = screen.getByRole('button')

    await user.click(button)
    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBeTruthy()
    })
  })

  it('cycles through all theme modes', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)
    const button = screen.getByRole('button')

    const modes = ['Light', 'Dark', 'Auto', 'Light']
    for (const mode of modes) {
      await user.click(button)
      await waitFor(() => {
        expect(button.textContent).toContain(mode)
      })
    }
  })
})
