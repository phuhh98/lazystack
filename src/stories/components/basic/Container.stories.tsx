import type { Meta, StoryObj } from '@storybook/react-vite'

import Container from '../../../components/basic/Container'

const meta: Meta<typeof Container> = {
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Basic/Container',
}

export default meta
type Story = StoryObj<typeof Container>

/**
 * Centered container with max-width and responsive padding.
 */
export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        Container Content
      </div>
    </Container>
  ),
}

/**
 * Container with nested children
 */
export const WithNestedContent: Story = {
  render: (args) => (
    <Container {...args}>
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: '0.5rem',
          padding: '2rem',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Heading</h2>
        <p>This is content inside a container. It will be centered and have responsive padding.</p>
      </div>
    </Container>
  ),
}

/**
 * Container with custom className
 */
export const WithCustomClass: Story = {
  render: (args) => (
    <Container {...args} className="py-8">
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: '0.5rem',
          padding: '2rem',
        }}
      >
        Container with custom class
      </div>
    </Container>
  ),
}
