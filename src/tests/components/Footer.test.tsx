import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Footer from '../../components/Footer'

describe('Footer Component', () => {
  it('renders footer landmark', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders copyright notice with current year', () => {
    const currentYear = new Date().getFullYear()
    render(<Footer />)
    expect(screen.getByText(new RegExp(`© ${currentYear} LazyStack`))).toBeInTheDocument()
  })

  it('renders GitHub link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /phuhh98/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/phuhh98')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders GitHub icon', () => {
    render(<Footer />)
    const icon = screen.getByLabelText('GitHub Icon')
    expect(icon).toBeInTheDocument()
  })

  it('has footer element with proper styling', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('border-t', 'px-4', 'pt-8', 'pb-6')
  })

  it('displays all rights reserved text', () => {
    render(<Footer />)
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })
})
