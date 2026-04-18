import Container from '@/components/basic/Container'
import { cn } from '@/lib/utils/styles'

interface CountdownClockProps {
  readonly remaining: number
  readonly total: number
}

export default function CountdownClock({ remaining, total }: CountdownClockProps) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const progressFraction = total > 0 ? remaining / total : 0
  const dashLength = progressFraction * circumference
  const isUrgent = remaining <= 5

  return (
    <Container as="div" className="shrink-0" disableDefaultClasses>
      <svg height="40" viewBox="0 0 40 40" width="40">
        <circle className="stroke-border" cx="20" cy="20" fill="none" r={radius} strokeWidth="3" />
        <circle
          className={cn(
            'linear transition-[stroke-dasharray] duration-1000',
            isUrgent ? 'stroke-success' : 'stroke-primary',
          )}
          cx="20"
          cy="20"
          fill="none"
          r={radius}
          strokeDasharray={`${dashLength} ${circumference - dashLength}`}
          strokeLinecap="round"
          strokeWidth="3"
          transform="rotate(-90 20 20)"
        />
        <text
          className={isUrgent ? 'fill-success' : 'fill-ink'}
          fontSize="11"
          fontWeight="700"
          textAnchor="middle"
          x="20"
          y="24"
        >
          {remaining}
        </text>
      </svg>
    </Container>
  )
}
