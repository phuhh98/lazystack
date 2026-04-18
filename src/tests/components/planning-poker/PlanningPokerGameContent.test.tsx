import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { GameState, PlayerData, StoryItem } from '@/hooks/usePlanningPoker'

import { DEFAULT_PLANNING_POKER_CARDS } from '@/lib/constants/planningPoker'

import PlanningPokerGameContent from '../../../components/planning-poker/PlanningPokerGameContent'

vi.mock('@/components/planning-poker/CardDeck', () => ({
  default: ({ cards, selectedCard }: { cards: string[]; selectedCard: null | string }) => (
    <div data-cards={cards.join(',')} data-selected={selectedCard ?? ''} data-testid="card-deck" />
  ),
}))

vi.mock('@/components/planning-poker/PokerHand', () => ({
  default: () => <div data-testid="poker-hand" />,
}))

vi.mock('@/components/planning-poker/VoteResults', () => ({
  default: () => <div data-testid="vote-results" />,
}))

vi.mock('@/components/planning-poker/CountdownClock', () => ({
  default: () => <div data-testid="countdown-clock" />,
}))

const gameState: GameState = {
  codeWord: 'sync',
  moderatorId: 'p1',
  phase: 'voting',
  story: 'Refactor planning poker view',
  storyIndex: 0,
  timerDuration: 90,
  timerStartedAt: Date.now(),
}

const players: PlayerData[] = [
  {
    handRaised: false,
    id: 'p1',
    isOnline: true,
    lastSeen: Date.now(),
    name: 'Alice',
    vote: '3',
    voted: true,
  },
]

const storyList: StoryItem[] = [{ id: 's1', title: 'Refactor planning poker view' }]

const baseProps = {
  canClaimModerator: false,
  castVote: vi.fn(),
  chat: [],
  claimModerator: vi.fn(),
  clearStorySelection: vi.fn(),
  endSession: vi.fn(),
  gameState,
  isConsensus: false,
  isModerator: true,
  myVote: null as null | string,
  nextStory: vi.fn(),
  onlineCount: 1,
  playerId: 'p1',
  players,
  revealVotes: vi.fn(),
  startTimer: vi.fn(),
  startVoting: vi.fn(),
  stopTimer: vi.fn(),
  storyList,
  timerRemaining: 30,
}

describe('PlanningPokerGameContent', () => {
  it('uses default planning poker cards when cards prop is omitted', () => {
    render(<PlanningPokerGameContent {...baseProps} />)

    expect(screen.getByTestId('card-deck')).toHaveAttribute('data-cards', DEFAULT_PLANNING_POKER_CARDS.join(','))
  })

  it('uses override cards when cards prop is provided', () => {
    const overrideCards = ['S', 'M', 'L']

    render(<PlanningPokerGameContent {...baseProps} cards={overrideCards} />)

    expect(screen.getByTestId('card-deck')).toHaveAttribute('data-cards', overrideCards.join(','))
  })
})
