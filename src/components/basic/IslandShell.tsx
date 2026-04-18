import type { ReactElement, Ref } from 'react'

import { forwardRef } from 'react'

import type { ContainerProps } from '@/components/basic/Container'

import Container from '@/components/basic/Container'
import { cn } from '@/lib/utils/styles'

const ISLAND_SHELL_CLASSNAME =
  'rounded-4xl border border-(--border) bg-[linear-gradient(165deg,var(--surface-strong),var(--surface))] shadow-[inset_0_1px_0_var(--inset-glint),0_22px_44px_rgba(121,54,20,0.09),0_6px_18px_rgba(18,40,65,0.07)] backdrop-blur-xs transition-[background-color,color,border-color,transform] duration-180 ease-in-out'

type IslandShellComponent = <T extends IslandShellElement = 'div'>(
  props: IslandShellProps<T> & { ref?: Ref<IslandShellRef<T>> },
) => null | ReactElement

type IslandShellElement = 'article' | 'aside' | 'div' | 'main' | 'section'

type IslandShellElementRefByTag = {
  article: HTMLElement
  aside: HTMLElement
  div: HTMLDivElement
  main: HTMLElement
  section: HTMLElement
}

type IslandShellProps<T extends 'article' | 'aside' | 'div' | 'main' | 'section' = 'div'> = Omit<
  ContainerProps<T>,
  'disableDefaultClasses'
>

type IslandShellRef<T extends IslandShellElement = 'div'> = IslandShellElementRefByTag[T]

const IslandShell = forwardRef<HTMLElement, IslandShellProps<IslandShellElement>>(function IslandShell(props, ref) {
  const { className, ...restProps } = props

  return (
    <Container
      {...restProps}
      className={cn(ISLAND_SHELL_CLASSNAME, className)}
      disableDefaultClasses
      ref={ref as Ref<HTMLDivElement>}
    />
  )
}) as IslandShellComponent

export { ISLAND_SHELL_CLASSNAME }
export default IslandShell
