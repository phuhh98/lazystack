import type { Meta, StoryObj } from '@storybook/react-vite'

import ThemeToggle from '@/components/ThemeToggle'

const meta: Meta<typeof ThemeToggle> = {
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Layout/ThemeToggle',
}

export default meta
type Story = StoryObj<typeof ThemeToggle>

/**
 * Theme toggle button allowing users to switch between light and dark modes.
 */
export const Default: Story = {}

/**
 * Visual test: Toggle cycles through themes
 */
export const Interactive: Story = {}
