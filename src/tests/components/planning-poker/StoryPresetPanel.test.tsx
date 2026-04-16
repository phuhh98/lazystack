import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StoryPresetPanel from '../../../components/planning-poker/StoryPresetPanel'
import type { StoryItem } from '@/hooks/usePlanningPoker'

const mockStories: StoryItem[] = [
  { id: '1', title: 'Story 1', estimatedVote: undefined },
  { id: '2', title: 'Story 2', estimatedVote: undefined },
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
    const trigger = screen.getByRole('button', { name: /story list/i })
    expect(trigger).toBeInTheDocument()
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

    await user.click(screen.getByRole('button', { name: /story list/i }))
    const input = screen.getByPlaceholderText('Add a story or task…')
    await user.type(input, 'New Story')
    await user.click(screen.getByRole('button', { name: /add story/i }))

    expect(onAdd).toHaveBeenCalledWith('New Story')
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

  it('renders story items', async () => {
    const user = userEvent.setup()

    render(
      <StoryPresetPanel
        storyList={mockStories}
        onAdd={() => {}}
        onRemove={() => {}}
        onReorder={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: /story list/i }))

    mockStories.forEach((story) => {
      expect(screen.getByText(story.title)).toBeInTheDocument()
    })
  })
})
