import type { Meta, StoryObj } from '@storybook/react'
import Container from '@/components/basic/Container'
import ChatDrawer from '@/components/planning-poker/ChatDrawer'
import type { ChatMessage } from '@/hooks/usePlanningPoker'

const meta: Meta<typeof ChatDrawer> = {
  title: 'PlanningPoker/ChatDrawer',
  component: ChatDrawer,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Container className="h-screen flex items-center justify-center">
        <Story />
      </Container>
    ),
  ],
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
    name: 'Alice',
    text: '👋 Hello!',
    ts: Date.now() - 30000,
  },
  {
    id: '2',
    playerId: 'player-2',
    name: 'Bob',
    text: '👍 Looks good',
    ts: Date.now() - 20000,
  },
  {
    id: '3',
    playerId: 'player-1',
    name: 'Alice',
    text: "Great, let's move on",
    ts: Date.now() - 10000,
  },
]

/**
 * Chat drawer in closed state
 */
export const Closed: Story = {
  args: {
    chat: sampleMessages,
    playerId: 'player-1',
    onSend: () => {},
  },
}

/**
 * Chat drawer with messages
 */
export const WithMessages: Story = {
  args: {
    chat: sampleMessages,
    playerId: 'player-1',
    onSend: () => {},
  },
}

/**
 * Empty chat drawer
 */
export const Empty: Story = {
  args: {
    chat: [],
    playerId: 'player-1',
    onSend: () => {},
  },
}

/**
 * Chat with many messages
 */
export const ManyMessages: Story = {
  args: {
    chat: Array.from({ length: 20 }, (_, i) => ({
      id: `msg-${i}`,
      playerId: i % 2 === 0 ? 'player-1' : 'player-2',
      name: i % 2 === 0 ? 'Alice' : 'Bob',
      text: `Message ${i + 1}`,
      ts: Date.now() - (20 - i) * 1000,
    })),
    playerId: 'player-1',
    onSend: () => {},
  },
}
