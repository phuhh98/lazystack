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
  it('renders a primary navigation landmark', () => {
    mockMatchMedia()
    render(<Header />)
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument()
  })

  it('renders header with logo', () => {
    mockMatchMedia()
    render(<Header />)
    expect(screen.getByRole('link', { name: /lazystack/i })).toBeInTheDocument()
  })

  it('renders brand heading as level 2', () => {
    mockMatchMedia()
    render(<Header />)
    expect(screen.getByRole('heading', { level: 2, name: /lazystack/i })).toBeInTheDocument()
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

  it('keeps theme toggle after nav links in DOM order', () => {
    mockMatchMedia()
    render(<Header />)

    const planningPokerLink = screen.getByRole('link', { name: 'Planning Poker' })
    const themeButton = screen.getByRole('button', { name: /theme mode/i })

    expect(planningPokerLink.compareDocumentPosition(themeButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
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
