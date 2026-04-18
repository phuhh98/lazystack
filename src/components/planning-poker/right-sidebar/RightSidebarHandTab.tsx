import type { PlayerData } from '@/hooks/usePlanningPoker'

import Button from '@/components/basic/Button'
import Typography from '@/components/basic/Typography'

type RightSidebarHandTabProps = Readonly<{
  isModerator: boolean
  myHandRaised: boolean
  onLowerHand: (id: string) => void
  onToggleHand: () => void
  raisedPlayers: PlayerData[]
}>

export default function RightSidebarHandTab({
  isModerator,
  myHandRaised,
  onLowerHand,
  onToggleHand,
  raisedPlayers,
}: RightSidebarHandTabProps) {
  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
      <div>
        <Typography as="p" className="text-ink-muted mb-2 text-xs leading-none font-semibold">
          Your hand
        </Typography>
        <Button
          className={
            myHandRaised
              ? 'border-primary bg-primary/10 text-primary w-full justify-center gap-2 rounded-xl border py-2 text-sm font-semibold'
              : 'bg-bg-surface text-ink border-border w-full justify-center gap-2 rounded-xl border py-2 text-sm font-semibold'
          }
          onClick={onToggleHand}
          variant="outline"
        >
          <span className="text-[1.2rem]">{myHandRaised ? '🤚' : '✋'}</span>
          {myHandRaised ? 'Lower hand' : 'Raise hand'}
        </Button>
        {myHandRaised ? null : (
          <Typography as="p" className="text-ink-muted mt-1.5 text-center text-[10px]">
            Raise to ask a question
          </Typography>
        )}
      </div>

      {isModerator ? (
        <div>
          <Typography as="p" className="text-ink-muted mb-2 text-xs leading-none font-semibold">
            Raised hands {raisedPlayers.length > 0 ? `(${raisedPlayers.length})` : ''}
          </Typography>
          {raisedPlayers.length === 0 ? (
            <Typography as="p" className="text-ink-muted text-xs">
              No hands raised.
            </Typography>
          ) : (
            <ul className="flex flex-col gap-1">
              {raisedPlayers.map((player) => (
                <li
                  className="bg-bg-surface border-border flex items-center justify-between rounded-lg border px-2.5 py-1.5"
                  key={player.id}
                >
                  <Typography as="span" className="text-ink flex items-center gap-1.5 text-xs leading-none font-medium">
                    <span>🤚</span>
                    {player.name}
                  </Typography>
                  <Button
                    className="rounded-lg px-2 py-0.5 text-[10px] font-semibold text-white"
                    onClick={() => onLowerHand(player.id)}
                  >
                    Lower
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
