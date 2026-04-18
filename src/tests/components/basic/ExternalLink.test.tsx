import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import ExternalLink from '@/components/basic/ExternalLink'

describe('ExternalLink Component', () => {
  it('renders anchor content', () => {
    render(<ExternalLink href="https://example.com">Docs</ExternalLink>)
    expect(screen.getByRole('link', { name: 'Docs' })).toBeInTheDocument()
  })

  it('applies safe defaults for target and rel', () => {
    render(<ExternalLink href="https://example.com">Safe Link</ExternalLink>)
    const link = screen.getByRole('link', { name: 'Safe Link' })

    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('respects explicit rel and target overrides', () => {
    render(
      <ExternalLink href="https://example.com" rel="noreferrer" target="_self">
        Custom Link
      </ExternalLink>,
    )
    const link = screen.getByRole('link', { name: 'Custom Link' })

    expect(link).toHaveAttribute('target', '_self')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })

  it('uses icon styling mode when withIcon is enabled', () => {
    render(
      <ExternalLink href="https://example.com" withIcon>
        Icon Link
      </ExternalLink>,
    )

    expect(screen.getByRole('link', { name: 'Icon Link' })).toHaveClass('rounded-xl', 'p-2')
  })

  it('forwards ref to underlying anchor element', () => {
    const ref = createRef<HTMLAnchorElement>()

    render(
      <ExternalLink href="https://example.com" ref={ref}>
        Ref Link
      </ExternalLink>,
    )

    expect(ref.current).toBe(screen.getByRole('link', { name: 'Ref Link' }))
  })
})
