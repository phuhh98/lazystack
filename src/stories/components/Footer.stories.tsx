import type { Meta, StoryObj } from '@storybook/react'
import Footer from '../../components/Footer'

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '400px',
          background: 'var(--bg-base)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1 }} />
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Footer>

/**
 * Default footer component showing the copyright year and GitHub link.
 * The footer displays the current year dynamically.
 */
export const Default: Story = {}
