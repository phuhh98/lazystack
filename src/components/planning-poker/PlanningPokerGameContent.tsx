import type { KeyboardEvent } from 'react'

import { Form, Input } from '@base-ui/react'
import { useState } from 'react'

import type { ChatMessage, GameState, PlayerData } from '@/hooks/usePlanningPoker'

import Button from '@/components/basic/Button'
import Container from '@/components/basic/Container'
import IslandShell from '@/components/basic/IslandShell'
import Typography from '@/components/basic/Typography'
import CardDeck from '@/components/planning-poker/CardDeck'
import CountdownClock from '@/components/planning-poker/CountdownClock'
import PokerHand from '@/components/planning-poker/PokerHand'
import VoteResults from '@/components/planning-poker/VoteResults'
import { DEFAULT_PLANNING_POKER_CARDS } from '@/lib/constants/planningPoker'

type FormSubmitEvent = Parameters<NonNullable<React.ComponentProps<'form'>['onSubmit']>>[0]

interface PlanningPokerGameContentProps {
  readonly canClaimModerator: boolean
  readonly cards?: string[]
  readonly castVote: (card: string) => void
  readonly chat: ChatMessage[]
  readonly claimModerator: () => void
  readonly clearStorySelection: () => void
  readonly endSession: () => void
  readonly gameState: GameState
  readonly isConsensus: boolean
  readonly isModerator: boolean
  readonly myVote: null | string
  readonly nextStory: (estimatedVote: string) => void
  readonly onlineCount: number
  readonly playerId: string
  readonly players: PlayerData[]
  readonly revealVotes: () => void
  readonly startTimer: () => void
  readonly startVoting: (story: string) => void
  readonly stopTimer: () => void
  readonly storyList: { estimatedVote?: string }[]
  readonly timerRemaining: null | number
}

export default function PlanningPokerGameContent({
  canClaimModerator,
  cards = DEFAULT_PLANNING_POKER_CARDS,
  castVote,
  chat,
  claimModerator,
  clearStorySelection,
  endSession,
  gameState,
  isConsensus,
  isModerator,
  myVote,
  nextStory,
  onlineCount,
  playerId,
  players,
  revealVotes,
  startTimer,
  startVoting,
  stopTimer,
  storyList,
  timerRemaining,
}: PlanningPokerGameContentProps) {
  const [adHocInput, setAdHocInput] = useState('')
  const [showAdHoc, setShowAdHoc] = useState(false)

  const allVoted = players.length > 0 && players.filter((p) => p.isOnline).every((p) => p.voted)
  const hasUnestimated = storyList.some((story) => !story.estimatedVote)

  function submitAdHocStart() {
    const nextStoryTitle = adHocInput.trim()

    if (!nextStoryTitle) {
      return
    }

    startVoting(nextStoryTitle)
    setAdHocInput('')
    setShowAdHoc(false)
  }

  function handleAdHocStartSubmit(event: FormSubmitEvent) {
    event.preventDefault()
    submitAdHocStart()
  }

  function handleAdHocInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    submitAdHocStart()
  }

  function handleRenameStory(e: FormSubmitEvent) {
    e.preventDefault()
    if (!adHocInput.trim()) return

    startVoting(adHocInput.trim())
    setAdHocInput('')
  }

  function renderModeratorLobbySection() {
    if (!isModerator || gameState.phase !== 'lobby') {
      return null
    }

    if (gameState.story && !showAdHoc) {
      return (
        <Container as="div" className="flex items-center gap-2" disableDefaultClasses>
          <Typography as="h2" className="display-title text-ink min-w-0 flex-1 truncate text-xl font-bold">
            {gameState.story}
          </Typography>
          <Button
            className="shrink-0 rounded-lg px-3 py-1.5 text-sm"
            onClick={() => startVoting(gameState.story)}
            type="button"
          >
            Start Voting
          </Button>
          <Button
            className="text-ink-muted shrink-0 rounded-lg px-2 py-1.5 text-xs"
            onClick={clearStorySelection}
            type="button"
            variant="outline"
          >
            Change
          </Button>
        </Container>
      )
    }

    if (showAdHoc) {
      return (
        <Form className="flex gap-2" onFormSubmit={submitAdHocStart}>
          <Input
            autoFocus
            className="border-border bg-bg-surface text-ink placeholder:text-ink-muted focus:border-primary min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
            onChange={(e) => setAdHocInput(e.target.value)}
            onKeyDown={handleAdHocInputKeyDown}
            placeholder="Enter story name…"
            type="text"
            value={adHocInput}
          />
          <Button
            className="rounded-lg px-3 py-1.5 text-sm"
            disabled={!adHocInput.trim()}
            onClick={submitAdHocStart}
            type="button"
          >
            Start
          </Button>
          <Button
            className="text-ink-muted rounded-lg px-2 py-1.5 text-xs"
            onClick={() => {
              setShowAdHoc(false)
              setAdHocInput('')
            }}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
        </Form>
      )
    }

    if (hasUnestimated) {
      return (
        <Container as="div" className="flex items-center gap-2" disableDefaultClasses>
          <Typography as="p" className="text-ink-muted text-sm">
            Click <span className="text-primary">▶</span> on a story to select it
          </Typography>
          <Button
            className="text-ink-muted shrink-0 rounded-lg px-2 py-1 text-xs"
            onClick={() => setShowAdHoc(true)}
            type="button"
            variant="outline"
          >
            Ad-hoc…
          </Button>
        </Container>
      )
    }

    return (
      <Form className="flex gap-2" onSubmit={handleAdHocStartSubmit}>
        <Input
          className="border-border bg-bg-surface text-ink placeholder:text-ink-muted focus:border-primary min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
          onChange={(e) => setAdHocInput(e.target.value)}
          onKeyDown={handleAdHocInputKeyDown}
          placeholder="Enter story to estimate…"
          type="text"
          value={adHocInput}
        />
        <Button
          className="rounded-lg px-3 py-1.5 text-sm"
          disabled={!adHocInput.trim()}
          onClick={submitAdHocStart}
          type="button"
        >
          Start
        </Button>
      </Form>
    )
  }

  return (
    <>
      <IslandShell as="section" className="rounded-xl p-3">
        <Container as="div" className="flex items-start justify-between gap-2" disableDefaultClasses>
          <Container as="div" className="min-w-0 flex-1" disableDefaultClasses>
            {renderModeratorLobbySection()}

            {gameState.phase === 'lobby' && !isModerator && (
              <Typography as="p" className="text-ink-muted text-sm">
                Waiting for moderator to start…
              </Typography>
            )}

            {gameState.phase !== 'lobby' && (
              <Container as="div" className="flex items-center gap-2" disableDefaultClasses>
                <Typography as="h2" className="display-title text-ink min-w-0 flex-1 truncate text-xl font-bold">
                  {gameState.story || '(No story set)'}
                </Typography>
                {timerRemaining !== null && gameState.phase === 'voting' && (
                  <CountdownClock remaining={timerRemaining} total={gameState.timerDuration} />
                )}
              </Container>
            )}
          </Container>

          {!isModerator && gameState.phase !== 'lobby' && (
            <Container as="div" className="flex shrink-0 items-center gap-2" disableDefaultClasses>
              <Typography as="span" className="text-ink-muted flex items-center gap-1 text-xs">
                <span className="bg-success h-1.5 w-1.5 rounded-full" />
                {onlineCount} online
              </Typography>
              {gameState.storyIndex > 0 && (
                <Typography
                  as="span"
                  className="bg-chip-bg border-chip-border text-ink-muted rounded-full border px-2 py-0.5 text-xs"
                >
                  #{gameState.storyIndex + 1}
                </Typography>
              )}
            </Container>
          )}

          {gameState.phase === 'voting' && isModerator && (
            <Form className="flex shrink-0 gap-1.5" onSubmit={handleRenameStory}>
              <Input
                className="border-border bg-bg-surface text-ink placeholder:text-ink-muted focus:border-primary w-28 rounded-lg border px-2 py-1 text-xs outline-none"
                onChange={(e) => setAdHocInput(e.target.value)}
                placeholder="Rename…"
                type="text"
                value={adHocInput}
              />
              <Button
                className="text-primary border-primary rounded-lg px-2 py-1 text-xs"
                disabled={!adHocInput.trim()}
                type="submit"
                variant="outline"
              >
                Rename
              </Button>
            </Form>
          )}
        </Container>
      </IslandShell>

      {gameState.phase === 'voting' && isModerator && (
        <Container
          as="div"
          className="border-border bg-bg-surface flex shrink-0 items-center justify-between gap-3 rounded-xl border px-4 py-2"
          disableDefaultClasses
        >
          <Typography as="p" className="text-ink-muted text-sm">
            {allVoted
              ? 'All voted — ready to reveal!'
              : `${players.filter((p) => p.isOnline && p.voted).length}/${onlineCount} voted`}
          </Typography>
          <Container as="div" className="flex items-center gap-2" disableDefaultClasses>
            {gameState.timerDuration > 0 && timerRemaining === null && (
              <Button
                className="text-primary border-primary rounded-xl px-3 py-1.5 text-xs"
                onClick={startTimer}
                type="button"
                variant="outline"
              >
                Start timer
              </Button>
            )}
            {timerRemaining !== null && (
              <Button
                className="text-ink-muted rounded-xl px-3 py-1.5 text-xs"
                onClick={stopTimer}
                type="button"
                variant="outline"
              >
                Stop timer
              </Button>
            )}
            <Button className="rounded-xl px-4 py-2 text-sm" onClick={revealVotes} type="button">
              Reveal Cards
            </Button>
          </Container>
        </Container>
      )}

      {gameState.phase === 'voting' && !isModerator && myVote && (
        <Typography as="p" className="text-ink-muted shrink-0 text-center text-sm">
          Voted ✓ — waiting for moderator to reveal…
        </Typography>
      )}

      <PokerHand
        chat={chat}
        currentPlayerId={playerId}
        moderatorId={gameState.moderatorId}
        phase={gameState.phase}
        players={players}
      />

      {gameState.phase === 'revealed' && (
        <VoteResults
          isConsensus={isConsensus}
          isModerator={isModerator}
          onEndSession={endSession}
          onNextStory={(estimatedVote) => {
            if (estimatedVote) {
              nextStory(estimatedVote)
            }
          }}
          players={players}
        />
      )}

      {canClaimModerator && (
        <Container
          as="div"
          className="bg-primary/10 border-primary shrink-0 rounded-xl border px-4 py-3"
          disableDefaultClasses
        >
          <Typography as="p" className="text-primary-deep mb-1.5 text-xs font-medium">
            Moderator has been offline for a while.
          </Typography>
          <Button
            className="bg-primary-deep hover:bg-primary rounded-lg px-3 py-1.5 text-xs"
            onClick={claimModerator}
            type="button"
          >
            Claim Moderator
          </Button>
        </Container>
      )}

      {gameState.phase === 'voting' && (
        <CardDeck cards={cards} disabled={false} onSelect={castVote} selectedCard={myVote} />
      )}
    </>
  )
}
