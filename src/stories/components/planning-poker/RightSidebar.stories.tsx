import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ChatMessage, PlayerData } from '@/hooks/usePlanningPoker'

import RightSidebar from '../../../components/planning-poker/RightSidebar'

const meta: Meta<typeof RightSidebar> = {
  args: {
    chat: [],
    codeWord: '',
    isModerator: false,
    onLowerHand: () => {},
    onSend: () => {},
    onSetTimerDuration: () => {},
    onToggleHand: () => {},
    playerId: 'player-1',
    players: [],
    timerDuration: 0,
  },
  component: RightSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/RightSidebar',
}

export default meta
type Story = StoryObj<typeof RightSidebar>

const samplePlayers: PlayerData[] = [
  {
    handRaised: false,
    id: 'p1',
    isOnline: true,
    lastSeen: Date.now(),
    name: 'Alice',
    vote: '5',
    voted: true,
  },
  {
    handRaised: true,
    id: 'p2',
    isOnline: true,
    lastSeen: Date.now(),
    name: 'Bob',
    vote: null,
    voted: false,
  },
  {
    handRaised: false,
    id: 'p3',
    isOnline: false,
    lastSeen: Date.now() - 60000,
    name: 'Carol',
    vote: '8',
    voted: true,
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
    codeWord: 'poker-room-123',
    isModerator: false,
    players: samplePlayers,
    timerDuration: 0,
  },
}

/**
 * Right sidebar as moderator
 */
export const AsModerator: Story = {
  args: {
    chat: sampleMessages,
    codeWord: 'poker-room-123',
    isModerator: true,
    onSetCodeWord: () => {},
    players: samplePlayers,
    timerDuration: 30,
  },
}

/**
 * Right sidebar with active hand raises
 */
export const WithHandRaises: Story = {
  args: {
    chat: sampleMessages,
    isModerator: true,
    players: [
      {
        handRaised: true,
        id: 'p1',
        isOnline: true,
        lastSeen: Date.now(),
        name: 'Alice',
        vote: null,
        voted: false,
      },
      {
        handRaised: true,
        id: 'p2',
        isOnline: true,
        lastSeen: Date.now(),
        name: 'Bob',
        vote: null,
        voted: false,
      },
      {
        handRaised: false,
        id: 'p3',
        isOnline: true,
        lastSeen: Date.now(),
        name: 'Carol',
        vote: null,
        voted: false,
      },
    ],
  },
}
