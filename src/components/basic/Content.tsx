import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils/styles'

type ContentElement = 'article' | 'div' | 'main' | 'section'

type ContentProps<T extends ContentElement = 'div'> = ComponentPropsWithoutRef<T> & {
  as?: T
}

function Content<T extends ContentElement = 'div'>({ as, children, className, ...restProps }: ContentProps<T>) {
  const Component = as ?? 'div'

  return (
    <Component {...restProps} className={cn('container mx-auto px-4', className)}>
      {children}
    </Component>
  )
}

export default Content
