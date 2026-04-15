import type { Meta, StoryObj } from '@storybook/react'
import SessionDashboard from '../../../components/planning-poker/SessionDashboard'
import type { StoryItem } from '@/hooks/usePlanningPoker'

const meta: Meta<typeof SessionDashboard> = {
  title: 'PlanningPoker/SessionDashboard',
  component: SessionDashboard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    storyList: [],
    isModerator: false,
    onSetEstimate: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SessionDashboard>

const completeStories: StoryItem[] = [
  {
    id: '1',
    title: 'User authentication',
    estimatedVote: '5',
    discussionId: 'disc-1',
  },
  {
    id: '2',
    title: 'Database migration',
    estimatedVote: '8',
    discussionId: 'disc-2',
  },
  {
    id: '3',
    title: 'API endpoint',
    estimatedVote: '5',
    discussionId: 'disc-3',
  },
  {
    id: '4',
    title: 'Button styling',
    estimatedVote: '3',
    discussionId: 'disc-4',
  },
  {
    id: '5',
    title: 'Performance optimization',
    estimatedVote: '13',
    discussionId: 'disc-5',
  },
]

const mixedStories: StoryItem[] = [
  {
    id: '1',
    title: 'User authentication',
    estimatedVote: '5',
    discussionId: 'disc-1',
  },
  {
    id: '2',
    title: 'Database migration',
    estimatedVote: null,
    discussionId: 'disc-2',
  },
  {
    id: '3',
    title: 'API endpoint',
    estimatedVote: '8',
    discussionId: 'disc-3',
  },
]

/**
 * Session dashboard showing completed estimations
 */
export const Completed: Story = {
  args: {
    storyList: completeStories,
    isModerator: false,
  },
}

/**
 * Session dashboard with some incomplete stories
 */
export const Incomplete: Story = {
  args: {
    storyList: mixedStories,
    isModerator: false,
  },
}

/**
 * Session dashboard as moderator
 */
export const AsModerator: Story = {
  args: {
    storyList: completeStories,
    isModerator: true,
  },
}

/**
 * Empty session dashboard
 */
export const Empty: Story = {
  args: {
    storyList: [],
    isModerator: false,
  },
}
