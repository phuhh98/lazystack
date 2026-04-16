import type { Meta, StoryObj } from '@storybook/react-vite'

import type { StoryItem } from '@/hooks/usePlanningPoker'

import SessionDashboard from '../../../components/planning-poker/SessionDashboard'

const meta: Meta<typeof SessionDashboard> = {
  args: {
    isModerator: false,
    onSetEstimate: () => {},
    storyList: [],
  },
  component: SessionDashboard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/SessionDashboard',
}

export default meta
type Story = StoryObj<typeof SessionDashboard>

const completeStories: StoryItem[] = [
  {
    discussionId: 'disc-1',
    estimatedVote: '5',
    id: '1',
    title: 'User authentication',
  },
  {
    discussionId: 'disc-2',
    estimatedVote: '8',
    id: '2',
    title: 'Database migration',
  },
  {
    discussionId: 'disc-3',
    estimatedVote: '5',
    id: '3',
    title: 'API endpoint',
  },
  {
    discussionId: 'disc-4',
    estimatedVote: '3',
    id: '4',
    title: 'Button styling',
  },
  {
    discussionId: 'disc-5',
    estimatedVote: '13',
    id: '5',
    title: 'Performance optimization',
  },
]

const mixedStories: StoryItem[] = [
  {
    discussionId: 'disc-1',
    estimatedVote: '5',
    id: '1',
    title: 'User authentication',
  },
  {
    discussionId: 'disc-2',
    estimatedVote: null,
    id: '2',
    title: 'Database migration',
  },
  {
    discussionId: 'disc-3',
    estimatedVote: '8',
    id: '3',
    title: 'API endpoint',
  },
]

/**
 * Session dashboard showing completed estimations
 */
export const Completed: Story = {
  args: {
    isModerator: false,
    storyList: completeStories,
  },
}

/**
 * Session dashboard with some incomplete stories
 */
export const Incomplete: Story = {
  args: {
    isModerator: false,
    storyList: mixedStories,
  },
}

/**
 * Session dashboard as moderator
 */
export const AsModerator: Story = {
  args: {
    isModerator: true,
    storyList: completeStories,
  },
}

/**
 * Empty session dashboard
 */
export const Empty: Story = {
  args: {
    isModerator: false,
    storyList: [],
  },
}
