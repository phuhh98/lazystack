import Button from '@/components/basic/Button'
import Typography from '@/components/basic/Typography'

const TIMER_PRESETS = [0, 15, 30, 60] as const

type RightSidebarTimerTabProps = Readonly<{
  onSetTimerDuration: (seconds: number) => void
  timerDuration: number
}>

export default function RightSidebarTimerTab({ onSetTimerDuration, timerDuration }: RightSidebarTimerTabProps) {
  return (
    <div className="flex flex-1 flex-col gap-3 px-3 py-3">
      <Typography as="p" className="text-ink-muted text-xs leading-none font-semibold">
        Vote timer
      </Typography>

      <div className="flex flex-wrap gap-2">
        {TIMER_PRESETS.map((seconds) => {
          const isActive = timerDuration === seconds

          return (
            <Button
              className={
                isActive
                  ? 'border-primary bg-primary rounded-xl border px-3 py-1.5 text-xs font-semibold text-white'
                  : 'bg-bg-surface text-ink border-border rounded-xl border px-3 py-1.5 text-xs font-semibold'
              }
              key={seconds}
              onClick={() => onSetTimerDuration(seconds)}
              variant="outline"
            >
              {seconds === 0 ? 'Off' : `${seconds}s`}
            </Button>
          )
        })}
      </div>

      <Typography as="p" className="text-ink-muted text-[10px]">
        Set duration. Start timer manually during voting.
      </Typography>
    </div>
  )
}
