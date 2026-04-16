import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import GithubIcon from '../../../components/brandIcons/GithubIcon'

describe('GithubIcon Component', () => {
  it('renders GitHub icon', () => {
    render(<GithubIcon />)
    const icon = screen.getByLabelText('GitHub Icon')
    expect(icon).toBeInTheDocument()
  })

  it('has correct viewBox', () => {
    render(<GithubIcon />)
    const icon = screen.getByLabelText('GitHub Icon')
    expect(icon).toHaveAttribute('viewBox', '0 0 16 16')
  })

  it('renders with default size', () => {
    render(<GithubIcon size={24} />)
    const icon = screen.getByLabelText('GitHub Icon')
    expect(icon).toHaveAttribute('width', '24')
    expect(icon).toHaveAttribute('height', '24')
  })

  it('accepts custom size prop', () => {
    render(<GithubIcon size={32} />)
    const icon = screen.getByLabelText('GitHub Icon')
    expect(icon).toHaveAttribute('width', '32')
    expect(icon).toHaveAttribute('height', '32')
  })

  it('renders path element', () => {
    const { container } = render(<GithubIcon />)
    const path = container.querySelector('path')
    expect(path).toBeInTheDocument()
  })
})
