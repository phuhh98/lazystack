import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Trash2, Play, Copy, Check } from 'lucide-react'
import { usePlanningPoker } from '@/hooks/usePlanningPoker'
import type { GamePhase, StoryItem } from '@/hooks/usePlanningPoker'

import CardDeck from '@/components/planning-poker/CardDeck'
import PokerHand from '@/components/planning-poker/PokerHand'
import VoteResults from '@/components/planning-poker/VoteResults'
import Confetti from '@/components/planning-poker/Confetti'
import RightSidebar from '@/components/planning-poker/RightSidebar'
import SessionDashboard from '@/components/planning-poker/SessionDashboard'

export const Route = createFileRoute('/planning-poker/$roomId')({
  component: GameRoom,
})

const CARDS = ['1', '2', '3', '5', '8', '13', '21', '?', '☕']

// SVG analog countdown clock
function CountdownClock({
  remaining,
  total,
}: {
  remaining: number
  total: number
}) {
  const r = 18
  const circ = 2 * Math.PI * r
  const frac = total > 0 ? remaining / total : 0
  const dash = frac * circ
  const urgent = remaining <= 5
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="3"
      />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke={urgent ? 'var(--success)' : 'var(--primary)'}
        strokeWidth="3"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
        style={{ transition: 'stroke-dasharray 1s linear' }}
      />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={urgent ? 'var(--success)' : 'var(--ink)'}
      >
        {remaining}
      </text>
    </svg>
  )
}

// Left sidebar — moderator story list with drag-and-drop + play buttons
function StorySidebar({
  roomId,
  onlineCount,
  storyList,
  phase,
  onAdd,
  onRemove,
  onMove,
  onSelectStory,
}: {
  roomId: string
  onlineCount: number
  storyList: StoryItem[]
  phase: GamePhase
  onAdd: (title: string) => void
  onRemove: (id: string) => void
  onMove: (fromId: string, toId: string) => void
  onSelectStory: (storyId: string, title: string) => void
}) {
  const [input, setInput] = useState('')
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const canSelect = phase === 'lobby' || phase === 'revealed'

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onAdd(input.trim())
    setInput('')
  }

  function handleCopy() {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside
      className="flex w-56 shrink-0 flex-col gap-2 overflow-hidden border-r p-3"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Room info */}
      <div className="shrink-0">
        <p className="island-kicker mb-1">Room</p>
        <div className="flex items-center gap-1.5">
          <span
            className="font-mono text-sm font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            {roomId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded p-0.5 transition-colors"
            style={{ color: copied ? 'var(--success)' : 'var(--ink-muted)' }}
            title="Copy room code"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--ink-muted)' }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--success)' }}
            />
            {onlineCount}
          </span>
        </div>
      </div>

      <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />

      {/* Add form */}
      <p className="island-kicker shrink-0">Story List</p>
      <form onSubmit={handleAdd} className="flex shrink-0 gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add story…"
          className="min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface)',
            color: 'var(--ink)',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg disabled:opacity-40"
          style={{ background: 'var(--primary)', color: 'white' }}
          title="Add story"
        >
          <Plus size={13} />
        </button>
      </form>

      {/* Story list — scrollable, drag-and-drop */}
      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {storyList.length === 0 ? (
          <li className="py-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
            No stories yet.
          </li>
        ) : (
          storyList.map((story) => (
            <li
              key={story.id}
              draggable={!story.estimatedVote}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', story.id)
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverId(story.id)
              }}
              onDragLeave={() => setDragOverId(null)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOverId(null)
                const fromId = e.dataTransfer.getData('text/plain')
                if (fromId && fromId !== story.id) onMove(fromId, story.id)
              }}
              onDragEnd={() => setDragOverId(null)}
              className="flex items-center gap-1 rounded-lg border px-2 py-1.5 transition-colors"
              style={{
                borderColor:
                  dragOverId === story.id
                    ? 'var(--primary)'
                    : story.estimatedVote
                      ? 'var(--primary)'
                      : 'var(--border)',
                background:
                  dragOverId === story.id
                    ? 'rgba(204,136,83,0.1)'
                    : story.estimatedVote
                      ? 'rgba(204,136,83,0.06)'
                      : 'var(--surface)',
                cursor: story.estimatedVote ? 'default' : 'grab',
              }}
            >
              <span
                className="flex-1 truncate text-xs"
                style={{ color: 'var(--ink)' }}
                title={story.title}
              >
                {story.title}
              </span>
              {story.estimatedVote ? (
                <span
                  className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
                  style={{ background: 'var(--primary)' }}
                >
                  {story.estimatedVote}
                </span>
              ) : (
                <div className="flex shrink-0 items-center gap-0.5">
                  {canSelect && (
                    <button
                      type="button"
                      onClick={() => onSelectStory(story.id, story.title)}
                      className="flex h-5 w-5 items-center justify-center rounded transition-colors hover:opacity-80"
                      style={{ background: 'var(--primary)', color: 'white' }}
                      title="Select this story"
                    >
                      <Play size={9} fill="currentColor" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(story.id)}
                    className="rounded p-0.5 hover:text-red-500"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </aside>
  )
}

// Read-only left sidebar for participants
function ParticipantStorySidebar({
  roomId,
  onlineCount,
  storyList,
  currentStory,
}: {
  roomId: string
  onlineCount: number
  storyList: StoryItem[]
  currentStory: string
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside
      className="flex w-56 shrink-0 flex-col gap-2 overflow-hidden border-r p-3"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Room info */}
      <div className="shrink-0">
        <p className="island-kicker mb-1">Room</p>
        <div className="flex items-center gap-1.5">
          <span
            className="font-mono text-sm font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            {roomId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded p-0.5 transition-colors"
            style={{ color: copied ? 'var(--success)' : 'var(--ink-muted)' }}
            title="Copy room code"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: 'var(--ink-muted)' }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--success)' }}
            />
            {onlineCount}
          </span>
        </div>
      </div>

      <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />

      <p className="island-kicker shrink-0">Stories</p>
      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {storyList.length === 0 ? (
          <li className="py-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
            No stories yet.
          </li>
        ) : (
          storyList.map((story) => {
            const isActive = story.title === currentStory
            return (
              <li
                key={story.id}
                className="flex items-center gap-1.5 rounded-lg border px-2 py-1.5"
                style={{
                  borderColor: isActive
                    ? 'var(--primary)'
                    : story.estimatedVote
                      ? 'var(--primary)'
                      : 'var(--border)',
                  background: isActive
                    ? 'rgba(204,136,83,0.1)'
                    : story.estimatedVote
                      ? 'rgba(204,136,83,0.06)'
                      : 'var(--surface)',
                }}
              >
                {isActive && (
                  <span
                    className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full"
                    style={{ background: 'var(--primary)' }}
                  />
                )}
                <span
                  className="flex-1 truncate text-xs"
                  style={{
                    color: isActive ? 'var(--primary)' : 'var(--ink)',
                    fontWeight: isActive ? 700 : 400,
                  }}
                  title={story.title}
                >
                  {story.title}
                </span>
                {story.estimatedVote && (
                  <span
                    className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
                    style={{ background: 'var(--primary)' }}
                  >
                    {story.estimatedVote}
                  </span>
                )}
              </li>
            )
          })
        )}
      </ul>
    </aside>
  )
}

function GameRoom() {
  const { roomId } = Route.useParams()
  const {
    playerId,
    isModerator,
    canClaimModerator,
    gameState,
    players,
    myVote,
    isConnected,
    isConsensus,
    timerRemaining,
    castVote,
    startVoting,
    selectStory,
    clearStorySelection,
    revealVotes,
    nextStory,
    claimModerator,
    storyList,
    addStory,
    removeStory,
    moveStory,
    endSession,
    setStoryEstimate,
    chat,
    sendMessage,
    toggleHand,
    lowerHand,
    setTimerDuration,
    startTimer,
    stopTimer,
    setCodeWord,
  } = usePlanningPoker(roomId)

  const [adHocInput, setAdHocInput] = useState('')
  const [showAdHoc, setShowAdHoc] = useState(false)

  if (!isConnected) {
    return (
      <div className="-mx-4 flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--primary)]" />
          <p className="island-kicker">Connecting…</p>
        </div>
        <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
          Joining room {roomId}
        </p>
      </div>
    )
  }

  // Dashboard — scrollable summary page
  if (gameState.phase === 'dashboard') {
    return (
      <div className="-mx-4 relative flex h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <SessionDashboard
              storyList={storyList}
              isModerator={isModerator}
              onSetEstimate={setStoryEstimate}
            />
          </div>
        </div>
        <RightSidebar
          chat={chat}
          playerId={playerId}
          onSend={sendMessage}
          players={players}
          isModerator={isModerator}
          timerDuration={gameState.timerDuration}
          onToggleHand={toggleHand}
          onLowerHand={lowerHand}
          onSetTimerDuration={setTimerDuration}
          codeWord={gameState.codeWord}
          onSetCodeWord={isModerator ? setCodeWord : undefined}
        />
      </div>
    )
  }

  const onlineCount = players.filter((p) => p.isOnline).length
  const hasUnestimated = storyList.some((s) => !s.estimatedVote)

  function handleAdHocStart(e: React.FormEvent) {
    e.preventDefault()
    if (!adHocInput.trim()) return
    startVoting(adHocInput.trim())
    setAdHocInput('')
    setShowAdHoc(false)
  }

  function handleRenameStory(e: React.FormEvent) {
    e.preventDefault()
    if (!adHocInput.trim()) return
    startVoting(adHocInput.trim())
    setAdHocInput('')
  }

  const allVoted =
    players.length > 0 &&
    players.filter((p) => p.isOnline).every((p) => p.voted)
  const showConfetti = isConsensus && gameState.phase === 'revealed'

  // ── Shared game content ──
  function GameContent() {
    return (
      <>
        {/* Story section */}
        <section className="island-shell rounded-xl p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {/* LOBBY — moderator */}
              {gameState.phase === 'lobby' && isModerator && (
                <>
                  {gameState.story && !showAdHoc ? (
                    /* Story selected — show name + start button */
                    <div className="flex items-center gap-2">
                      <h2
                        className="display-title min-w-0 flex-1 truncate text-xl font-bold"
                        style={{ color: 'var(--ink)' }}
                      >
                        {gameState.story}
                      </h2>
                      <button
                        type="button"
                        onClick={() => startVoting(gameState.story)}
                        className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
                        style={{ background: 'var(--primary)' }}
                      >
                        Start Voting
                      </button>
                      <button
                        type="button"
                        onClick={clearStorySelection}
                        className="shrink-0 rounded-lg border px-2 py-1.5 text-xs"
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--ink-muted)',
                        }}
                      >
                        Change
                      </button>
                    </div>
                  ) : showAdHoc ? (
                    /* Ad-hoc free-form input */
                    <form onSubmit={handleAdHocStart} className="flex gap-2">
                      <input
                        type="text"
                        value={adHocInput}
                        onChange={(e) => setAdHocInput(e.target.value)}
                        placeholder="Enter story name…"
                        autoFocus
                        className="min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
                        style={{
                          borderColor: 'var(--border)',
                          background: 'var(--surface)',
                          color: 'var(--ink)',
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!adHocInput.trim()}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                        style={{ background: 'var(--primary)' }}
                      >
                        Start
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdHoc(false)
                          setAdHocInput('')
                        }}
                        className="rounded-lg border px-2 py-1.5 text-xs"
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--ink-muted)',
                        }}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : hasUnestimated ? (
                    /* Stories exist — guide moderator */
                    <div className="flex items-center gap-2">
                      <p
                        className="text-sm"
                        style={{ color: 'var(--ink-muted)' }}
                      >
                        Click <span style={{ color: 'var(--primary)' }}>▶</span>{' '}
                        on a story to select it
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAdHoc(true)}
                        className="shrink-0 rounded-lg border px-2 py-1 text-xs"
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--ink-muted)',
                        }}
                      >
                        Ad-hoc…
                      </button>
                    </div>
                  ) : (
                    /* No stories — free-form input */
                    <form onSubmit={handleAdHocStart} className="flex gap-2">
                      <input
                        type="text"
                        value={adHocInput}
                        onChange={(e) => setAdHocInput(e.target.value)}
                        placeholder="Enter story to estimate…"
                        className="min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
                        style={{
                          borderColor: 'var(--border)',
                          background: 'var(--surface)',
                          color: 'var(--ink)',
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!adHocInput.trim()}
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                        style={{ background: 'var(--primary)' }}
                      >
                        Start
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* LOBBY — participant */}
              {gameState.phase === 'lobby' && !isModerator && (
                <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                  Waiting for moderator to start…
                </p>
              )}

              {/* VOTING / REVEALED — story title */}
              {gameState.phase !== 'lobby' && (
                <div className="flex items-center gap-2">
                  <h2
                    className="display-title min-w-0 flex-1 truncate text-xl font-bold"
                    style={{ color: 'var(--ink)' }}
                  >
                    {gameState.story || '(No story set)'}
                  </h2>
                  {timerRemaining !== null && gameState.phase === 'voting' && (
                    <CountdownClock
                      remaining={timerRemaining}
                      total={gameState.timerDuration}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Status chips — non-moderator */}
            {!isModerator && gameState.phase !== 'lobby' && (
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: 'var(--ink-muted)' }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: 'var(--success)' }}
                  />
                  {onlineCount} online
                </span>
                {gameState.storyIndex > 0 && (
                  <span
                    className="rounded-full border px-2 py-0.5 text-xs"
                    style={{
                      borderColor: 'var(--chip-border)',
                      background: 'var(--chip-bg)',
                      color: 'var(--ink-muted)',
                    }}
                  >
                    #{gameState.storyIndex + 1}
                  </span>
                )}
              </div>
            )}

            {/* Rename form — moderator during voting */}
            {gameState.phase === 'voting' && isModerator && (
              <form
                onSubmit={handleRenameStory}
                className="flex shrink-0 gap-1.5"
              >
                <input
                  type="text"
                  value={adHocInput}
                  onChange={(e) => setAdHocInput(e.target.value)}
                  placeholder="Rename…"
                  className="w-28 rounded-lg border px-2 py-1 text-xs outline-none"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                />
                <button
                  type="submit"
                  disabled={!adHocInput.trim()}
                  className="rounded-lg border px-2 py-1 text-xs font-semibold disabled:opacity-40"
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                  }}
                >
                  Rename
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── Vote status + moderator controls — RIGHT BELOW story section ── */}
        {gameState.phase === 'voting' && isModerator && (
          <div
            className="flex shrink-0 items-center justify-between gap-3 rounded-xl border px-4 py-2"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              {allVoted
                ? 'All voted — ready to reveal!'
                : `${players.filter((p) => p.isOnline && p.voted).length}/${onlineCount} voted`}
            </p>
            <div className="flex items-center gap-2">
              {gameState.timerDuration > 0 && timerRemaining === null && (
                <button
                  type="button"
                  onClick={startTimer}
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                  }}
                >
                  Start timer
                </button>
              )}
              {timerRemaining !== null && (
                <button
                  type="button"
                  onClick={stopTimer}
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--ink-muted)',
                  }}
                >
                  Stop timer
                </button>
              )}
              <button
                type="button"
                onClick={revealVotes}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: 'var(--primary)' }}
              >
                Reveal Cards
              </button>
            </div>
          </div>
        )}

        {/* Participant voted status — below story section */}
        {gameState.phase === 'voting' && !isModerator && myVote && (
          <p
            className="shrink-0 text-center text-sm"
            style={{ color: 'var(--ink-muted)' }}
          >
            Voted ✓ — waiting for moderator to reveal…
          </p>
        )}

        {/* Poker hand — takes remaining space */}
        <PokerHand
          players={players}
          phase={gameState.phase}
          currentPlayerId={playerId}
          moderatorId={gameState.moderatorId}
          chat={chat}
        />

        {/* Results (revealed phase) */}
        {gameState.phase === 'revealed' && (
          <VoteResults
            players={players}
            isModerator={isModerator}
            isConsensus={isConsensus}
            onNextStory={(est) => nextStory(est)}
            onEndSession={endSession}
          />
        )}

        {/* Claim moderator */}
        {canClaimModerator && (
          <div
            className="shrink-0 rounded-xl border px-4 py-3"
            style={{
              borderColor: 'var(--primary)',
              background: 'rgba(204,136,83,0.08)',
            }}
          >
            <p
              className="mb-1.5 text-xs font-medium"
              style={{ color: 'var(--primary-deep)' }}
            >
              Moderator has been offline for a while.
            </p>
            <button
              type="button"
              onClick={claimModerator}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
              style={{ background: 'var(--primary-deep)' }}
            >
              Claim Moderator
            </button>
          </div>
        )}

        {/* Card deck (voting phase) */}
        {gameState.phase === 'voting' && (
          <CardDeck
            cards={CARDS}
            selectedCard={myVote}
            disabled={false}
            onSelect={castVote}
          />
        )}
      </>
    )
  }

  const rightSidebarProps = {
    chat,
    playerId,
    onSend: sendMessage,
    players,
    isModerator,
    timerDuration: gameState.timerDuration,
    onToggleHand: toggleHand,
    onLowerHand: lowerHand,
    onSetTimerDuration: setTimerDuration,
    codeWord: gameState.codeWord,
    onSetCodeWord: isModerator ? setCodeWord : undefined,
  }

  return (
    <div className="-mx-4 relative h-full overflow-hidden">
      {showConfetti && <Confetti key={gameState.storyIndex} />}

      {isModerator ? (
        // Moderator: three-column layout [story sidebar] [center] [right sidebar]
        <div className="flex h-full overflow-x-auto overflow-y-hidden">
          <StorySidebar
            roomId={roomId}
            onlineCount={onlineCount}
            storyList={storyList}
            phase={gameState.phase}
            onAdd={addStory}
            onRemove={removeStory}
            onMove={moveStory}
            onSelectStory={selectStory}
          />
          <div className="flex min-w-0 flex-1 overflow-hidden">
            <div className="flex min-w-[420px] flex-1 flex-col gap-3 overflow-hidden p-4">
              {/* Moderator top bar */}
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                  style={{ background: 'var(--primary)' }}
                >
                  Moderator
                </span>
                {gameState.storyIndex > 0 && (
                  <span
                    className="rounded-full border px-2.5 py-0.5 text-xs"
                    style={{
                      borderColor: 'var(--chip-border)',
                      background: 'var(--chip-bg)',
                      color: 'var(--ink-muted)',
                    }}
                  >
                    Story #{gameState.storyIndex + 1}
                  </span>
                )}
              </div>
              <GameContent />
            </div>
            <RightSidebar {...rightSidebarProps} />
          </div>
        </div>
      ) : (
        // Participant: three-column layout [story sidebar] [center] [right sidebar]
        <div className="flex h-full overflow-x-auto overflow-y-hidden">
          <ParticipantStorySidebar
            roomId={roomId}
            onlineCount={onlineCount}
            storyList={storyList}
            currentStory={gameState.story}
          />
          <div className="flex min-w-[420px] flex-1 flex-col gap-3 overflow-hidden p-4">
            <GameContent />
          </div>
          <RightSidebar {...rightSidebarProps} />
        </div>
      )}
    </div>
  )
}
