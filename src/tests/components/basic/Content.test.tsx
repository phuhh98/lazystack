import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Content from '@/components/basic/Content'

describe('Content Component', () => {
  it('renders content with children', () => {
    const { container } = render(<Content>Test Content</Content>)
    expect(container.textContent).toContain('Test Content')
  })

  it('applies default classes', () => {
    const { container } = render(<Content>Content</Content>)
    const div = container.querySelector('div')
    expect(div).toHaveClass('container', 'mx-auto', 'px-4')
  })

  it('merges custom className with defaults', () => {
    const { container } = render(<Content className="py-8">Content</Content>)
    const div = container.querySelector('div')
    expect(div).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')
  })

  it('accepts HTML attributes', () => {
    const { container } = render(
      <Content data-testid="container" id="test-container">
        Content
      </Content>,
    )
    const div = container.querySelector('#test-container')
    expect(div).toBeInTheDocument()
    expect(div).toHaveAttribute('data-testid', 'container')
  })

  it('renders multiple children', () => {
    const { container } = render(
      <Content>
        <h1>Title</h1>
        <p>Paragraph</p>
      </Content>,
    )
    expect(container.querySelector('h1')).toHaveTextContent('Title')
    expect(container.querySelector('p')).toHaveTextContent('Paragraph')
  })

  it('renders semantic element selected via as prop', () => {
    render(<Content as="main">Main Content</Content>)
    const landmark = screen.getByRole('main')
    expect(landmark).toHaveTextContent('Main Content')
    expect(landmark).toHaveClass('container', 'mx-auto', 'px-4')
  })
})
