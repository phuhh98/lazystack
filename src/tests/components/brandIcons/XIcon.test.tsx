import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import XIcon from '../../../components/brandIcons/XIcon'

describe('XIcon Component', () => {
  it('renders X icon', () => {
    render(<XIcon />)
    const icon = screen.getByLabelText('X Icon')
    expect(icon).toBeInTheDocument()
  })

  it('has correct viewBox', () => {
    render(<XIcon />)
    const icon = screen.getByLabelText('X Icon')
    expect(icon).toHaveAttribute('viewBox', '0 0 16 16')
  })

  it('renders with default size', () => {
    render(<XIcon size={24} />)
    const icon = screen.getByLabelText('X Icon')
    expect(icon).toHaveAttribute('width', '24')
    expect(icon).toHaveAttribute('height', '24')
  })

  it('accepts custom size prop', () => {
    render(<XIcon size={32} />)
    const icon = screen.getByLabelText('X Icon')
    expect(icon).toHaveAttribute('width', '32')
    expect(icon).toHaveAttribute('height', '32')
  })

  it('renders path element', () => {
    const { container } = render(<XIcon />)
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
  })
})
