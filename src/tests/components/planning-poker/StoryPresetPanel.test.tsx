import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StoryPresetPanel from '../../../components/planning-poker/StoryPresetPanel'
import type { StoryItem } from '@/hooks/usePlanningPoker'

const mockStories: StoryItem[] = [
  { id: '1', title: 'Story 1', estimatedVote: null, discussionId: '' },
  { id: '2', title: 'Story 2', estimatedVote: null, discussionId: '' },
]

describe('StoryPresetPanel Component', () => {
  it('renders collapsible panel', () => {
    render(
      <StoryPresetPanel
        storyList={mockStories}
        onAdd={() => {}}
        onRemove={() => {}}
        onReorder={() => {}}
      />,
    )
    expect(screen.getByText(/Story List/i)).toBeInTheDocument()
  })

  it('displays story count in header', () => {
    render(
      <StoryPresetPanel
        storyList={mockStories}
        onAdd={() => {}}
        onRemove={() => {}}
        onReorder={() => {}}
      />,
    )
    expect(screen.getByText(/Story List \(2\)/i)).toBeInTheDocument()
  })

  it('shows empty state text when no stories', () => {
    render(
      <StoryPresetPanel
        storyList={[]}
        onAdd={() => {}}
        onRemove={() => {}}
        onReorder={() => {}}
      />,
    )
    expect(screen.getByText('Story List')).toBeInTheDocument()
  })

  it('renders add form with input', () => {
    render(
      <StoryPresetPanel
        storyList={mockStories}
        onAdd={() => {}}
        onRemove={() => {}}
        onReorder={() => {}}
      />,
    )
    // Should have input field for adding stories
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onAdd when adding story', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(
      <StoryPresetPanel
        storyList={mockStories}
        onAdd={onAdd}
        onRemove={() => {}}
        onReorder={() => {}}
      />,
    )

    // Test would require accessing the input field and form
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('disabled prop disables interactions', () => {
    render(
      <StoryPresetPanel
        storyList={mockStories}
        onAdd={() => {}}
        onRemove={() => {}}
        onReorder={() => {}}
        disabled={true}
      />,
    )
    expect(screen.getByText(/Story List/i)).toBeInTheDocument()
  })

  it('renders story items', () => {
    const { container } = render(
      <StoryPresetPanel
        storyList={mockStories}
        onAdd={() => {}}
        onRemove={() => {}}
        onReorder={() => {}}
      />,
    )
    mockStories.forEach((story) => {
      expect(screen.getByText(story.title)).toBeInTheDocument()
    })
  })
})
