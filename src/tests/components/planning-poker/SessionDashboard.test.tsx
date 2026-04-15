import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SessionDashboard from '../../../components/planning-poker/SessionDashboard'
import type { StoryItem } from '@/hooks/usePlanningPoker'

const mockStories: StoryItem[] = [
  { id: '1', title: 'Feature 1', estimatedVote: '5', discussionId: 'd1' },
  { id: '2', title: 'Feature 2', estimatedVote: '8', discussionId: 'd2' },
  { id: '3', title: 'Feature 3', estimatedVote: '3', discussionId: 'd3' },
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
    expect(screen.getByText(mockStories.length.toString())).toBeInTheDocument()
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
      if (story.estimatedVote) {
        expect(screen.getByText(story.estimatedVote)).toBeInTheDocument()
      }
    })
  })
})
