import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/utils/styles'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean
  variant?: ButtonVariant
}

type ButtonVariant = 'outline' | 'primary'

function Button({
  className,
  disabled,
  fullWidth = false,
  type = 'button',
  variant = 'primary',
  ...restProps
}: ButtonProps) {
  return (
    <button
      {...restProps}
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
        'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        fullWidth && 'w-full',
        variant === 'primary' && 'bg-primary hover:bg-primary-deep text-white',
        variant === 'outline' &&
          'border-border bg-bg-surface text-ink-muted hover:border-primary-deep hover:text-ink border',
        className,
      )}
      disabled={disabled}
      type={type}
    />
  )
}

export type { ButtonProps }
export default Button
