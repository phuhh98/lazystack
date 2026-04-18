import type { ReactNode } from 'react'

import { ChevronRight, Hand, MessageSquare, Timer } from 'lucide-react'

import Button from '@/components/basic/Button'
import Container from '@/components/basic/Container'
import { cn } from '@/lib/utils/styles'

type RailIconButtonProps = Readonly<{
  ariaLabel: string
  badge?: ReactNode
  children: ReactNode
  isActive: boolean
  onClick: () => void
  title: string
}>

type RightSidebarIconRailProps = Readonly<{
  activeTab: SidebarTab
  isModerator: boolean
  isOpen: boolean
  myHandRaised: boolean
  onSelectTab: (tab: SidebarTab) => void
  onToggleOpen: () => void
  raisedCount: number
  timerDuration: number
  unread: number
}>

type SidebarTab = 'chat' | 'hand' | 'timer'

export default function RightSidebarIconRail({
  activeTab,
  isModerator,
  isOpen,
  myHandRaised,
  onSelectTab,
  onToggleOpen,
  raisedCount,
  timerDuration,
  unread,
}: RightSidebarIconRailProps) {
  function isTabActive(tab: SidebarTab) {
    return isOpen && activeTab === tab
  }

  return (
    <Container
      align="center"
      className="bg-bg-surface border-border w-10 grow gap-1 border-r pt-1"
      direction="col"
      justify="start"
    >
      <Button
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        className="text-ink-muted h-8 w-8 rounded-lg border-none bg-transparent px-0 py-0"
        onClick={onToggleOpen}
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        variant="outline"
      >
        <ChevronRight className={cn('h-4 w-4 transition-transform', isOpen ? '' : 'rotate-180')} />
      </Button>

      <Container className="bg-border h-px w-6" disableDefaultClasses />

      <RailIconButton
        ariaLabel="Open chat"
        badge={unread > 0 ? <RailCountBadge className="bg-success" count={unread} /> : null}
        isActive={isTabActive('chat')}
        onClick={() => onSelectTab('chat')}
        title="Chat"
      >
        <MessageSquare className="h-4 w-4" />
      </RailIconButton>

      <RailIconButton
        ariaLabel="Open hand panel"
        badge={raisedCount > 0 ? <RailCountBadge className="bg-primary" count={raisedCount} /> : null}
        isActive={isTabActive('hand')}
        onClick={() => onSelectTab('hand')}
        title="Raise hand"
      >
        {myHandRaised ? <span className="text-sm">🤚</span> : <Hand className="h-4 w-4" />}
      </RailIconButton>

      {isModerator ? (
        <RailIconButton
          ariaLabel="Open timer settings"
          badge={
            timerDuration > 0 ? <span className="bg-primary absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full" /> : null
          }
          isActive={isTabActive('timer')}
          onClick={() => onSelectTab('timer')}
          title="Timer settings"
        >
          <Timer className="h-4 w-4" />
        </RailIconButton>
      ) : null}
    </Container>
  )
}

function RailCountBadge({ className, count }: Readonly<{ className: string; count: number }>) {
  return (
    <span
      className={cn(
        'absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white',
        className,
      )}
    >
      {count > 9 ? '9+' : count}
    </span>
  )
}

function RailIconButton({ ariaLabel, badge, children, isActive, onClick, title }: RailIconButtonProps) {
  return (
    <Button
      aria-label={ariaLabel}
      className={cn(
        'relative h-8 w-8 rounded-lg border-none px-0 py-0',
        isActive ? 'bg-primary/15 text-primary' : 'text-ink-muted bg-transparent',
      )}
      onClick={onClick}
      title={title}
      variant="outline"
    >
      {children}
      {badge}
    </Button>
  )
}

export type { SidebarTab }
