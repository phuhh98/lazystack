import type { Meta, StoryObj } from '@storybook/react-vite'

import VoteResults from '../../../components/planning-poker/VoteResults'

const meta: Meta<typeof VoteResults> = {
  args: {
    isConsensus: false,
    isModerator: false,
    onEndSession: () => {},
    onNextStory: () => {},
    onReestimate: () => {},
  },
  component: VoteResults,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/VoteResults',
}

export default meta
type Story = StoryObj<typeof meta>

const ts = Date.now()

const consensusPlayers = [
  {
    handRaised: false,
    id: 'p1',
    isOnline: true,
    lastSeen: ts,
    name: 'Alice',
    vote: '5',
    voted: true,
  },
  {
    handRaised: false,
    id: 'p2',
    isOnline: true,
    lastSeen: ts,
    name: 'Bob',
    vote: '5',
    voted: true,
  },
  {
    handRaised: false,
    id: 'p3',
    isOnline: true,
    lastSeen: ts,
    name: 'Carol',
    vote: '5',
    voted: true,
  },
]

const splitPlayers = [
  {
    handRaised: false,
    id: 'p1',
    isOnline: true,
    lastSeen: ts,
    name: 'Alice',
    vote: '3',
    voted: true,
  },
  {
    handRaised: false,
    id: 'p2',
    isOnline: true,
    lastSeen: ts,
    name: 'Bob',
    vote: '8',
    voted: true,
  },
  {
    handRaised: false,
    id: 'p3',
    isOnline: true,
    lastSeen: ts,
    name: 'Carol',
    vote: '5',
    voted: true,
  },
  {
    handRaised: false,
    id: 'p4',
    isOnline: false,
    lastSeen: ts - 60000,
    name: 'Dan',
    vote: '8',
    voted: true,
  },
]

export const Consensus: Story = {
  args: { isConsensus: true, players: consensusPlayers },
}

export const Split: Story = {
  args: { players: splitPlayers },
}

export const AsModerator: Story = {
  args: { isModerator: true, players: splitPlayers },
}

export const AsModeratorConsensusSaveFlow: Story = {
  args: { isConsensus: true, isModerator: true, players: consensusPlayers },
  parameters: {
    docs: {
      description: {
        story:
          'Estimate starts prefilled from consensus. Use the estimate popover to pick a value, then click Next Story.',
      },
    },
  },
}
