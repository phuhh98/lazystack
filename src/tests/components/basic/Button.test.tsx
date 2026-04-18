import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import Button from '@/components/basic/Button'

describe('Button Component', () => {
  it('renders button label', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('uses button type by default', () => {
    render(<Button>Default Type</Button>)
    expect(screen.getByRole('button', { name: 'Default Type' })).toHaveAttribute('type', 'button')
  })

  it('supports outline variant styles', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button', { name: 'Outline' })
    expect(button).toHaveClass('border', 'border-border', 'bg-bg-surface', 'text-ink-muted')
  })

  it('supports full width mode', () => {
    render(<Button fullWidth>Wide</Button>)
    expect(screen.getByRole('button', { name: 'Wide' })).toHaveClass('w-full')
  })

  it('calls onClick when activated', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Press</Button>)
    await user.click(screen.getByRole('button', { name: 'Press' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('forwards ref to underlying button element', () => {
    const ref = createRef<HTMLButtonElement>()

    render(<Button ref={ref}>Ref Target</Button>)

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Ref Target' }))
  })
})
