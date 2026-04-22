import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  default: ({
    onNextStory,
    onReestimate,
  }: {
    onNextStory: (estimatedVote?: string) => void
    onReestimate: () => void
  }) => (
    <div>
      <button data-testid="vote-results-next-story" onClick={() => onNextStory('13')} type="button">
        VoteResults Next Story
      </button>
      <button data-testid="vote-results-reestimate" onClick={onReestimate} type="button">
        VoteResults Re-estimate
      </button>
    </div>
  ),
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

  it('starts ad-hoc story in lobby mode from moderator controls', async () => {
    const user = userEvent.setup()
    const startVoting = vi.fn()

    render(
      <PlanningPokerGameContent
        {...baseProps}
        gameState={{
          ...gameState,
          phase: 'lobby',
          story: '',
        }}
        startVoting={startVoting}
        storyList={[
          {
            id: 's2',
            title: 'Existing backlog item',
          },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Ad-hoc…' }))
    await user.type(screen.getByPlaceholderText('Enter story name…'), '  API pagination  ')
    await user.click(screen.getByRole('button', { name: 'Start' }))

    expect(startVoting).toHaveBeenCalledWith('API pagination')
    expect(startVoting).toHaveBeenCalledTimes(1)
  })

  it('forwards estimated vote from vote results to nextStory', async () => {
    const user = userEvent.setup()
    const nextStory = vi.fn()

    render(
      <PlanningPokerGameContent
        {...baseProps}
        gameState={{
          ...gameState,
          phase: 'revealed',
        }}
        nextStory={nextStory}
      />,
    )

    await user.click(screen.getByTestId('vote-results-next-story'))

    expect(nextStory).toHaveBeenCalledWith('13')
    expect(nextStory).toHaveBeenCalledTimes(1)
  })

  it('forwards re-estimate action to startVoting with current story', async () => {
    const user = userEvent.setup()
    const startVoting = vi.fn()

    render(
      <PlanningPokerGameContent
        {...baseProps}
        gameState={{
          ...gameState,
          phase: 'revealed',
          story: 'Stabilize reconnection',
        }}
        startVoting={startVoting}
      />,
    )

    await user.click(screen.getByTestId('vote-results-reestimate'))

    expect(startVoting).toHaveBeenCalledWith('Stabilize reconnection')
    expect(startVoting).toHaveBeenCalledTimes(1)
  })

  it('renames current story from voting header via edit and save icons', async () => {
    const user = userEvent.setup()
    const startVoting = vi.fn()

    render(
      <PlanningPokerGameContent
        {...baseProps}
        gameState={{
          ...gameState,
          phase: 'voting',
          story: 'Legacy title',
        }}
        startVoting={startVoting}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Edit story name' }))
    const renameInput = screen.getByPlaceholderText('Rename story…')
    await user.clear(renameInput)
    await user.type(renameInput, 'Refined title')
    await user.click(screen.getByRole('button', { name: 'Save story name' }))

    expect(startVoting).toHaveBeenCalledWith('Refined title')
    expect(startVoting).toHaveBeenCalledTimes(1)
  })

  it('renames selected lobby story with the icon-triggered editor', async () => {
    const user = userEvent.setup()
    const startVoting = vi.fn()

    render(
      <PlanningPokerGameContent
        {...baseProps}
        gameState={{
          ...gameState,
          phase: 'lobby',
          story: 'Backlog story',
        }}
        startVoting={startVoting}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Edit story name' }))
    const renameInput = screen.getByPlaceholderText('Rename story…')
    await user.clear(renameInput)
    await user.type(renameInput, 'Backlog story updated')
    await user.click(screen.getByRole('button', { name: 'Save story name' }))

    expect(startVoting).toHaveBeenCalledWith('Backlog story updated')
    expect(startVoting).toHaveBeenCalledTimes(1)
  })
})
