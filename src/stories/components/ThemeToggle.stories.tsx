import type { Meta, StoryObj } from '@storybook/react'
import ThemeToggle from '@/components/ThemeToggle'

const meta: Meta<typeof ThemeToggle> = {
  title: 'Layout/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ThemeToggle>

/**
 * Theme toggle button allowing users to switch between light, dark, and auto modes.
 */
export const Default: Story = {}

/**
 * Visual test: Toggle cycles through themes
 */
export const Interactive: Story = {}
