import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { StoryItem } from '@/hooks/usePlanningPoker'

import SessionDashboard from '@/components/planning-poker/SessionDashboard'

const mockStories: StoryItem[] = [
  { estimatedVote: '5', id: '1', title: 'Feature 1' },
  { estimatedVote: '8', id: '2', title: 'Feature 2' },
  { estimatedVote: '3', id: '3', title: 'Feature 3' },
]

describe('SessionDashboard Component', () => {
  it('renders dashboard heading', () => {
    render(<SessionDashboard isModerator={false} onSetEstimate={() => {}} storyList={mockStories} />)
    expect(screen.getByText('Session Complete')).toBeInTheDocument()
  })

  it('displays total stories count', () => {
    render(<SessionDashboard isModerator={false} onSetEstimate={() => {}} storyList={mockStories} />)
    expect(screen.getByText('Stories')).toBeInTheDocument()
    expect(screen.getAllByText(mockStories.length.toString()).length).toBeGreaterThan(0)
  })

  it('displays estimated stories count', () => {
    render(<SessionDashboard isModerator={false} onSetEstimate={() => {}} storyList={mockStories} />)
    expect(screen.getByText('Estimated')).toBeInTheDocument()
  })

  it('displays total committed story points', () => {
    render(<SessionDashboard isModerator={false} onSetEstimate={() => {}} storyList={mockStories} />)
    expect(screen.getByText('Total Committed SP')).toBeInTheDocument()
    expect(screen.getByText('16')).toBeInTheDocument()
  })

  it('displays avg story point label', () => {
    render(<SessionDashboard isModerator={false} onSetEstimate={() => {}} storyList={mockStories} />)
    expect(screen.getByText('AVG Story point')).toBeInTheDocument()
  })

  it('displays story titles', () => {
    render(<SessionDashboard isModerator={false} onSetEstimate={() => {}} storyList={mockStories} />)
    mockStories.forEach((story) => {
      expect(screen.getByText(story.title)).toBeInTheDocument()
    })
  })

  it('handles empty story list', () => {
    render(<SessionDashboard isModerator={false} onSetEstimate={() => {}} storyList={[]} />)
    expect(screen.getByText('Session Complete')).toBeInTheDocument()
  })

  it('shows estimated votes for each story', () => {
    render(<SessionDashboard isModerator={false} onSetEstimate={() => {}} storyList={mockStories} />)
    mockStories.forEach((story) => {
      if (!story.estimatedVote) return

      const storyCell = screen.getByText(story.title)
      const row = storyCell.closest('tr')
      expect(row).toBeTruthy()
      if (!row) return

      expect(within(row).getByText(story.estimatedVote)).toBeInTheDocument()
    })
  })

  it('shows edit controls for moderators only', () => {
    const { rerender } = render(
      <SessionDashboard isModerator={false} onSetEstimate={() => {}} storyList={mockStories} />,
    )

    expect(screen.queryByRole('button', { name: 'Edit estimate' })).not.toBeInTheDocument()

    rerender(<SessionDashboard isModerator={true} onSetEstimate={() => {}} storyList={mockStories} />)

    expect(screen.getAllByRole('button', { name: 'Edit estimate' })).toHaveLength(mockStories.length)
  })

  it('calls onSetEstimate when a moderator selects a value from popup', async () => {
    const user = userEvent.setup()
    const onSetEstimate = vi.fn()

    render(<SessionDashboard isModerator={true} onSetEstimate={onSetEstimate} storyList={mockStories} />)

    await user.click(screen.getAllByRole('button', { name: 'Edit estimate' })[1])
    await user.click(screen.getByRole('button', { name: 'Set estimate to 13' }))

    expect(onSetEstimate).toHaveBeenCalledWith('2', '13')
    expect(onSetEstimate).toHaveBeenCalledTimes(1)
  })
})
