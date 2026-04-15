import type { Meta, StoryObj } from '@storybook/react'
import StoryPresetPanel from '../../../components/planning-poker/StoryPresetPanel'
import type { StoryItem } from '@/hooks/usePlanningPoker'

const meta: Meta<typeof StoryPresetPanel> = {
  title: 'PlanningPoker/StoryPresetPanel',
  component: StoryPresetPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    storyList: [],
    onAdd: () => {},
    onRemove: () => {},
    onReorder: () => {},
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof StoryPresetPanel>

const sampleStories: StoryItem[] = [
  { id: '1', title: 'User login form', estimatedVote: null, discussionId: '' },
  {
    id: '2',
    title: 'Database schema design',
    estimatedVote: null,
    discussionId: '',
  },
  {
    id: '3',
    title: 'API rate limiting',
    estimatedVote: null,
    discussionId: '',
  },
  {
    id: '4',
    title: 'Email notification system',
    estimatedVote: null,
    discussionId: '',
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
    storyList: sampleStories,
    disabled: true,
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
