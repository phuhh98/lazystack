import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Typography from '@/components/basic/Typography'

describe('Typography Component', () => {
  it('renders paragraph by default', () => {
    render(<Typography>Default text</Typography>)

    const paragraph = screen.getByText('Default text')
    expect(paragraph.tagName).toBe('P')
  })

  it('renders semantic heading tag selected via as prop', () => {
    render(<Typography as="h2">Section title</Typography>)

    const heading = screen.getByRole('heading', { level: 2, name: 'Section title' })
    expect(heading).toBeInTheDocument()
  })

  it('renders inline semantic emphasis tags', () => {
    const { container } = render(
      <p>
        <Typography as="strong">Important</Typography> and <Typography as="em">nuanced</Typography>
      </p>,
    )

    expect(container.querySelector('strong')).toHaveTextContent('Important')
    expect(container.querySelector('em')).toHaveTextContent('nuanced')
  })

  it('supports semantic label association attributes', () => {
    const { container } = render(
      <div>
        <Typography as="label" htmlFor="name-input">
          Name
        </Typography>
        <input id="name-input" type="text" />
      </div>,
    )

    const input = screen.getByLabelText('Name')
    expect(input).toHaveAttribute('id', 'name-input')
    expect(container.querySelector('label')).toHaveAttribute('for', 'name-input')
  })

  it('renders empty children without crashing', () => {
    const { container } = render(<Typography>{''}</Typography>)

    const paragraph = container.querySelector('p')
    expect(paragraph).toBeInTheDocument()
    expect(paragraph).toBeEmptyDOMElement()
  })

  it('passes through HTML attributes', () => {
    render(
      <Typography as="abbr" data-testid="abbr" title="Application Programming Interface">
        API
      </Typography>,
    )

    const abbr = screen.getByTestId('abbr')
    expect(abbr.tagName).toBe('ABBR')
    expect(abbr).toHaveAttribute('title', 'Application Programming Interface')
  })

  it('renders even when children are omitted', () => {
    const { container } = render(<Typography as="p" />)

    const paragraph = container.querySelector('p')
    expect(paragraph).toBeInTheDocument()
    expect(paragraph).toBeEmptyDOMElement()
  })

  it('uses fallback typography preset for unsupported string tags', () => {
    render(
      <Typography as={'blockquote' as never} data-testid="quote">
        Estimation context
      </Typography>,
    )

    const quote = screen.getByTestId('quote')
    expect(quote.tagName).toBe('BLOCKQUOTE')
    expect(quote).toHaveTextContent('Estimation context')
    expect(quote).toHaveClass('font-content', 'text-base', 'leading-7', 'text-ink')
  })

  it('merges custom className with defaults', () => {
    const { container } = render(
      <Typography as="small" className="tracking-wide">
        Fine print
      </Typography>,
    )

    const small = container.querySelector('small')
    expect(small).toHaveClass('tracking-wide')
  })
})
