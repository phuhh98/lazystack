import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Container from '../../../components/basic/Container'

describe('Container Component', () => {
  it('renders container with children', () => {
    const { container } = render(<Container>Test Content</Container>)
    expect(container.textContent).toContain('Test Content')
  })

  it('applies default classes', () => {
    const { container } = render(<Container>Content</Container>)
    const div = container.querySelector('div')
    expect(div).toHaveClass('container', 'mx-auto', 'px-4')
  })

  it('merges custom className with defaults', () => {
    const { container } = render(<Container className="py-8">Content</Container>)
    const div = container.querySelector('div')
    expect(div).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
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
})
