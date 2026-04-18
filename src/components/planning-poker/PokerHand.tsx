import { Tooltip } from '@base-ui/react'
import { Crown } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { ChatMessage, GamePhase, PlayerData } from '@/hooks/usePlanningPoker'

import IslandShell from '@/components/basic/IslandShell'
import { cn } from '@/lib/utils/styles'

type CardFaceProps = Readonly<{
  value: null | string
}>

type PlayerCardProps = Readonly<{
  isModerator: boolean
  isSelf: boolean
  phase: GamePhase
  player: PlayerData
  recentMsg: ChatMessage | null
}>

type PokerHandProps = Readonly<{
  chat: ChatMessage[]
  currentPlayerId: string
  moderatorId: string
  phase: GamePhase
  players: PlayerData[]
}>

type SpeechBubbleProps = Readonly<{
  text: string
}>

const RECENT_MESSAGE_WINDOW_MS = 6_000
const SPEECH_BUBBLE_PREVIEW_MAX = 30

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
    if (now - msg.ts <= RECENT_MESSAGE_WINDOW_MS) {
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
      <IslandShell className="flex min-h-0 flex-1 flex-col rounded-xl p-3">
        <p className="island-kicker mb-3 shrink-0">Players</p>
        {/* pt-10 gives 40px clearance so speech bubbles aren't clipped by overflow-auto */}
        <Tooltip.Provider delay={300}>
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
        </Tooltip.Provider>
      </IslandShell>
    </>
  )
}

// Revealed face — shows actual vote value
function CardFront({ value }: CardFaceProps) {
  const display = value ?? '?'
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center rounded-xl backface-hidden',
        'bg-bg-surface-strong border-primary border-2',
      )}
    >
      <span className={cn('absolute top-1.5 left-2 text-sm font-bold', 'text-primary')}>{display}</span>
      <span className={cn('absolute right-2 bottom-1.5 rotate-180 text-sm font-bold', 'text-primary')}>{display}</span>
      <span className={cn('text-4xl font-bold', 'text-ink')}>{display}</span>
    </div>
  )
}

// Unvoted face — Joker-style, visible face-up
function CardJoker() {
  return (
    <div
      className={cn(
        'font-title absolute inset-0 flex items-center justify-center rounded-xl border backface-hidden',
        'bg-bg-surface-strong border-border',
      )}
    >
      <span className={cn('absolute top-1.5 left-2 text-sm font-bold', 'text-ink-muted')}>?</span>
      <span className={cn('absolute right-2 bottom-1.5 rotate-180 text-sm font-bold', 'text-ink-muted')}>?</span>
      <div className="flex flex-col items-center gap-0.5">
        <span className={cn('text-4xl leading-none font-bold', 'text-ink-muted/40')}>?</span>
        <span className={cn('text-xs font-semibold tracking-widest uppercase', 'text-ink-muted/35')}>vote</span>
      </div>
    </div>
  )
}

// Voted-but-not-revealed back — teal gradient with ✓
function CardVotedBack() {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center rounded-xl bg-linear-to-br backface-hidden',
        'from-amber-earth-400 to-amber-earth-600',
      )}
    >
      <div className="absolute inset-1.5 rounded-lg border border-white/30" />
      <span className="relative text-xl font-bold text-white/90">✓</span>
    </div>
  )
}

function PlayerCard({ isModerator, isSelf, phase, player, recentMsg }: PlayerCardProps) {
  const isRevealed = phase === 'revealed'
  const hasHiddenVote = player.voted && !isRevealed

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={
          <div className={cn('relative flex cursor-default flex-col items-center gap-1.5', 'perspective-[600px]')}>
            {/* Speech bubble — floats above the card */}
            {recentMsg ? <SpeechBubble text={recentMsg.text} /> : null}

            {/* 3D flip container */}
            <div
              className={cn(
                'relative h-48 w-32 transition-transform duration-600 ease-in-out transform-3d',
                hasHiddenVote
                  ? 'transform-[rotateY(180deg)] animate-[float-card_2.6s_ease-in-out_infinite]'
                  : 'transform-[rotateY(0deg)]',
              )}
            >
              {/* Face A — front (no rotateY here) */}
              <div className="absolute inset-0 backface-hidden">
                {isRevealed ? <CardFront value={player.vote} /> : <CardJoker />}
              </div>

              {/* Face B — back (rotateY 180 applied at wrapper, not inside component) */}
              <div className={cn('absolute inset-0 backface-hidden', 'transform-[rotateY(180deg)]')}>
                <CardVotedBack />
              </div>

              {/* Raised hand overlay */}
              {player.handRaised ? (
                <div
                  className={cn(
                    'absolute inset-0 z-10 flex items-center justify-center rounded-xl backface-visible',
                    'bg-white/85 dark:bg-black/55',
                  )}
                >
                  <span
                    className="inline-block text-[3.5rem]"
                    style={{
                      animation: 'wave-hand 1s ease-in-out infinite',
                      transformOrigin: '70% 70%',
                    }}
                  >
                    🤚
                  </span>
                </div>
              ) : null}
            </div>

            {/* Player name */}
            <div className="flex items-center gap-1">
              {isModerator ? <Crown className="text-primary shrink-0" size={10} /> : null}
              <span
                className={cn(
                  'max-w-34 truncate text-sm',
                  isSelf ? 'text-primary font-bold' : 'text-ink-muted font-medium',
                )}
              >
                {player.name}
                {isSelf ? ' (you)' : ''}
              </span>
            </div>

            {/* Online dot */}
            <span className={cn('-mt-1 h-1.5 w-1.5 rounded-full', player.isOnline ? 'bg-success' : 'bg-gray-400')} />
          </div>
        }
      />

      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup
            className={cn('z-100 rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-lg', 'bg-ink')}
          >
            <Tooltip.Arrow />
            {player.name} — {player.isOnline ? 'online' : 'offline'}
            {hasHiddenVote ? ' · voted' : ''}
            {isRevealed && player.vote ? ` · ${player.vote}` : ''}
            {player.handRaised ? ' · ✋ raised hand' : ''}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

function SpeechBubble({ text }: SpeechBubbleProps) {
  const display = text.length > SPEECH_BUBBLE_PREVIEW_MAX ? `${text.slice(0, SPEECH_BUBBLE_PREVIEW_MAX)}…` : text
  return (
    <div
      className={cn(
        'pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-50 -translate-x-1/2',
        'whitespace-nowrap',
      )}
    >
      <div
        className={cn(
          'relative max-w-35 overflow-hidden rounded-[10px] px-2 py-1 text-[10px] font-semibold text-ellipsis text-white',
          'bg-primary shadow-[0_2px_8px_rgba(0,0,0,0.15)]',
        )}
      >
        {display}
        {/* Triangle tail pointing down */}
        <span
          className={cn(
            'absolute top-full left-1/2 block h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px]',
            'border-t-primary border-x-transparent',
          )}
        />
      </div>
    </div>
  )
}
