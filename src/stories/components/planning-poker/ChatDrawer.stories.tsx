import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'vitest'
import { within } from '@testing-library/dom'
import ChatDrawer from '../../../components/planning-poker/ChatDrawer'
import type { ChatMessage } from '@/hooks/usePlanningPoker'

const meta: Meta<typeof ChatDrawer> = {
  title: 'PlanningPoker/ChatDrawer',
  component: ChatDrawer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    chat: [],
    playerId: 'player-1',
    onSend: () => {},
  },
}

export default meta
type Story = StoryObj<typeof ChatDrawer>

const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    playerId: 'player-1',
    playerName: 'Alice',
    text: '👋 Hello!',
    timestamp: Date.now() - 30000,
  },
  {
    id: '2',
    playerId: 'player-2',
    playerName: 'Bob',
    text: '👍 Looks good',
    timestamp: Date.now() - 20000,
  },
  {
    id: '3',
    playerId: 'player-1',
    playerName: 'Alice',
    text: "Great, let's move on",
    timestamp: Date.now() - 10000,
  },
]

/**
 * Chat drawer in closed state
 */
export const Closed: Story = {
  args: { chat: sampleMessages },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button')
    expect(button).toBeInTheDocument()
  },
}

/**
 * Chat drawer with messages
 */
export const WithMessages: Story = {
  args: { chat: sampleMessages },
}

/**
 * Empty chat drawer
 */
export const Empty: Story = {
  args: { chat: [] },
}

/**
 * Chat with many messages
 */
export const ManyMessages: Story = {
  args: {
    chat: Array.from({ length: 20 }, (_, i) => ({
      id: `msg-${i}`,
      playerId: i % 2 === 0 ? 'player-1' : 'player-2',
      playerName: i % 2 === 0 ? 'Alice' : 'Bob',
      text: `Message ${i + 1}`,
      timestamp: Date.now() - (20 - i) * 1000,
    })),
  },
}
