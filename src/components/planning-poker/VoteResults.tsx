import { Dialog } from '@base-ui/react'
import { ArrowRight, RotateCcw, SquareCheckBig, SquarePen, SquareX } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { PlayerData, StoryItem } from '@/hooks/usePlanningPoker'

import Button from '@/components/basic/Button'
import Container from '@/components/basic/Container'
import IslandShell from '@/components/basic/IslandShell'
import Typography from '@/components/basic/Typography'
import SetCardValuePopover from '@/components/planning-poker/SetCardValuePopover'

export interface VoteResultsProps {
  readonly currentStory?: string
  readonly isConsensus: boolean
  readonly isModerator: boolean
  readonly onAddAdhoc?: (estimateOverride: string) => void
  readonly onEndSession: () => void
  readonly onNextStory: (estimateOverride?: string) => void
  readonly onReestimate: () => void
  readonly players: PlayerData[]
  readonly storyList?: StoryItem[]
}

function computeStats(players: PlayerData[]) {
  const votedPlayers = players.filter((p) => p.voted && p.vote !== null)

  const tally = new Map<string, number>()
  for (const p of votedPlayers) {
    const key = p.vote!
    tally.set(key, (tally.get(key) ?? 0) + 1)
  }

  const numericVotes = votedPlayers.map((p) => Number.parseInt(p.vote!, 10)).filter((n) => !Number.isNaN(n))

  const average = numericVotes.length > 0 ? numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length : null

  return { average, tally }
}

const CARD_ORDER = ['1', '2', '3', '5', '8', '13', '21', '?', '☕']

export default function VoteResults({
  currentStory = '',
  isConsensus,
  isModerator,
  onAddAdhoc,
  onEndSession,
  onNextStory,
  onReestimate,
  players,
  storyList = [],
}: VoteResultsProps) {
  const { average, tally } = computeStats(players)
  const [selectedEstimateOverride, setSelectedEstimateOverride] = useState('')
  const [showEndSessionModal, setShowEndSessionModal] = useState(false)

  const unestimatedStories = storyList.filter((story) => !story.estimatedVote)
  const hasNoPendingStory = unestimatedStories.length === 0
  const hasOnlyCurrentStoryPending = unestimatedStories.length === 1 && unestimatedStories[0]?.title === currentStory
  const allStoriesVoted = storyList.length > 0 && (hasNoPendingStory || hasOnlyCurrentStoryPending)

  const sortedEntries = [...tally.entries()].sort((a, b) => {
    const ai = CARD_ORDER.indexOf(a[0])
    const bi = CARD_ORDER.indexOf(b[0])
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  const maxCount = Math.max(...tally.values(), 1)

  // Auto-suggested value: consensus card or rounded average
  const suggestedEstimate = (() => {
    if (isConsensus && sortedEntries.length > 0) return sortedEntries[0][0]
    if (average !== null) return average % 1 === 0 ? String(average) : average.toFixed(1)
    return ''
  })()

  const canSubmitNextStory = selectedEstimateOverride.length > 0
  const hasQuestionVote = tally.has('?')

  useEffect(() => {
    setSelectedEstimateOverride(suggestedEstimate)
  }, [suggestedEstimate])

  function handleNextStory() {
    const override = selectedEstimateOverride

    if (!override) {
      return
    }

    onNextStory(override)
    setSelectedEstimateOverride('')
  }

  function handleEndSessionClick() {
    setShowEndSessionModal(true)
  }

  function handleConfirmEndSession() {
    setShowEndSessionModal(false)

    if (hasOnlyCurrentStoryPending && canSubmitNextStory) {
      onNextStory(selectedEstimateOverride)
      return
    }

    onEndSession()
  }

  function handleAddAdhoc() {
    setShowEndSessionModal(false)

    if (hasOnlyCurrentStoryPending && canSubmitNextStory) {
      onAddAdhoc?.(selectedEstimateOverride)
      return
    }

    if (onAddAdhoc) {
      onAddAdhoc(selectedEstimateOverride)
    }
  }

  return (
    <>
      <IslandShell className="shrink-0 rounded-xl p-3">
        <Container as="div" className="mb-3 flex flex-wrap items-center gap-2" disableDefaultClasses>
          <Typography as="p" className="island-kicker">
            Results
          </Typography>
          {isConsensus && (
            <Typography as="span" className="bg-success rounded-full px-3 py-1 text-xs font-semibold text-white">
              Consensus!
            </Typography>
          )}
          {average !== null && (
            <Typography
              as="span"
              className="bg-chip-bg border-chip-border text-ink rounded-full border px-3 py-1 text-sm font-semibold"
            >
              Avg: {average % 1 === 0 ? average : average.toFixed(1)}
            </Typography>
          )}
        </Container>

        {/* Vote histogram */}
        {sortedEntries.length > 0 ? (
          <Container as="div" className="mb-3 flex flex-wrap items-end gap-2" disableDefaultClasses>
            {sortedEntries.map(([value, count]) => (
              <Container as="div" className="flex flex-col items-center gap-1" disableDefaultClasses key={value}>
                <Container as="div" className="flex flex-col items-center gap-0.5" disableDefaultClasses>
                  <Typography as="span" className="text-ink-muted text-xs font-medium">
                    {count}
                  </Typography>
                  <div
                    className="bg-primary w-8 rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${Math.max(6, (count / maxCount) * 60)}px`,
                    }}
                  />
                </Container>
                <Typography
                  as="div"
                  className="border-primary bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-bold"
                >
                  {value}
                </Typography>
              </Container>
            ))}
          </Container>
        ) : (
          <Typography as="p" className="text-ink-muted mb-3 text-sm">
            No votes recorded.
          </Typography>
        )}

        {isModerator && (
          <Container as="div" className="flex flex-wrap items-center justify-between gap-2" disableDefaultClasses>
            <Container as="div" className="flex items-center gap-1.5" disableDefaultClasses>
              <Typography as="span" className="text-ink-muted text-[10px] font-semibold tracking-wide uppercase">
                Estimate
              </Typography>
              <SetCardValuePopover
                currentValue={selectedEstimateOverride || null}
                onSelectValue={setSelectedEstimateOverride}
                title="Set estimate"
                triggerAriaLabel="Edit estimate"
                triggerClassName="bg-bg-surface border-border text-ink flex items-center gap-1 rounded-xl border px-2.5 py-1"
                triggerTitle="Edit estimate"
              >
                <span className="text-xs font-bold">{selectedEstimateOverride || '—'}</span>
                <SquarePen className="h-3.5 w-3.5" />
              </SetCardValuePopover>
            </Container>

            <Container as="div" className="flex flex-wrap gap-2" disableDefaultClasses>
              {!allStoriesVoted && (
                <Button
                  className="gap-1.5 rounded-xl px-3 py-1.5 text-xs"
                  onClick={handleEndSessionClick}
                  type="button"
                  variant="outline"
                >
                  <SquareX className="h-3.5 w-3.5" />
                  End Session
                </Button>
              )}
              <Button
                className="gap-1.5 rounded-xl px-3 py-1.5 text-xs"
                disabled={!hasQuestionVote}
                onClick={onReestimate}
                type="button"
                variant="outline"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Re-estimate
              </Button>
              <Button
                className="gap-1.5 rounded-xl px-4 py-1.5 text-xs"
                disabled={allStoriesVoted ? false : !canSubmitNextStory}
                onClick={allStoriesVoted ? handleEndSessionClick : handleNextStory}
                type="button"
              >
                {allStoriesVoted ? (
                  <>
                    <SquareX className="h-3.5 w-3.5" />
                    End Session
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    <SquareCheckBig className="h-3.5 w-3.5" />
                    Next Story
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </Container>
          </Container>
        )}
      </IslandShell>

      <Dialog.Root onOpenChange={setShowEndSessionModal} open={showEndSessionModal}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <Dialog.Popup className="bg-bg-surface fixed top-1/2 left-1/2 z-50 w-96 max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl">
            <div className="mb-6 flex flex-col gap-2">
              <Typography as="h2" className="text-lg font-bold">
                End Session?
              </Typography>
              <Typography as="p" className="text-ink-muted text-sm">
                {allStoriesVoted
                  ? 'All stories have been estimated. Are you sure you want to end this session?'
                  : 'This will end the session now, even with unestimated stories. Continue?'}
              </Typography>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                className="flex-1 rounded-xl px-3 py-2 text-xs"
                onClick={() => setShowEndSessionModal(false)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              {onAddAdhoc && (
                <Button
                  className="flex-1 rounded-xl px-3 py-2 text-xs"
                  disabled={!canSubmitNextStory}
                  onClick={handleAddAdhoc}
                  type="button"
                  variant="outline"
                >
                  Add Adhoc
                </Button>
              )}
              <Button className="flex-1 rounded-xl px-3 py-2 text-xs" onClick={handleConfirmEndSession} type="button">
                Confirm End
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
