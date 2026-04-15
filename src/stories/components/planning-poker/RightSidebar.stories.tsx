import type { Meta, StoryObj } from '@storybook/react'
import RightSidebar from '../../../components/planning-poker/RightSidebar'
import type { ChatMessage, PlayerData } from '@/hooks/usePlanningPoker'

const meta: Meta<typeof RightSidebar> = {
  title: 'PlanningPoker/RightSidebar',
  component: RightSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    chat: [],
    playerId: 'player-1',
    onSend: () => {},
    players: [],
    isModerator: false,
    timerDuration: 0,
    onToggleHand: () => {},
    onLowerHand: () => {},
    onSetTimerDuration: () => {},
    codeWord: '',
  },
}

export default meta
type Story = StoryObj<typeof RightSidebar>

const samplePlayers: PlayerData[] = [
  {
    id: 'p1',
    name: 'Alice',
    vote: '5',
    voted: true,
    isOnline: true,
    lastSeen: Date.now(),
    handRaised: false,
  },
  {
    id: 'p2',
    name: 'Bob',
    vote: null,
    voted: false,
    isOnline: true,
    lastSeen: Date.now(),
    handRaised: true,
  },
  {
    id: 'p3',
    name: 'Carol',
    vote: '8',
    voted: true,
    isOnline: false,
    lastSeen: Date.now() - 60000,
    handRaised: false,
  },
]

const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    playerId: 'p1',
    playerName: 'Alice',
    text: '👋 Hello!',
    timestamp: Date.now() - 30000,
  },
  {
    id: '2',
    playerId: 'p2',
    playerName: 'Bob',
    text: '👍 Looks good',
    timestamp: Date.now() - 20000,
  },
]

/**
 * Right sidebar as participant (not moderator)
 */
export const AsParticipant: Story = {
  args: {
    chat: sampleMessages,
    players: samplePlayers,
    isModerator: false,
    timerDuration: 0,
    codeWord: 'poker-room-123',
  },
}

/**
 * Right sidebar as moderator
 */
export const AsModerator: Story = {
  args: {
    chat: sampleMessages,
    players: samplePlayers,
    isModerator: true,
    timerDuration: 30,
    codeWord: 'poker-room-123',
    onSetCodeWord: () => {},
  },
}

/**
 * Right sidebar with active hand raises
 */
export const WithHandRaises: Story = {
  args: {
    chat: sampleMessages,
    players: [
      {
        id: 'p1',
        name: 'Alice',
        vote: null,
        voted: false,
        isOnline: true,
        lastSeen: Date.now(),
        handRaised: true,
      },
      {
        id: 'p2',
        name: 'Bob',
        vote: null,
        voted: false,
        isOnline: true,
        lastSeen: Date.now(),
        handRaised: true,
      },
      {
        id: 'p3',
        name: 'Carol',
        vote: null,
        voted: false,
        isOnline: true,
        lastSeen: Date.now(),
        handRaised: false,
      },
    ],
    isModerator: true,
  },
}
