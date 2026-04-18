import type { AnchorHTMLAttributes, ReactNode } from 'react'

import { forwardRef } from 'react'

import { cn } from '@/lib/utils/styles'

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  readonly children?: ReactNode
  readonly withIcon?: boolean
}

const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(function ExternalLink(
  { children, className, href, rel, target, withIcon = false, ...props },
  ref,
) {
  return (
    <a
      className={cn(
        withIcon
          ? 'rounded-xl p-2 text-(--sea-ink-soft) transition hover:bg-(--link-bg-hover) hover:text-(--sea-ink)'
          : 'nav-link',
        className ?? '',
      )}
      href={href}
      ref={ref}
      rel={rel || 'noopener noreferrer'}
      target={target || '_blank'}
      {...props}
    >
      {children}
    </a>
  )
})

export default ExternalLink
