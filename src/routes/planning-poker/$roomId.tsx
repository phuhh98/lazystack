import { createFileRoute } from '@tanstack/react-router'
import { Check, Copy, Play, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { GamePhase, StoryItem } from '@/hooks/usePlanningPoker'

import CardDeck from '@/components/planning-poker/CardDeck'
import Confetti from '@/components/planning-poker/Confetti'
import PokerHand from '@/components/planning-poker/PokerHand'
import RightSidebar from '@/components/planning-poker/RightSidebar'
import SessionDashboard from '@/components/planning-poker/SessionDashboard'
import VoteResults from '@/components/planning-poker/VoteResults'
import { usePlanningPoker } from '@/hooks/usePlanningPoker'

export const Route = createFileRoute('/planning-poker/$roomId')({
  component: GameRoom,
})

const CARDS = ['1', '2', '3', '5', '8', '13', '21', '?', '☕']

// SVG analog countdown clock
function CountdownClock({ remaining, total }: { remaining: number; total: number }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const frac = total > 0 ? remaining / total : 0
  const dash = frac * circ
  const urgent = remaining <= 5
  return (
    <svg className="shrink-0" height="40" viewBox="0 0 40 40" width="40">
      <circle cx="20" cy="20" fill="none" r={r} stroke="var(--border)" strokeWidth="3" />
      <circle
        cx="20"
        cy="20"
        fill="none"
        r={r}
        stroke={urgent ? 'var(--success)' : 'var(--primary)'}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        strokeWidth="3"
        style={{ transition: 'stroke-dasharray 1s linear' }}
        transform="rotate(-90 20 20)"
      />
      <text
        fill={urgent ? 'var(--success)' : 'var(--ink)'}
        fontSize="11"
        fontWeight="700"
        textAnchor="middle"
        x="20"
        y="24"
      >
        {remaining}
      </text>
    </svg>
  )
}

function GameRoom() {
  const { roomId } = Route.useParams()
  const {
    addStory,
    canClaimModerator,
    castVote,
    chat,
    claimModerator,
    clearStorySelection,
    endSession,
    gameState,
    isConnected,
    isConsensus,
    isModerator,
    lowerHand,
    moveStory,
    myVote,
    nextStory,
    playerId,
    players,
    removeStory,
    revealVotes,
    selectStory,
    sendMessage,
    setCodeWord,
    setStoryEstimate,
    setTimerDuration,
    startTimer,
    startVoting,
    stopTimer,
    storyList,
    timerRemaining,
    toggleHand,
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
      <div className="relative -mx-4 flex h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <SessionDashboard isModerator={isModerator} onSetEstimate={setStoryEstimate} storyList={storyList} />
          </div>
        </div>
        <RightSidebar
          chat={chat}
          codeWord={gameState.codeWord}
          isModerator={isModerator}
          onLowerHand={lowerHand}
          onSend={sendMessage}
          onSetCodeWord={isModerator ? setCodeWord : undefined}
          onSetTimerDuration={setTimerDuration}
          onToggleHand={toggleHand}
          playerId={playerId}
          players={players}
          timerDuration={gameState.timerDuration}
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

  const allVoted = players.length > 0 && players.filter((p) => p.isOnline).every((p) => p.voted)
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
                        className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-white"
                        onClick={() => startVoting(gameState.story)}
                        style={{ background: 'var(--primary)' }}
                        type="button"
                      >
                        Start Voting
                      </button>
                      <button
                        className="shrink-0 rounded-lg border px-2 py-1.5 text-xs"
                        onClick={clearStorySelection}
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--ink-muted)',
                        }}
                        type="button"
                      >
                        Change
                      </button>
                    </div>
                  ) : showAdHoc ? (
                    /* Ad-hoc free-form input */
                    <form className="flex gap-2" onSubmit={handleAdHocStart}>
                      <input
                        autoFocus
                        className="min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
                        onChange={(e) => setAdHocInput(e.target.value)}
                        placeholder="Enter story name…"
                        style={{
                          background: 'var(--surface)',
                          borderColor: 'var(--border)',
                          color: 'var(--ink)',
                        }}
                        type="text"
                        value={adHocInput}
                      />
                      <button
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                        disabled={!adHocInput.trim()}
                        style={{ background: 'var(--primary)' }}
                        type="submit"
                      >
                        Start
                      </button>
                      <button
                        className="rounded-lg border px-2 py-1.5 text-xs"
                        onClick={() => {
                          setShowAdHoc(false)
                          setAdHocInput('')
                        }}
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--ink-muted)',
                        }}
                        type="button"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : hasUnestimated ? (
                    /* Stories exist — guide moderator */
                    <div className="flex items-center gap-2">
                      <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                        Click <span style={{ color: 'var(--primary)' }}>▶</span> on a story to select it
                      </p>
                      <button
                        className="shrink-0 rounded-lg border px-2 py-1 text-xs"
                        onClick={() => setShowAdHoc(true)}
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--ink-muted)',
                        }}
                        type="button"
                      >
                        Ad-hoc…
                      </button>
                    </div>
                  ) : (
                    /* No stories — free-form input */
                    <form className="flex gap-2" onSubmit={handleAdHocStart}>
                      <input
                        className="min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
                        onChange={(e) => setAdHocInput(e.target.value)}
                        placeholder="Enter story to estimate…"
                        style={{
                          background: 'var(--surface)',
                          borderColor: 'var(--border)',
                          color: 'var(--ink)',
                        }}
                        type="text"
                        value={adHocInput}
                      />
                      <button
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                        disabled={!adHocInput.trim()}
                        style={{ background: 'var(--primary)' }}
                        type="submit"
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
                    <CountdownClock remaining={timerRemaining} total={gameState.timerDuration} />
                  )}
                </div>
              )}
            </div>

            {/* Status chips — non-moderator */}
            {!isModerator && gameState.phase !== 'lobby' && (
              <div className="flex shrink-0 items-center gap-2">
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--success)' }} />
                  {onlineCount} online
                </span>
                {gameState.storyIndex > 0 && (
                  <span
                    className="rounded-full border px-2 py-0.5 text-xs"
                    style={{
                      background: 'var(--chip-bg)',
                      borderColor: 'var(--chip-border)',
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
              <form className="flex shrink-0 gap-1.5" onSubmit={handleRenameStory}>
                <input
                  className="w-28 rounded-lg border px-2 py-1 text-xs outline-none"
                  onChange={(e) => setAdHocInput(e.target.value)}
                  placeholder="Rename…"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--ink)',
                  }}
                  type="text"
                  value={adHocInput}
                />
                <button
                  className="rounded-lg border px-2 py-1 text-xs font-semibold disabled:opacity-40"
                  disabled={!adHocInput.trim()}
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                  }}
                  type="submit"
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
              background: 'var(--surface)',
              borderColor: 'var(--border)',
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
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                  onClick={startTimer}
                  style={{
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                  }}
                  type="button"
                >
                  Start timer
                </button>
              )}
              {timerRemaining !== null && (
                <button
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                  onClick={stopTimer}
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--ink-muted)',
                  }}
                  type="button"
                >
                  Stop timer
                </button>
              )}
              <button
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white"
                onClick={revealVotes}
                style={{ background: 'var(--primary)' }}
                type="button"
              >
                Reveal Cards
              </button>
            </div>
          </div>
        )}

        {/* Participant voted status — below story section */}
        {gameState.phase === 'voting' && !isModerator && myVote && (
          <p className="shrink-0 text-center text-sm" style={{ color: 'var(--ink-muted)' }}>
            Voted ✓ — waiting for moderator to reveal…
          </p>
        )}

        {/* Poker hand — takes remaining space */}
        <PokerHand
          chat={chat}
          currentPlayerId={playerId}
          moderatorId={gameState.moderatorId}
          phase={gameState.phase}
          players={players}
        />

        {/* Results (revealed phase) */}
        {gameState.phase === 'revealed' && (
          <VoteResults
            isConsensus={isConsensus}
            isModerator={isModerator}
            onEndSession={endSession}
            onNextStory={(est) => nextStory(est)}
            players={players}
          />
        )}

        {/* Claim moderator */}
        {canClaimModerator && (
          <div
            className="shrink-0 rounded-xl border px-4 py-3"
            style={{
              background: 'rgba(204,136,83,0.08)',
              borderColor: 'var(--primary)',
            }}
          >
            <p className="mb-1.5 text-xs font-medium" style={{ color: 'var(--primary-deep)' }}>
              Moderator has been offline for a while.
            </p>
            <button
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
              onClick={claimModerator}
              style={{ background: 'var(--primary-deep)' }}
              type="button"
            >
              Claim Moderator
            </button>
          </div>
        )}

        {/* Card deck (voting phase) */}
        {gameState.phase === 'voting' && (
          <CardDeck cards={CARDS} disabled={false} onSelect={castVote} selectedCard={myVote} />
        )}
      </>
    )
  }

  const rightSidebarProps = {
    chat,
    codeWord: gameState.codeWord,
    isModerator,
    onLowerHand: lowerHand,
    onSend: sendMessage,
    onSetCodeWord: isModerator ? setCodeWord : undefined,
    onSetTimerDuration: setTimerDuration,
    onToggleHand: toggleHand,
    playerId,
    players,
    timerDuration: gameState.timerDuration,
  }

  return (
    <div className="relative -mx-4 h-full overflow-hidden">
      {showConfetti && <Confetti key={gameState.storyIndex} />}

      {isModerator ? (
        // Moderator: three-column layout [story sidebar] [center] [right sidebar]
        <div className="flex h-full overflow-x-auto overflow-y-hidden">
          <StorySidebar
            onAdd={addStory}
            onlineCount={onlineCount}
            onMove={moveStory}
            onRemove={removeStory}
            onSelectStory={selectStory}
            phase={gameState.phase}
            roomId={roomId}
            storyList={storyList}
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
                      background: 'var(--chip-bg)',
                      borderColor: 'var(--chip-border)',
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
            currentStory={gameState.story}
            onlineCount={onlineCount}
            roomId={roomId}
            storyList={storyList}
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

// Read-only left sidebar for participants
function ParticipantStorySidebar({
  currentStory,
  onlineCount,
  roomId,
  storyList,
}: {
  currentStory: string
  onlineCount: number
  roomId: string
  storyList: StoryItem[]
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
          <span className="font-mono text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            {roomId}
          </span>
          <button
            className="rounded p-0.5 transition-colors"
            onClick={handleCopy}
            style={{ color: copied ? 'var(--success)' : 'var(--ink-muted)' }}
            title="Copy room code"
            type="button"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--success)' }} />
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
                className="flex items-center gap-1.5 rounded-lg border px-2 py-1.5"
                key={story.id}
                style={{
                  background: isActive
                    ? 'rgba(204,136,83,0.1)'
                    : story.estimatedVote
                      ? 'rgba(204,136,83,0.06)'
                      : 'var(--surface)',
                  borderColor: isActive ? 'var(--primary)' : story.estimatedVote ? 'var(--primary)' : 'var(--border)',
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

// Left sidebar — moderator story list with drag-and-drop + play buttons
function StorySidebar({
  onAdd,
  onlineCount,
  onMove,
  onRemove,
  onSelectStory,
  phase,
  roomId,
  storyList,
}: {
  onAdd: (title: string) => void
  onlineCount: number
  onMove: (fromId: string, toId: string) => void
  onRemove: (id: string) => void
  onSelectStory: (storyId: string, title: string) => void
  phase: GamePhase
  roomId: string
  storyList: StoryItem[]
}) {
  const [input, setInput] = useState('')
  const [dragOverId, setDragOverId] = useState<null | string>(null)
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
          <span className="font-mono text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            {roomId}
          </span>
          <button
            className="rounded p-0.5 transition-colors"
            onClick={handleCopy}
            style={{ color: copied ? 'var(--success)' : 'var(--ink-muted)' }}
            title="Copy room code"
            type="button"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </button>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ink-muted)' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--success)' }} />
            {onlineCount}
          </span>
        </div>
      </div>

      <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />

      {/* Add form */}
      <p className="island-kicker shrink-0">Story List</p>
      <form className="flex shrink-0 gap-1.5" onSubmit={handleAdd}>
        <input
          className="min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add story…"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--ink)',
          }}
          type="text"
          value={input}
        />
        <button
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg disabled:opacity-40"
          disabled={!input.trim()}
          style={{ background: 'var(--primary)', color: 'white' }}
          title="Add story"
          type="submit"
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
              className="flex items-center gap-1 rounded-lg border px-2 py-1.5 transition-colors"
              draggable={!story.estimatedVote}
              key={story.id}
              onDragEnd={() => setDragOverId(null)}
              onDragLeave={() => setDragOverId(null)}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverId(story.id)
              }}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', story.id)
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDrop={(e) => {
                e.preventDefault()
                setDragOverId(null)
                const fromId = e.dataTransfer.getData('text/plain')
                if (fromId && fromId !== story.id) onMove(fromId, story.id)
              }}
              style={{
                background:
                  dragOverId === story.id
                    ? 'rgba(204,136,83,0.1)'
                    : story.estimatedVote
                      ? 'rgba(204,136,83,0.06)'
                      : 'var(--surface)',
                borderColor:
                  dragOverId === story.id ? 'var(--primary)' : story.estimatedVote ? 'var(--primary)' : 'var(--border)',
                cursor: story.estimatedVote ? 'default' : 'grab',
              }}
            >
              <span className="flex-1 truncate text-xs" style={{ color: 'var(--ink)' }} title={story.title}>
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
                      className="flex h-5 w-5 items-center justify-center rounded transition-colors hover:opacity-80"
                      onClick={() => onSelectStory(story.id, story.title)}
                      style={{ background: 'var(--primary)', color: 'white' }}
                      title="Select this story"
                      type="button"
                    >
                      <Play fill="currentColor" size={9} />
                    </button>
                  )}
                  <button
                    className="rounded p-0.5 hover:text-red-500"
                    onClick={() => onRemove(story.id)}
                    style={{ color: 'var(--ink-muted)' }}
                    type="button"
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
