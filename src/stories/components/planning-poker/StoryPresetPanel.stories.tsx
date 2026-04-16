import type { Meta, StoryObj } from '@storybook/react-vite'

import type { StoryItem } from '@/hooks/usePlanningPoker'

import StoryPresetPanel from '../../../components/planning-poker/StoryPresetPanel'

const meta: Meta<typeof StoryPresetPanel> = {
  args: {
    disabled: false,
    onAdd: () => {},
    onRemove: () => {},
    onReorder: () => {},
    storyList: [],
  },
  component: StoryPresetPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/StoryPresetPanel',
}

export default meta
type Story = StoryObj<typeof StoryPresetPanel>

const sampleStories: StoryItem[] = [
  { discussionId: '', estimatedVote: null, id: '1', title: 'User login form' },
  {
    discussionId: '',
    estimatedVote: null,
    id: '2',
    title: 'Database schema design',
  },
  {
    discussionId: '',
    estimatedVote: null,
    id: '3',
    title: 'API rate limiting',
  },
  {
    discussionId: '',
    estimatedVote: null,
    id: '4',
    title: 'Email notification system',
  },
]

/**
 * Empty story preset panel
 */
export const Empty: Story = {
  args: { storyList: [] },
}

/**
 * Story preset panel with items
 */
export const WithStories: Story = {
  args: { storyList: sampleStories },
}

/**
 * Story preset panel disabled state
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    storyList: sampleStories,
  },
}

/**
 * Story preset panel with single story
 */
export const SingleStory: Story = {
  args: {
    storyList: [sampleStories[0]],
  },
}
