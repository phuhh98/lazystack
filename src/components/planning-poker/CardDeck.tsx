import { cn } from '@/lib/utils/styles'

export interface CardDeckProps {
  cards: string[]
  disabled: boolean
  onSelect: (card: string) => void
  selectedCard: null | string
}

export default function CardDeck({ cards, disabled, onSelect, selectedCard }: CardDeckProps) {
  return (
    <div className="island-shell rounded-xl p-3">
      <style>{`
        @keyframes pp-tilt {
          0%, 100% { transform: translateY(-10px) scale(1.08) rotateY(-16deg); }
          50%       { transform: translateY(-10px) scale(1.08) rotateY(16deg); }
        }
      `}</style>
      <p className="island-kicker font-title mb-2.5">Pick your estimate</p>
      <div className="flex flex-wrap justify-center gap-2" style={{ perspective: '800px' }}>
        {cards.map((card) => {
          const isSelected = card === selectedCard
          return (
            <button
              aria-label={`Estimate ${card}`}
              aria-pressed={isSelected}
              className={cn(
                'flex h-16 w-12 cursor-pointer flex-col items-center justify-center rounded-xl border text-base font-bold select-none',
                'shadow-sm',
                isSelected
                  ? 'border-[var(--primary)] bg-[rgba(204,136,83,0.12)] text-[var(--primary)] shadow-[0_0_0_2px_rgba(204,136,83,0.35),0_12px_28px_rgba(204,136,83,0.25)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] transition-all duration-150',
                !disabled && !isSelected && 'hover:-translate-y-1.5 hover:border-[var(--primary-deep)] hover:shadow-md',
                disabled && 'pointer-events-none cursor-default opacity-60',
              )}
              disabled={disabled}
              key={card}
              onClick={() => !disabled && onSelect(card)}
              style={
                isSelected
                  ? {
                      animation: 'pp-tilt 2.6s ease-in-out infinite',
                      transformStyle: 'preserve-3d',
                    }
                  : undefined
              }
              type="button"
            >
              {card}
            </button>
          )
        })}
      </div>
    </div>
  )
}
