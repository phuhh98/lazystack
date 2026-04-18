import type { Meta, StoryObj } from '@storybook/react-vite'

import Content from '@/components/basic/Content'

const meta: Meta<typeof Content> = {
  component: Content,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Basic/Content',
}

export default meta
type Story = StoryObj<typeof Content>

/**
 * Centered container with max-width and responsive padding.
 */
export const Default: Story = {
  render: (args) => (
    <Content {...args}>
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
    </Content>
  ),
}

/**
 * Container with nested children
 */
export const WithNestedContent: Story = {
  render: (args) => (
    <Content {...args}>
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
    </Content>
  ),
}

/**
 * Container with custom className
 */
export const WithCustomClass: Story = {
  render: (args) => (
    <Content {...args} className="py-8">
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: '0.5rem',
          padding: '2rem',
        }}
      >
        Container with custom class
      </div>
    </Content>
  ),
}

/**
 * Semantic element override for landmark/sectioning structure.
 */
export const AsMain: Story = {
  args: {
    as: 'main',
  },
  render: (args) => (
    <Content {...args}>
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: '0.5rem',
          padding: '2rem',
        }}
      >
        Content rendered as main
      </div>
    </Content>
  ),
}
