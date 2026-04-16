import { Tooltip } from '@base-ui/react'
import { Crown } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { ChatMessage, GamePhase, PlayerData } from '@/hooks/usePlanningPoker'

interface PokerHandProps {
  chat: ChatMessage[]
  currentPlayerId: string
  moderatorId: string
  phase: GamePhase
  players: PlayerData[]
}

export default function PokerHand({ chat, currentPlayerId, moderatorId, phase, players }: PokerHandProps) {
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000)
    return () => clearInterval(id)
  }, [])

  if (players.length === 0) return null

  // Latest message per player within 6 seconds
  const recentMsgs = new Map<string, ChatMessage>()
  for (const msg of chat) {
    if (now - msg.ts <= 6_000) {
      const existing = recentMsgs.get(msg.playerId)
      if (!existing || msg.ts > existing.ts) {
        recentMsgs.set(msg.playerId, msg)
      }
    }
  }

  return (
    <>
      <style>{`
      @keyframes wave-hand {
        0%   { transform: rotate(-10deg); }
        50%  { transform: rotate(20deg); }
        100% { transform: rotate(-10deg); }
      }
      @keyframes float-card {
        0%, 100% { translate: 0 0; }
        50%       { translate: 0 -7px; }
      }
    `}</style>
      <div className="island-shell flex min-h-0 flex-1 flex-col rounded-xl p-3">
        <p className="island-kicker mb-3 shrink-0">Players</p>
        {/* pt-10 gives 40px clearance so speech bubbles aren't clipped by overflow-auto */}
        <div className="flex flex-wrap justify-center gap-4 overflow-auto pt-16">
          {players.map((player) => (
            <PlayerCard
              isModerator={player.id === moderatorId}
              isSelf={player.id === currentPlayerId}
              key={player.id}
              phase={phase}
              player={player}
              recentMsg={recentMsgs.get(player.id) ?? null}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// Revealed face — shows actual vote value
function CardFront({ value }: { value: null | string }) {
  const display = value ?? '?'
  return (
    <div
      className="absolute inset-0 flex items-center justify-center rounded-xl"
      style={{
        backfaceVisibility: 'hidden',
        background: 'var(--surface-strong)',
        border: '2px solid var(--primary)',
      }}
    >
      <span className="absolute top-1.5 left-2 text-sm font-bold" style={{ color: 'var(--primary)' }}>
        {display}
      </span>
      <span className="absolute right-2 bottom-1.5 rotate-180 text-sm font-bold" style={{ color: 'var(--primary)' }}>
        {display}
      </span>
      <span className="text-4xl font-bold" style={{ color: 'var(--ink)' }}>
        {display}
      </span>
    </div>
  )
}

// Unvoted face — Joker-style, visible face-up
function CardJoker() {
  return (
    <div
      className="rounded-xlf font-title absolute inset-0 flex items-center justify-center"
      style={{
        backfaceVisibility: 'hidden',
        background: 'var(--surface-strong)',
        border: '1.5px solid var(--border)',
      }}
    >
      <span className="absolute top-1.5 left-2 text-sm font-bold" style={{ color: 'var(--ink-muted)' }}>
        ?
      </span>
      <span className="absolute right-2 bottom-1.5 rotate-180 text-sm font-bold" style={{ color: 'var(--ink-muted)' }}>
        ?
      </span>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-4xl leading-none font-bold" style={{ color: 'var(--ink-muted)', opacity: 0.4 }}>
          ?
        </span>
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: 'var(--ink-muted)', opacity: 0.35 }}
        >
          vote
        </span>
      </div>
    </div>
  )
}

// Voted-but-not-revealed back — teal gradient with ✓
function CardVotedBack() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center rounded-xl"
      style={{
        backfaceVisibility: 'hidden',
        background: 'linear-gradient(135deg, var(--primary), var(--primary-deep))',
      }}
    >
      <div className="absolute inset-[6px] rounded-lg" style={{ border: '1.5px solid rgba(255,255,255,0.3)' }} />
      <span className="relative text-xl font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
        ✓
      </span>
    </div>
  )
}

function PlayerCard({
  isModerator,
  isSelf,
  phase,
  player,
  recentMsg,
}: {
  isModerator: boolean
  isSelf: boolean
  phase: GamePhase
  player: PlayerData
  recentMsg: ChatMessage | null
}) {
  const isRevealed = phase === 'revealed'
  const rotation = player.voted && !isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)'

  return (
    <Tooltip.Provider delay={300}>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <div
              className="relative flex cursor-default flex-col items-center gap-1.5"
              style={{ perspective: '600px' }}
            >
              {/* Speech bubble — floats above the card */}
              {recentMsg && <SpeechBubble text={recentMsg.text} />}

              {/* 3D flip container */}
              <div
                style={{
                  animation: player.voted && !isRevealed ? 'float-card 2.6s ease-in-out infinite' : undefined,
                  height: '192px',
                  position: 'relative',
                  transform: rotation,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s ease',
                  width: '128px',
                }}
              >
                {/* Face A — front (no rotateY here) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    inset: 0,
                    position: 'absolute',
                  }}
                >
                  {isRevealed ? <CardFront value={player.vote} /> : <CardJoker />}
                </div>

                {/* Face B — back (rotateY 180 applied at wrapper, not inside component) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    inset: 0,
                    position: 'absolute',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <CardVotedBack />
                </div>

                {/* Raised hand overlay */}
                {player.handRaised && (
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-xl"
                    style={{
                      backfaceVisibility: 'visible',
                      background: 'rgba(255,255,255,0.88)',
                      zIndex: 10,
                    }}
                  >
                    <span
                      style={{
                        animation: 'wave-hand 1s ease-in-out infinite',
                        display: 'inline-block',
                        fontSize: '3.5rem',
                        transformOrigin: '70% 70%',
                      }}
                    >
                      🤚
                    </span>
                  </div>
                )}
              </div>

              {/* Player name */}
              <div className="flex items-center gap-1">
                {isModerator && <Crown className="shrink-0" size={10} style={{ color: 'var(--primary)' }} />}
                <span
                  className="max-w-[136px] truncate text-sm font-medium"
                  style={{
                    color: isSelf ? 'var(--primary)' : 'var(--ink-muted)',
                    fontWeight: isSelf ? 700 : 500,
                  }}
                >
                  {player.name}
                  {isSelf ? ' (you)' : ''}
                </span>
              </div>

              {/* Online dot */}
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: player.isOnline ? 'var(--success)' : '#9ca3af',
                  marginTop: '-4px',
                }}
              />
            </div>
          }
        />

        <Tooltip.Portal>
          <Tooltip.Positioner>
            <Tooltip.Popup
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-lg"
              style={{ background: 'var(--ink)', zIndex: 100 }}
            >
              <Tooltip.Arrow />
              {player.name} — {player.isOnline ? 'online' : 'offline'}
              {player.voted && !isRevealed ? ' · voted' : ''}
              {isRevealed && player.vote ? ` · ${player.vote}` : ''}
              {player.handRaised ? ' · ✋ raised hand' : ''}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

function SpeechBubble({ text }: { text: string }) {
  const display = text.length > 30 ? text.slice(0, 30) + '…' : text
  return (
    <div
      style={{
        bottom: 'calc(100% + 6px)',
        left: '50%',
        pointerEvents: 'none',
        position: 'absolute',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: 'var(--primary)',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          color: 'white',
          fontSize: '10px',
          fontWeight: 600,
          maxWidth: '140px',
          overflow: 'hidden',
          padding: '4px 8px',
          position: 'relative',
          textOverflow: 'ellipsis',
        }}
      >
        {display}
        {/* Triangle tail pointing down */}
        <span
          style={{
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--primary)',
            display: 'block',
            height: 0,
            left: '50%',
            position: 'absolute',
            top: '100%',
            transform: 'translateX(-50%)',
            width: 0,
          }}
        />
      </div>
    </div>
  )
}
