import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import Header from '../../components/Header'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    className,
  }: {
    children: ReactNode
    to: string
    className?: string
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

function mockMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

describe('Header Component', () => {
  it('renders header with logo', () => {
    mockMatchMedia()
    render(<Header />)
    expect(screen.getByRole('link', { name: /lazystack/i })).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    mockMatchMedia()
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Planning Poker' }),
    ).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    mockMatchMedia()
    render(<Header />)
    const themeButton = screen.getByRole('button', { name: /theme mode/i })
    expect(themeButton).toBeInTheDocument()
  })

  it('has sticky positioning', () => {
    mockMatchMedia()
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('sticky', 'top-0', 'z-50')
  })

  it('has proper styling classes', () => {
    mockMatchMedia()
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('border-b', 'backdrop-blur-lg')
  })
})
