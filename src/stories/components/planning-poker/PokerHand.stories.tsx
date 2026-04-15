import type { Meta, StoryObj } from '@storybook/react'
import PokerHand from '../../../components/planning-poker/PokerHand'

const meta: Meta<typeof PokerHand> = {
  title: 'PlanningPoker/PokerHand',
  component: PokerHand,
  parameters: { layout: 'centered' },
  args: { chat: [] },
}
export default meta
type Story = StoryObj<typeof PokerHand>

const samplePlayers = [
  {
    id: '1',
    name: 'Alice',
    vote: '5',
    voted: true,
    isOnline: true,
    lastSeen: Date.now(),
    handRaised: false,
  },
  {
    id: '2',
    name: 'Bob',
    vote: null,
    voted: false,
    isOnline: true,
    lastSeen: Date.now(),
    handRaised: true,
  },
  {
    id: '3',
    name: 'Carol',
    vote: '8',
    voted: true,
    isOnline: false,
    lastSeen: Date.now() - 60000,
    handRaised: false,
  },
]

export const Voting: Story = {
  args: {
    players: samplePlayers,
    phase: 'voting',
    currentPlayerId: '1',
    moderatorId: '1',
  },
}

export const Revealed: Story = {
  args: {
    players: samplePlayers,
    phase: 'revealed',
    currentPlayerId: '1',
    moderatorId: '2',
  },
}

export const Lobby: Story = {
  args: {
    players: samplePlayers,
    phase: 'lobby',
    currentPlayerId: '2',
    moderatorId: '1',
  },
}
