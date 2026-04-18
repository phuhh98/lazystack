import type { GamePhase } from '@/hooks/usePlanningPoker'

import IslandShell from '@/components/basic/IslandShell'
import { cn } from '@/lib/utils/styles'

export interface PlayerInfo {
  id: string
  isOnline: boolean
  name: string
  vote: null | string
  voted: boolean
}

export interface PlayerListProps {
  currentPlayerId: string
  phase: GamePhase
  players: PlayerInfo[]
}

export default function PlayerList({ currentPlayerId, phase, players }: PlayerListProps) {
  return (
    <IslandShell as="aside" className="rounded-2xl p-4">
      <p className="island-kicker mb-3">
        Players ({players.filter((p) => p.isOnline).length}/{players.length})
      </p>
      <ul className="flex flex-col gap-1.5">
        {players.map((player) => (
          <li
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors',
              player.id === currentPlayerId && 'bg-[var(--sand)]',
            )}
            key={player.id}
          >
            {/* Avatar */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
              {player.name.charAt(0).toUpperCase()}
            </div>

            {/* Name + online indicator */}
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <span className="truncate text-sm font-medium text-[var(--ink)]">
                {player.name}
                {player.id === currentPlayerId && <span className="ml-1 text-xs text-[var(--ink-muted)]">(you)</span>}
              </span>
              <span
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  player.isOnline ? 'bg-[var(--success)]' : 'bg-[var(--border)]',
                )}
                title={player.isOnline ? 'Online' : 'Offline'}
              />
            </div>

            {/* Card slot */}
            <CardSlot phase={phase} vote={player.vote} voted={player.voted} />
          </li>
        ))}

        {players.length === 0 && (
          <li className="py-4 text-center text-sm text-[var(--ink-muted)]">Waiting for players…</li>
        )}
      </ul>
    </IslandShell>
  )
}

function CardSlot({ phase, vote, voted }: { phase: GamePhase; vote: null | string; voted: boolean }) {
  if (phase === 'revealed') {
    return (
      <div
        className={cn(
          'flex h-9 w-7 items-center justify-center rounded border text-sm font-bold transition-transform duration-500',
          vote
            ? 'border-[var(--primary)] bg-[rgba(79,184,178,0.12)] text-[var(--primary)]'
            : 'border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--ink-muted)]',
        )}
        style={{ transform: 'rotateY(0deg)' }}
      >
        {vote ?? '—'}
      </div>
    )
  }

  if (voted) {
    return (
      <div className="flex h-9 w-7 items-center justify-center rounded border border-[var(--primary)] bg-[rgba(79,184,178,0.12)]">
        <span className="text-sm text-[var(--primary)]">✓</span>
      </div>
    )
  }

  return (
    <div className="flex h-9 w-7 items-center justify-center rounded border border-[var(--border)] bg-[var(--sand)] opacity-60">
      <span className="text-xs text-[var(--ink-muted)]">…</span>
    </div>
  )
}
