import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import SessionDashboard from '../../../components/planning-poker/SessionDashboard'
import type { StoryItem } from '@/hooks/usePlanningPoker'

const mockStories: StoryItem[] = [
  { id: '1', title: 'Feature 1', estimatedVote: '5' },
  { id: '2', title: 'Feature 2', estimatedVote: '8' },
  { id: '3', title: 'Feature 3', estimatedVote: '3' },
]

describe('SessionDashboard Component', () => {
  it('renders dashboard heading', () => {
    render(
      <SessionDashboard
        storyList={mockStories}
        isModerator={false}
        onSetEstimate={() => {}}
      />,
    )
    expect(screen.getByText('Session Complete')).toBeInTheDocument()
  })

  it('displays total stories count', () => {
    render(
      <SessionDashboard
        storyList={mockStories}
        isModerator={false}
        onSetEstimate={() => {}}
      />,
    )
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(
      screen.getAllByText(mockStories.length.toString()).length,
    ).toBeGreaterThan(0)
  })

  it('displays estimated stories count', () => {
    render(
      <SessionDashboard
        storyList={mockStories}
        isModerator={false}
        onSetEstimate={() => {}}
      />,
    )
    expect(screen.getByText('Estimated')).toBeInTheDocument()
  })

  it('displays story titles', () => {
    render(
      <SessionDashboard
        storyList={mockStories}
        isModerator={false}
        onSetEstimate={() => {}}
      />,
    )
    mockStories.forEach((story) => {
      expect(screen.getByText(story.title)).toBeInTheDocument()
    })
  })

  it('handles empty story list', () => {
    render(
      <SessionDashboard
        storyList={[]}
        isModerator={false}
        onSetEstimate={() => {}}
      />,
    )
    expect(screen.getByText('Session Complete')).toBeInTheDocument()
  })

  it('shows estimated votes for each story', () => {
    render(
      <SessionDashboard
        storyList={mockStories}
        isModerator={false}
        onSetEstimate={() => {}}
      />,
    )
    mockStories.forEach((story) => {
      if (!story.estimatedVote) return

      const storyCell = screen.getByText(story.title)
      const row = storyCell.closest('tr')
      expect(row).toBeTruthy()
      if (!row) return

      expect(within(row).getByText(story.estimatedVote)).toBeInTheDocument()
    })
  })
})
