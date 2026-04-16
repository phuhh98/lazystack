import type { Meta, StoryObj } from '@storybook/react-vite'

import Footer from '../../components/Footer'

const meta: Meta<typeof Footer> = {
  component: Footer,
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'var(--bg-base)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '400px',
        }}
      >
        <div style={{ flex: 1 }} />
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Layout/Footer',
}

export default meta
type Story = StoryObj<typeof Footer>

/**
 * Default footer component showing the copyright year and GitHub link.
 * The footer displays the current year dynamically.
 */
export const Default: Story = {}
