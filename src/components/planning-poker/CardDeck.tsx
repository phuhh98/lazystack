import { cn } from '@/lib/utils/styles'

export interface CardDeckProps {
  cards: string[]
  selectedCard: string | null
  disabled: boolean
  onSelect: (card: string) => void
}

export default function CardDeck({
  cards,
  selectedCard,
  disabled,
  onSelect,
}: CardDeckProps) {
  return (
    <div className="island-shell rounded-xl p-3">
      <style>{`
        @keyframes pp-tilt {
          0%, 100% { transform: translateY(-10px) scale(1.08) rotateY(-16deg); }
          50%       { transform: translateY(-10px) scale(1.08) rotateY(16deg); }
        }
      `}</style>
      <p className="island-kicker mb-2.5">Pick your estimate</p>
      <div className="flex flex-wrap justify-center gap-2" style={{ perspective: '800px' }}>
        {cards.map((card) => {
          const isSelected = card === selectedCard
          return (
            <button
              key={card}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(card)}
              className={cn(
                'flex h-16 w-12 cursor-pointer select-none flex-col items-center justify-center rounded-xl border text-base font-bold',
                'shadow-sm',
                isSelected
                  ? 'border-[var(--primary)] bg-[rgba(204,136,83,0.12)] text-[var(--primary)] shadow-[0_0_0_2px_rgba(204,136,83,0.35),0_12px_28px_rgba(204,136,83,0.25)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] transition-all duration-150',
                !disabled && !isSelected &&
                  'hover:-translate-y-1.5 hover:shadow-md hover:border-[var(--primary-deep)]',
                disabled && 'cursor-default opacity-60 pointer-events-none',
              )}
              style={
                isSelected
                  ? {
                      transformStyle: 'preserve-3d',
                      animation: 'pp-tilt 2.6s ease-in-out infinite',
                    }
                  : undefined
              }
              aria-pressed={isSelected}
              aria-label={`Estimate ${card}`}
            >
              {card}
            </button>
          )
        })}
      </div>
    </div>
  )
}
