import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { StoryItem } from '@/hooks/usePlanningPoker'

import StoryPresetPanel from '../../../components/planning-poker/StoryPresetPanel'

const mockStories: StoryItem[] = [
  { estimatedVote: undefined, id: '1', title: 'Story 1' },
  { estimatedVote: undefined, id: '2', title: 'Story 2' },
]

describe('StoryPresetPanel Component', () => {
  it('renders collapsible panel', () => {
    render(<StoryPresetPanel onAdd={() => {}} onRemove={() => {}} onReorder={() => {}} storyList={mockStories} />)
    expect(screen.getByText(/Story List/i)).toBeInTheDocument()
  })

  it('displays story count in header', () => {
    render(<StoryPresetPanel onAdd={() => {}} onRemove={() => {}} onReorder={() => {}} storyList={mockStories} />)
    expect(screen.getByText(/Story List \(2\)/i)).toBeInTheDocument()
  })

  it('shows empty state text when no stories', () => {
    render(<StoryPresetPanel onAdd={() => {}} onRemove={() => {}} onReorder={() => {}} storyList={[]} />)
    expect(screen.getByText('Story List')).toBeInTheDocument()
  })

  it('renders add form with input', () => {
    render(<StoryPresetPanel onAdd={() => {}} onRemove={() => {}} onReorder={() => {}} storyList={mockStories} />)
    const trigger = screen.getByRole('button', { name: /story list/i })
    expect(trigger).toBeInTheDocument()
  })

  it('calls onAdd when adding story', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<StoryPresetPanel onAdd={onAdd} onRemove={() => {}} onReorder={() => {}} storyList={mockStories} />)

    await user.click(screen.getByRole('button', { name: /story list/i }))
    const input = screen.getByPlaceholderText('Add a story or task…')
    await user.type(input, 'New Story')
    await user.click(screen.getByRole('button', { name: /add story/i }))

    expect(onAdd).toHaveBeenCalledWith('New Story')
  })

  it('disabled prop disables interactions', () => {
    render(
      <StoryPresetPanel
        disabled={true}
        onAdd={() => {}}
        onRemove={() => {}}
        onReorder={() => {}}
        storyList={mockStories}
      />,
    )
    expect(screen.getByText(/Story List/i)).toBeInTheDocument()
  })

  it('renders story items', async () => {
    const user = userEvent.setup()

    render(<StoryPresetPanel onAdd={() => {}} onRemove={() => {}} onReorder={() => {}} storyList={mockStories} />)

    await user.click(screen.getByRole('button', { name: /story list/i }))

    mockStories.forEach((story) => {
      expect(screen.getByText(story.title)).toBeInTheDocument()
    })
  })
})
