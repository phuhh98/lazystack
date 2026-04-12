import { cn } from '@/lib/utils/styles'
import type { AnchorHTMLAttributes, HTMLAttributeReferrerPolicy } from 'react'

const ExternalLink: React.FC<
  React.PropsWithChildren &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
      withIcon?: boolean
    }
> = ({
  target,
  href,
  rel,
  className,
  children,
  withIcon = false,
  ...props
}) => {
  return (
    <a
      href={href}
      target={target || '_blank'}
      rel={rel || 'noopener noreferrer'}
      className={cn(
        withIcon
          ? 'rounded-xl p-2 text-(--sea-ink-soft) transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)'
          : 'nav-link',
        className ?? '',
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export default ExternalLink
