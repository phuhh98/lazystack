import type { Meta, StoryObj } from '@storybook/react'
import VoteResults from '../../../components/planning-poker/VoteResults'

const meta: Meta<typeof VoteResults> = {
  title: 'PlanningPoker/VoteResults',
  component: VoteResults,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    isModerator: false,
    isConsensus: false,
    onNextStory: () => {},
    onEndSession: () => {},
  },
}

export default meta
type Story = StoryObj<typeof meta>

const ts = Date.now()

const consensusPlayers = [
  {
    id: 'p1',
    name: 'Alice',
    voted: true,
    vote: '5',
    isOnline: true,
    lastSeen: ts,
    handRaised: false,
  },
  {
    id: 'p2',
    name: 'Bob',
    voted: true,
    vote: '5',
    isOnline: true,
    lastSeen: ts,
    handRaised: false,
  },
  {
    id: 'p3',
    name: 'Carol',
    voted: true,
    vote: '5',
    isOnline: true,
    lastSeen: ts,
    handRaised: false,
  },
]

const splitPlayers = [
  {
    id: 'p1',
    name: 'Alice',
    voted: true,
    vote: '3',
    isOnline: true,
    lastSeen: ts,
    handRaised: false,
  },
  {
    id: 'p2',
    name: 'Bob',
    voted: true,
    vote: '8',
    isOnline: true,
    lastSeen: ts,
    handRaised: false,
  },
  {
    id: 'p3',
    name: 'Carol',
    voted: true,
    vote: '5',
    isOnline: true,
    lastSeen: ts,
    handRaised: false,
  },
  {
    id: 'p4',
    name: 'Dan',
    voted: true,
    vote: '8',
    isOnline: false,
    lastSeen: ts - 60000,
    handRaised: false,
  },
]

export const Consensus: Story = {
  args: { players: consensusPlayers, isConsensus: true },
}

export const Split: Story = {
  args: { players: splitPlayers },
}

export const AsModerator: Story = {
  args: { players: splitPlayers, isModerator: true },
}
