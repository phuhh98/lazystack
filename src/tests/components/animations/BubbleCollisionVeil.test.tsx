import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import BubbleCollisionVeil from '@/components/animations/BubbleCollisionVeil'

describe('BubbleCollisionVeil Component', () => {
  it('renders as a decorative, non-interactive overlay', () => {
    const { container } = render(<BubbleCollisionVeil paused />)

    const root = container.querySelector('[aria-hidden="true"]')
    expect(root).toBeInTheDocument()
    expect(root).toHaveClass('pointer-events-none', 'absolute', 'inset-0', 'overflow-hidden')
  })

  it('applies custom className on the overlay root', () => {
    const { container } = render(<BubbleCollisionVeil className="z-0" paused />)

    const root = container.querySelector('[aria-hidden="true"]')
    expect(root).toHaveClass('z-0')
  })

  it('keeps an internal host element for canvas mounting', () => {
    const { container } = render(<BubbleCollisionVeil paused />)

    const root = container.querySelector('[aria-hidden="true"]')
    const host = root?.querySelector('div')
    expect(host).toBeInTheDocument()
    expect(host).toHaveClass('h-full', 'w-full')
  })
})
