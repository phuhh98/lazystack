import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ChatMessage } from '@/hooks/usePlanningPoker'

import Container from '@/components/basic/Content'
import ChatDrawer from '@/components/planning-poker/ChatDrawer'

const meta: Meta<typeof ChatDrawer> = {
  args: {
    chat: [],
    onSend: () => {},
    playerId: 'player-1',
  },
  component: ChatDrawer,
  decorators: [
    (Story) => (
      <Container className="flex h-screen items-center justify-center">
        <Story />
      </Container>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/ChatDrawer',
}

export default meta
type Story = StoryObj<typeof ChatDrawer>

const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    name: 'Alice',
    playerId: 'player-1',
    text: '👋 Hello!',
    ts: Date.now() - 30000,
  },
  {
    id: '2',
    name: 'Bob',
    playerId: 'player-2',
    text: '👍 Looks good',
    ts: Date.now() - 20000,
  },
  {
    id: '3',
    name: 'Alice',
    playerId: 'player-1',
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
    onSend: () => {},
    playerId: 'player-1',
  },
}

/**
 * Chat drawer with messages
 */
export const WithMessages: Story = {
  args: {
    chat: sampleMessages,
    onSend: () => {},
    playerId: 'player-1',
  },
}

/**
 * Empty chat drawer
 */
export const Empty: Story = {
  args: {
    chat: [],
    onSend: () => {},
    playerId: 'player-1',
  },
}

/**
 * Chat with many messages
 */
export const ManyMessages: Story = {
  args: {
    chat: Array.from({ length: 20 }, (_, i) => ({
      id: `msg-${i}`,
      name: i % 2 === 0 ? 'Alice' : 'Bob',
      playerId: i % 2 === 0 ? 'player-1' : 'player-2',
      text: `Message ${i + 1}`,
      ts: Date.now() - (20 - i) * 1000,
    })),
    onSend: () => {},
    playerId: 'player-1',
  },
}
