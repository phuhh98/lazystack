import type { Meta, StoryObj } from '@storybook/react-vite'

import PokerHand from '../../../components/planning-poker/PokerHand'

const meta: Meta<typeof PokerHand> = {
  args: { chat: [] },
  component: PokerHand,
  parameters: { layout: 'centered' },
  title: 'PlanningPoker/PokerHand',
}
export default meta
type Story = StoryObj<typeof PokerHand>

const samplePlayers = [
  {
    handRaised: false,
    id: '1',
    isOnline: true,
    lastSeen: Date.now(),
    name: 'Alice',
    vote: '5',
    voted: true,
  },
  {
    handRaised: true,
    id: '2',
    isOnline: true,
    lastSeen: Date.now(),
    name: 'Bob',
    vote: null,
    voted: false,
  },
  {
    handRaised: false,
    id: '3',
    isOnline: false,
    lastSeen: Date.now() - 60000,
    name: 'Carol',
    vote: '8',
    voted: true,
  },
]

export const Voting: Story = {
  args: {
    currentPlayerId: '1',
    moderatorId: '1',
    phase: 'voting',
    players: samplePlayers,
  },
}

export const Revealed: Story = {
  args: {
    currentPlayerId: '1',
    moderatorId: '2',
    phase: 'revealed',
    players: samplePlayers,
  },
}

export const Lobby: Story = {
  args: {
    currentPlayerId: '2',
    moderatorId: '1',
    phase: 'lobby',
    players: samplePlayers,
  },
}
