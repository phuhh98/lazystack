import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { StoryItem } from '@/hooks/usePlanningPoker'

import SessionDashboard from '../../../components/planning-poker/SessionDashboard'

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
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getAllByText(mockStories.length.toString()).length).toBeGreaterThan(0)
  })

  it('displays estimated stories count', () => {
    render(<SessionDashboard isModerator={false} onSetEstimate={() => {}} storyList={mockStories} />)
    expect(screen.getByText('Estimated')).toBeInTheDocument()
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
})
