import type { Meta, StoryObj } from '@storybook/react-vite'

import PlayerList from '../../../components/planning-poker/PlayerList'

const meta: Meta<typeof PlayerList> = {
  args: {
    currentPlayerId: 'p1',
  },
  component: PlayerList,
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--bg-base)' },
        { name: 'dark', value: '#0a1418' },
      ],
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/PlayerList',
}

export default meta
type Story = StoryObj<typeof meta>

const playersVoting = [
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
    handRaised: false,
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
    vote: '8',
    voted: true,
  },
  {
    handRaised: false,
    id: 'p4',
    isOnline: false,
    lastSeen: Date.now() - 60000,
    name: 'Dan',
    vote: null,
    voted: false,
  },
]

const playersRevealed = [
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
    handRaised: false,
    id: 'p2',
    isOnline: true,
    lastSeen: Date.now(),
    name: 'Bob',
    vote: '8',
    voted: true,
  },
  {
    handRaised: false,
    id: 'p3',
    isOnline: true,
    lastSeen: Date.now(),
    name: 'Carol',
    vote: '5',
    voted: true,
  },
  {
    handRaised: false,
    id: 'p4',
    isOnline: false,
    lastSeen: Date.now() - 60000,
    name: 'Dan',
    vote: '?',
    voted: true,
  },
]

export const Voting: Story = {
  args: { phase: 'voting', players: playersVoting },
  parameters: {
    docs: {
      description: {
        story: 'Voting phase: shows checkmark for voted players, ellipsis for waiting.',
      },
    },
  },
}

export const Revealed: Story = {
  args: { phase: 'revealed', players: playersRevealed },
  parameters: {
    docs: {
      description: {
        story: 'Revealed phase: all vote values are shown.',
      },
    },
  },
}

export const WithCurrentPlayer: Story = {
  args: {
    currentPlayerId: 'p2',
    phase: 'voting',
    players: playersVoting,
  },
  parameters: {
    docs: {
      description: {
        story: 'The current player row is highlighted with a sand background.',
      },
    },
  },
}

export const OfflinePlayers: Story = {
  args: {
    phase: 'voting',
    players: [
      {
        handRaised: false,
        id: 'p1',
        isOnline: true,
        lastSeen: Date.now(),
        name: 'Alice',
        vote: '3',
        voted: true,
      },
      {
        handRaised: false,
        id: 'p2',
        isOnline: false,
        lastSeen: Date.now() - 60000,
        name: 'Bob',
        vote: null,
        voted: false,
      },
      {
        handRaised: false,
        id: 'p3',
        isOnline: false,
        lastSeen: Date.now() - 120000,
        name: 'Carol',
        vote: null,
        voted: false,
      },
    ],
  },
}

export const Empty: Story = {
  args: { phase: 'lobby', players: [] },
}
