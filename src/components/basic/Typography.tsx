import type { ComponentPropsWithoutRef, ElementType, ReactElement, ReactNode, Ref } from 'react'

import { createElement, forwardRef } from 'react'

import { cn } from '@/lib/utils/styles'

const DEFAULT_TYPOGRAPHY_CLASS_BY_TAG = {
  abbr: 'font-content text-base leading-7 text-ink underline decoration-dotted underline-offset-2',
  cite: 'font-content text-base leading-7 text-ink italic',
  code: 'font-code text-sm text-ink',
  em: 'font-content text-base leading-7 text-ink italic',
  h1: 'font-title text-4xl font-bold tracking-tight text-ink',
  h2: 'font-heading text-3xl font-bold tracking-tight text-ink',
  h3: 'font-heading text-2xl font-semibold tracking-tight text-ink',
  h4: 'font-heading text-xl font-semibold tracking-tight text-ink',
  label: 'font-content text-sm font-semibold leading-6 text-ink',
  mark: 'font-content text-base leading-7 text-ink bg-banana-cream-300 px-1 rounded-sm',
  p: 'font-content text-base leading-7 text-ink',
  small: 'font-content text-sm leading-6 text-ink-muted',
  span: 'font-content text-base leading-7 text-ink',
  strong: 'font-content text-base leading-7 text-ink font-semibold',
} as const

type TypographyComponent = <T extends ElementType = 'p'>(
  props: TypographyProps<T> & { ref?: Ref<HTMLElement> },
) => null | ReactElement

type TypographyProps<T extends ElementType = 'p'> = Omit<
  ComponentPropsWithoutRef<T>,
  'as' | 'children' | 'className'
> & {
  as?: T
  children?: ReactNode
  className?: string
}

type TypographyTag = keyof typeof DEFAULT_TYPOGRAPHY_CLASS_BY_TAG

function isTypographyTag(value: string): value is TypographyTag {
  return value in DEFAULT_TYPOGRAPHY_CLASS_BY_TAG
}

const Typography = forwardRef<HTMLElement, TypographyProps<ElementType>>(function Typography(
  { as, children, className, ...restProps },
  ref,
) {
  const Component = as ?? 'p'
  const renderedTag: TypographyTag = typeof as === 'string' && isTypographyTag(as) ? as : 'p'
  const defaultClassName = DEFAULT_TYPOGRAPHY_CLASS_BY_TAG[renderedTag]

  if (typeof Component === 'string') {
    return createElement(
      Component,
      {
        ...restProps,
        className: cn(defaultClassName, className),
        ref: ref as Ref<HTMLElement>,
      },
      children,
    )
  }

  return createElement(
    Component,
    {
      ...restProps,
      className: cn(defaultClassName, className),
    },
    children,
  )
}) as TypographyComponent

export default Typography
