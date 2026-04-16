import type { AnchorHTMLAttributes } from 'react'

import { cn } from '@/lib/utils/styles'

const ExternalLink: React.FC<
  AnchorHTMLAttributes<HTMLAnchorElement> &
    React.PropsWithChildren & {
      withIcon?: boolean
    }
> = ({ children, className, href, rel, target, withIcon = false, ...props }) => {
  return (
    <a
      className={cn(
        withIcon
          ? 'rounded-xl p-2 text-(--sea-ink-soft) transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)'
          : 'nav-link',
        className ?? '',
      )}
      href={href}
      rel={rel || 'noopener noreferrer'}
      target={target || '_blank'}
      {...props}
    >
      {children}
    </a>
  )
}

export default ExternalLink
