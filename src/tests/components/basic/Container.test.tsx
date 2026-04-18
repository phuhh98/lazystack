import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Container from '@/components/basic/Container'

describe('Container Component', () => {
  it('renders content with children', () => {
    const { container } = render(<Container>Test Content</Container>)
    expect(container.textContent).toContain('Test Content')
  })

  it('applies centered flex defaults', () => {
    const { container } = render(<Container>Content</Container>)
    const div = container.querySelector('div')
    expect(div).toHaveClass('flex', 'items-center', 'justify-center', 'flex-row', 'flex-nowrap')
  })

  it('merges custom className with defaults', () => {
    const { container } = render(<Container className="py-8">Content</Container>)
    const div = container.querySelector('div')
    expect(div).toHaveClass('flex', 'items-center', 'justify-center', 'py-8')
  })

  it('accepts HTML attributes', () => {
    const { container } = render(
      <Container data-testid="container" id="test-container">
        Content
      </Container>,
    )
    const div = container.querySelector('#test-container')
    expect(div).toBeInTheDocument()
    expect(div).toHaveAttribute('data-testid', 'container')
  })

  it('renders multiple children', () => {
    const { container } = render(
      <Container>
        <h1>Title</h1>
        <p>Paragraph</p>
      </Container>,
    )
    expect(container.querySelector('h1')).toHaveTextContent('Title')
    expect(container.querySelector('p')).toHaveTextContent('Paragraph')
  })

  it('renders semantic element selected via as prop', () => {
    render(<Container as="main">Main Content</Container>)
    const landmark = screen.getByRole('main')
    expect(landmark).toHaveTextContent('Main Content')
    expect(landmark).toHaveClass('flex', 'items-center', 'justify-center')
  })

  it('supports flex direction and wrapping props', () => {
    const { container } = render(
      <Container direction="col" wrap="wrap">
        Content
      </Container>,
    )

    const div = container.querySelector('div')
    expect(div).toHaveClass('flex-col', 'flex-wrap')
  })

  it('supports grid layout with columns and placement props', () => {
    const { container } = render(
      <Container align="stretch" columns={3} justify="between" layout="grid">
        Content
      </Container>,
    )

    const div = container.querySelector('div')
    expect(div).toHaveClass('grid', 'grid-cols-3', 'items-stretch', 'justify-between')
    expect(div).not.toHaveClass('flex-row', 'flex-nowrap')
  })
})
