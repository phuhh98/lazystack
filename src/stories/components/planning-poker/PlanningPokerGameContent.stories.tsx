import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ChatMessage, GameState, PlayerData, StoryItem } from '@/hooks/usePlanningPoker'

import PlanningPokerGameContent from '../../../components/planning-poker/PlanningPokerGameContent'

const baseGameState: GameState = {
  codeWord: 'ship-it',
  moderatorId: 'p1',
  phase: 'voting',
  story: 'Implement websocket reconnect handling',
  storyIndex: 0,
  timerDuration: 60,
  timerStartedAt: Date.now(),
}

const players: PlayerData[] = [
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
]

const chat: ChatMessage[] = [
  {
    id: 'c1',
    name: 'Alice',
    playerId: 'p1',
    text: 'Need to estimate retries as well',
    ts: Date.now(),
  },
]

const storyList: StoryItem[] = [
  { id: 's1', title: 'Implement websocket reconnect handling' },
  { estimatedVote: '3', id: 's2', title: 'Add retry jitter docs' },
]

const noop = () => {}

const meta: Meta<typeof PlanningPokerGameContent> = {
  args: {
    canClaimModerator: false,
    castVote: noop,
    chat,
    claimModerator: noop,
    clearStorySelection: noop,
    endSession: noop,
    gameState: baseGameState,
    isConsensus: false,
    isModerator: true,
    myVote: '5',
    nextStory: noop,
    onlineCount: 2,
    playerId: 'p1',
    players,
    revealVotes: noop,
    startTimer: noop,
    startVoting: noop,
    stopTimer: noop,
    storyList,
    timerRemaining: 42,
  },
  component: PlanningPokerGameContent,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/PlanningPokerGameContent',
}

export default meta

type Story = StoryObj<typeof PlanningPokerGameContent>

export const ModeratorVotingDefaultDeck: Story = {}

export const ModeratorVotingCustomDeck: Story = {
  args: {
    cards: ['XS', 'S', 'M', 'L', 'XL'],
  },
}

export const ParticipantVoting: Story = {
  args: {
    gameState: {
      ...baseGameState,
      moderatorId: 'p1',
    },
    isModerator: false,
    myVote: null,
    playerId: 'p2',
  },
}
