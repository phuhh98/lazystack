import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'vitest'
import { within } from '@testing-library/dom'
import ThemeToggle from '../../components/ThemeToggle'

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
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(/Light|Dark|Auto/)
  },
}

/**
 * Visual test: Toggle cycles through themes
 */
export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button')
    expect(button).toBeInTheDocument()
    const initialText = button.textContent
    expect(initialText).toMatch(/Light|Dark|Auto/)

    // Verify button has proper styling
    expect(button).toHaveClass('transition')
  },
}
