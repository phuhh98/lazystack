import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils/styles'

type ContainerAlign = 'center' | 'end' | 'start' | 'stretch'
type ContainerElement = 'article' | 'aside' | 'div' | 'main' | 'section'
type ContainerFlexDirection = 'col' | 'col-reverse' | 'row' | 'row-reverse'
type ContainerFlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
type ContainerGridColumns = 1 | 2 | 3 | 4 | 5 | 6
type ContainerJustify = 'around' | 'between' | 'center' | 'end' | 'evenly' | 'start'
type ContainerLayout = 'flex' | 'grid'

const ALIGN_CLASS_BY_VALUE: Record<ContainerAlign, string> = {
  center: 'items-center',
  end: 'items-end',
  start: 'items-start',
  stretch: 'items-stretch',
}

const JUSTIFY_CLASS_BY_VALUE: Record<ContainerJustify, string> = {
  around: 'justify-around',
  between: 'justify-between',
  center: 'justify-center',
  end: 'justify-end',
  evenly: 'justify-evenly',
  start: 'justify-start',
}

const FLEX_DIRECTION_CLASS_BY_VALUE: Record<ContainerFlexDirection, string> = {
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse',
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
}

const FLEX_WRAP_CLASS_BY_VALUE: Record<ContainerFlexWrap, string> = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
}

const GRID_COLUMNS_CLASS_BY_VALUE: Record<ContainerGridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
}

type ContainerProps<T extends ContainerElement = 'div'> = Omit<ComponentPropsWithoutRef<T>, 'className'> & {
  align?: ContainerAlign
  as?: T
  className?: string
  columns?: ContainerGridColumns
  direction?: ContainerFlexDirection
  disableDefaultClasses?: boolean
  justify?: ContainerJustify
  layout?: ContainerLayout
  wrap?: ContainerFlexWrap
}

function Container<T extends ContainerElement = 'div'>({
  align = 'center',
  as,
  className,
  columns = 1,
  direction = 'row',
  disableDefaultClasses = false,
  justify = 'center',
  layout = 'flex',
  wrap = 'nowrap',
  ...restProps
}: ContainerProps<T>) {
  const Component = as ?? 'div'

  return (
    <Component
      {...restProps}
      className={cn(
        !disableDefaultClasses && (layout === 'grid' ? 'grid' : 'flex'),
        !disableDefaultClasses && ALIGN_CLASS_BY_VALUE[align],
        !disableDefaultClasses && JUSTIFY_CLASS_BY_VALUE[justify],
        !disableDefaultClasses &&
          (layout === 'grid' ? GRID_COLUMNS_CLASS_BY_VALUE[columns] : FLEX_DIRECTION_CLASS_BY_VALUE[direction]),
        !disableDefaultClasses && layout === 'flex' ? FLEX_WRAP_CLASS_BY_VALUE[wrap] : undefined,
        className,
      )}
    />
  )
}

export type { ContainerProps }
export default Container
