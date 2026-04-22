import type { ReactNode } from 'react'

import { Popover } from '@base-ui/react'

import { DEFAULT_PLANNING_POKER_CARDS } from '@/lib/constants/planningPoker'
import { cn } from '@/lib/utils/styles'

interface SetCardValuePopoverProps {
  readonly cardValues?: readonly string[]
  readonly children: ReactNode
  readonly currentValue: null | string
  readonly onSelectValue: (value: string) => void
  readonly popupClassName?: string
  readonly title?: string
  readonly triggerAriaLabel: string
  readonly triggerClassName?: string
  readonly triggerTitle?: string
}

export default function SetCardValuePopover({
  cardValues = DEFAULT_PLANNING_POKER_CARDS.filter((v) => !Number.isNaN(Number(v))), // Default to Fibonacci cards only
  children,
  currentValue,
  onSelectValue,
  popupClassName,
  title = 'Set estimate',
  triggerAriaLabel,
  triggerClassName,
  triggerTitle,
}: SetCardValuePopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={triggerAriaLabel}
        className={cn(
          'text-ink-muted hover:text-ink focus-visible:ring-primary cursor-pointer rounded-lg p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed',
          triggerClassName,
        )}
        title={triggerTitle ?? triggerAriaLabel}
      >
        {children}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup
            className={cn(
              'bg-bg-surface-strong border-border z-200 m-2 rounded-2xl border p-4 shadow-xl',
              popupClassName,
            )}
          >
            <Popover.Arrow className="fill-surface-strong" />
            <p className="text-ink-muted mb-3 text-[10px] font-semibold tracking-wide uppercase">{title}</p>
            <div className="flex flex-wrap gap-2">
              {cardValues.map((value) => {
                const isSelected = currentValue === value

                return (
                  <Popover.Close
                    aria-label={`Set estimate to ${value}`}
                    className={cn(
                      'text-ink bg-bg-surface border-border/50 hover:border-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-sm font-bold transition-colors disabled:cursor-not-allowed',
                      isSelected && 'bg-primary border-primary hover:border-primary text-white',
                    )}
                    key={value}
                    onClick={() => onSelectValue(value)}
                    type="button"
                  >
                    {value}
                  </Popover.Close>
                )
              })}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
