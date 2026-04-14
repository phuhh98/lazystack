import { useState } from 'react'
import type { PlayerData } from '@/hooks/usePlanningPoker'

export interface VoteResultsProps {
  players: PlayerData[]
  isModerator: boolean
  isConsensus: boolean
  onNextStory: (estimateOverride?: string) => void
  onEndSession: () => void
}

function computeStats(players: PlayerData[]) {
  const votedPlayers = players.filter((p) => p.voted && p.vote !== null)

  const tally = new Map<string, number>()
  for (const p of votedPlayers) {
    const key = p.vote!
    tally.set(key, (tally.get(key) ?? 0) + 1)
  }

  const numericVotes = votedPlayers
    .map((p) => parseInt(p.vote!, 10))
    .filter((n) => !isNaN(n))

  const average =
    numericVotes.length > 0
      ? numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length
      : null

  return { tally, average }
}

const CARD_ORDER = ['1', '2', '3', '5', '8', '13', '21', '?', '☕']

export default function VoteResults({
  players,
  isModerator,
  isConsensus,
  onNextStory,
  onEndSession,
}: VoteResultsProps) {
  const { tally, average } = computeStats(players)
  const [estimateEdit, setEstimateEdit] = useState('')

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

  function handleNextStory() {
    const override = estimateEdit.trim() || suggestedEstimate || undefined
    onNextStory(override)
    setEstimateEdit('')
  }

  return (
    <div className="island-shell shrink-0 rounded-xl p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="island-kicker">Results</p>
        {isConsensus && (
          <span className="rounded-full bg-[var(--success)] px-3 py-1 text-xs font-semibold text-white">
            Consensus!
          </span>
        )}
        {average !== null && (
          <span className="rounded-full border border-[var(--chip-border)] bg-[var(--chip-bg)] px-3 py-1 text-sm font-semibold text-[var(--ink)]">
            Avg: {average % 1 === 0 ? average : average.toFixed(1)}
          </span>
        )}
      </div>

      {/* Vote histogram */}
      {sortedEntries.length > 0 ? (
        <div className="mb-3 flex flex-wrap items-end gap-2">
          {sortedEntries.map(([value, count]) => (
            <div key={value} className="flex flex-col items-center gap-1">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs font-medium text-[var(--ink-muted)]">{count}</span>
                <div
                  className="w-8 rounded-t-lg bg-[var(--primary)] transition-all duration-500"
                  style={{ height: `${Math.max(6, (count / maxCount) * 60)}px` }}
                />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--primary)] bg-[rgba(204,136,83,0.12)] text-sm font-bold text-[var(--primary)]">
                {value}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mb-3 text-sm text-[var(--ink-muted)]">No votes recorded.</p>
      )}

      {isModerator && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Editable estimate — pre-filled with auto-suggestion */}
          <div className="flex items-center gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-muted)' }}>
              Estimate
            </label>
            <input
              type="text"
              value={estimateEdit}
              onChange={(e) => setEstimateEdit(e.target.value)}
              placeholder={suggestedEstimate || '—'}
              maxLength={6}
              className="w-16 rounded-lg border px-2 py-1 text-xs font-bold outline-none"
              style={{
                borderColor: estimateEdit ? 'var(--primary)' : 'var(--border)',
                background: 'var(--surface)',
                color: 'var(--ink)',
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onEndSession}
              className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--ink-muted)' }}
            >
              End Session
            </button>
            <button
              type="button"
              onClick={handleNextStory}
              className="rounded-xl px-4 py-1.5 text-xs font-semibold text-white transition-colors"
              style={{ background: 'var(--primary)' }}
            >
              Next Story
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
