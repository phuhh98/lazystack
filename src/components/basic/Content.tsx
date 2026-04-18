import type { ComponentPropsWithoutRef, ReactElement, Ref } from 'react'

import { forwardRef } from 'react'

import { cn } from '@/lib/utils/styles'

type ContentComponent = <T extends ContentElement = 'div'>(
  props: ContentProps<T> & { ref?: Ref<ContentRef<T>> },
) => null | ReactElement

type ContentElement = 'article' | 'div' | 'main' | 'section'

type ContentElementRefByTag = {
  article: HTMLElement
  div: HTMLDivElement
  main: HTMLElement
  section: HTMLElement
}

type ContentProps<T extends ContentElement = 'div'> = ComponentPropsWithoutRef<T> & {
  as?: T
}

type ContentRef<T extends ContentElement = 'div'> = ContentElementRefByTag[T]

const Content = forwardRef<HTMLElement, ContentProps<ContentElement>>(function Content(
  { as, children, className, ...restProps },
  ref,
) {
  const Component = as ?? 'div'

  return (
    <Component {...restProps} className={cn('container mx-auto px-4', className)} ref={ref as Ref<HTMLDivElement>}>
      {children}
    </Component>
  )
}) as ContentComponent

export default Content
