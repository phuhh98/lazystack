import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../../components/Footer'

describe('Footer Component', () => {
  it('renders copyright notice with current year', () => {
    const currentYear = new Date().getFullYear()
    render(<Footer />)
    expect(
      screen.getByText(new RegExp(`© ${currentYear} LazyStack`)),
    ).toBeInTheDocument()
  })

  it('renders GitHub link', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /phuhh98/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/phuhh98')
  })

  it('renders GitHub icon', () => {
    render(<Footer />)
    const icon = screen.getByLabelText('GitHub Icon')
    expect(icon).toBeInTheDocument()
  })

  it('has footer element with proper styling', () => {
    const { container } = render(<Footer />)
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('mt-20', 'border-t')
  })

  it('displays all rights reserved text', () => {
    render(<Footer />)
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })
})
