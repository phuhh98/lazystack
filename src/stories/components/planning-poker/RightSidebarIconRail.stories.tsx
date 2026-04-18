import type { Meta, StoryObj } from '@storybook/react-vite'

import RightSidebarIconRail from '@/components/planning-poker/right-sidebar/RightSidebarIconRail'

const meta: Meta<typeof RightSidebarIconRail> = {
  args: {
    activeTab: 'chat',
    isModerator: false,
    isOpen: false,
    myHandRaised: false,
    onSelectTab: () => {},
    onToggleOpen: () => {},
    raisedCount: 0,
    timerDuration: 0,
    unread: 0,
  },
  component: RightSidebarIconRail,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/RightSidebarIconRail',
}

export default meta
type Story = StoryObj<typeof RightSidebarIconRail>

export const Collapsed: Story = {}

export const ChatActiveWithUnread: Story = {
  args: {
    activeTab: 'chat',
    isOpen: true,
    unread: 4,
  },
}

export const HandActiveWithRaised: Story = {
  args: {
    activeTab: 'hand',
    isOpen: true,
    myHandRaised: true,
    raisedCount: 3,
  },
}

export const ModeratorWithTimer: Story = {
  args: {
    activeTab: 'timer',
    isModerator: true,
    isOpen: true,
    timerDuration: 30,
    unread: 2,
  },
}
