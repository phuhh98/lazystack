import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, render } from '@testing-library/react'
import Confetti from '../../../components/planning-poker/Confetti'

afterEach(() => {
  vi.useRealTimers()
})

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

  it('hides after animation completes', () => {
    let scheduled: TimerHandler | undefined
    const setTimeoutSpy = vi
      .spyOn(globalThis, 'setTimeout')
      .mockImplementation((fn) => {
        scheduled = fn
        return 1 as unknown as ReturnType<typeof setTimeout>
      })

    const { container } = render(<Confetti />)
    let confettiDiv = container.querySelector('[aria-hidden="true"]')
    expect(confettiDiv).toBeInTheDocument()

    act(() => {
      if (typeof scheduled === 'function') {
        scheduled()
      }
    })

    confettiDiv = container.querySelector('[aria-hidden="true"]')
    expect(confettiDiv).not.toBeInTheDocument()

    setTimeoutSpy.mockRestore()
  })
})
