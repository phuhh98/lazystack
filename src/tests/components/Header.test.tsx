import type { ReactNode } from 'react'

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Header from '../../components/Header'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, className, to }: { children: ReactNode; className?: string; to: string }) => (
    <a className={className} href={to}>
      {children}
    </a>
  ),
}))

function mockMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
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
    expect(screen.getByRole('link', { name: 'Planning Poker' })).toBeInTheDocument()
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
