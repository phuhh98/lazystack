import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import IslandShell, { ISLAND_SHELL_CLASSNAME } from '@/components/basic/IslandShell'

describe('IslandShell Component', () => {
  it('renders content with children', () => {
    const { container } = render(<IslandShell>Shell Content</IslandShell>)
    expect(container.textContent).toContain('Shell Content')
  })

  it('renders semantic element selected via as prop', () => {
    render(<IslandShell as="main">Main Shell</IslandShell>)

    const landmark = screen.getByRole('main')
    expect(landmark).toHaveTextContent('Main Shell')
  })

  it('applies island shell base classes', () => {
    const { container } = render(<IslandShell>Shell</IslandShell>)

    const div = container.querySelector('div')
    expect(div).toHaveClass('rounded-4xl', 'border', 'border-(--border)')
    expect(div).toHaveClass('duration-180', 'ease-in-out')
  })

  it('merges custom className with base classes', () => {
    const { container } = render(<IslandShell className="p-6">Shell</IslandShell>)

    const div = container.querySelector('div')
    expect(div).toHaveClass('rounded-4xl', 'p-6')
  })

  it('passes through HTML attributes', () => {
    const { container } = render(
      <IslandShell data-testid="island-shell" id="shell-id">
        Shell
      </IslandShell>,
    )

    const shell = container.querySelector('#shell-id')
    expect(shell).toBeInTheDocument()
    expect(shell).toHaveAttribute('data-testid', 'island-shell')
  })

  it('does not apply Container layout defaults', () => {
    const { container } = render(<IslandShell>Shell</IslandShell>)

    const div = container.querySelector('div')
    expect(div).not.toHaveClass('flex', 'grid', 'items-center', 'justify-center', 'flex-row')
  })

  it('exports reusable shell classname constant', () => {
    expect(ISLAND_SHELL_CLASSNAME).toContain('rounded-4xl')
    expect(ISLAND_SHELL_CLASSNAME).toContain('border-(--border)')
  })
})
