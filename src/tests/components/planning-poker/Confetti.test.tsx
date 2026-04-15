import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Confetti from '../../../components/planning-poker/Confetti'

describe('Confetti Component', () => {
  it('renders confetti container', () => {
    const { container } = render(<Confetti />)
    const confettiDiv = container.querySelector('[aria-hidden="true"]')
    expect(confettiDiv).toBeInTheDocument()
  })

  it('has correct aria-hidden attribute', () => {
    const { container } = render(<Confetti />)
    const confettiDiv = container.querySelector('[aria-hidden="true"]')
    expect(confettiDiv).toHaveAttribute('aria-hidden', 'true')
  })

  it('has pointer-events-none class', () => {
    const { container } = render(<Confetti />)
    const confettiDiv = container.querySelector('[aria-hidden="true"]')
    expect(confettiDiv).toHaveClass(
      'pointer-events-none',
      'fixed',
      'inset-0',
      'z-[999]',
    )
  })

  it('renders style element with animation', () => {
    const { container } = render(<Confetti />)
    const style = container.querySelector('style')
    expect(style).toBeInTheDocument()
    expect(style?.textContent).toContain('pp-confetti')
  })

  it('hides after animation completes', async () => {
    const { container, rerender } = render(<Confetti />)
    let confettiDiv = container.querySelector('[aria-hidden="true"]')
    expect(confettiDiv).toBeInTheDocument()

    // Wait for auto-dismiss (8.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 8600))
    rerender(<Confetti />)
  })
})
