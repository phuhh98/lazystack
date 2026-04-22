import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { PlayerData } from '@/hooks/usePlanningPoker'

import VoteResults from '@/components/planning-poker/VoteResults'

function buildPlayer(id: string, vote: null | string, voted = true): PlayerData {
  return {
    handRaised: false,
    id,
    isOnline: true,
    lastSeen: Date.now(),
    name: `Player ${id}`,
    vote,
    voted,
  }
}

describe('VoteResults', () => {
  it('shows suggested estimate value in the edit trigger', () => {
    render(
      <VoteResults
        isConsensus={false}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '5')]}
      />,
    )

    expect(screen.getByRole('button', { name: 'Edit estimate' })).toHaveTextContent('4')
  })

  it('submits moderator-edited estimate selected from popover', async () => {
    const user = userEvent.setup()
    const onNextStory = vi.fn()

    render(
      <VoteResults
        isConsensus={true}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={onNextStory}
        onReestimate={() => {}}
        players={[buildPlayer('1', '5'), buildPlayer('2', '5')]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Edit estimate' }))
    await user.click(screen.getByRole('button', { name: 'Set estimate to 13' }))
    await user.click(screen.getByRole('button', { name: 'Next Story' }))

    expect(onNextStory).toHaveBeenCalledWith('13')
  })

  it('keeps next story enabled when a suggested estimate exists', () => {
    render(
      <VoteResults
        isConsensus={true}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '8'), buildPlayer('2', '8')]}
      />,
    )

    expect(screen.getByRole('button', { name: 'Next Story' })).toBeEnabled()
  })

  it('allows moderator to choose another estimate from popover', async () => {
    const user = userEvent.setup()
    const onNextStory = vi.fn()

    render(
      <VoteResults
        isConsensus={true}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={onNextStory}
        onReestimate={() => {}}
        players={[buildPlayer('1', '8'), buildPlayer('2', '8')]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Edit estimate' }))
    await user.click(screen.getByRole('button', { name: 'Set estimate to 21' }))
    await user.click(screen.getByRole('button', { name: 'Next Story' }))

    expect(onNextStory).toHaveBeenCalledWith('21')
  })

  it('enables re-estimate and calls callback when any vote is question mark', async () => {
    const user = userEvent.setup()
    const onReestimate = vi.fn()

    render(
      <VoteResults
        isConsensus={false}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={onReestimate}
        players={[buildPlayer('1', '?'), buildPlayer('2', '8')]}
      />,
    )

    const reestimateButton = screen.getByRole('button', { name: 'Re-estimate' })
    expect(reestimateButton).toBeEnabled()

    await user.click(reestimateButton)

    expect(onReestimate).toHaveBeenCalledTimes(1)
  })

  it('disables re-estimate when no vote is question mark', () => {
    render(
      <VoteResults
        isConsensus={false}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
      />,
    )

    expect(screen.getByRole('button', { name: 'Re-estimate' })).toBeDisabled()
  })

  it('enables re-estimate and calls callback when no votes are recorded', async () => {
    const user = userEvent.setup()
    const onReestimate = vi.fn()

    render(
      <VoteResults
        isConsensus={false}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={onReestimate}
        players={[buildPlayer('1', null, false), buildPlayer('2', null, false)]}
      />,
    )

    const reestimateButton = screen.getByRole('button', { name: 'Re-estimate' })
    expect(reestimateButton).toBeEnabled()

    await user.click(reestimateButton)
    expect(onReestimate).toHaveBeenCalledTimes(1)
  })

  it('changes button to "End Session" when all stories are estimated', () => {
    render(
      <VoteResults
        isConsensus={false}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
        storyList={[
          { estimatedVote: '5', id: '1', title: 'Story 1' },
          { estimatedVote: '8', id: '2', title: 'Story 2' },
        ]}
      />,
    )

    expect(screen.getByRole('button', { name: /End Session/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Next Story/ })).not.toBeInTheDocument()
  })

  it('shows End Session when only current revealed story is unestimated', () => {
    render(
      <VoteResults
        currentStory="Story 2"
        isConsensus={false}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
        storyList={[
          { estimatedVote: '5', id: '1', title: 'Story 1' },
          { estimatedVote: null, id: '2', title: 'Story 2' },
        ]}
      />,
    )

    expect(screen.getByRole('button', { name: /End Session/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Next Story/ })).not.toBeInTheDocument()
  })

  it('shows confirmation modal when End Session is clicked with all stories estimated', async () => {
    const user = userEvent.setup()

    render(
      <VoteResults
        isConsensus={false}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
        storyList={[
          { estimatedVote: '5', id: '1', title: 'Story 1' },
          { estimatedVote: '8', id: '2', title: 'Story 2' },
        ]}
      />,
    )

    const endSessionButton = screen.getByRole('button', { name: /End Session/ })
    await user.click(endSessionButton)

    expect(screen.getByRole('heading', { name: 'End Session?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm End' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('shows confirmation modal when normal End Session is clicked before all stories are estimated', async () => {
    const user = userEvent.setup()

    render(
      <VoteResults
        currentStory="Story 2"
        isConsensus={false}
        isModerator={true}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
        storyList={[
          { estimatedVote: '5', id: '1', title: 'Story 1' },
          { estimatedVote: null, id: '2', title: 'Story 2' },
          { estimatedVote: null, id: '3', title: 'Story 3' },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: /^End Session$/ }))

    expect(screen.getByRole('heading', { name: 'End Session?' })).toBeInTheDocument()
    expect(
      screen.getByText('This will end the session now, even with unestimated stories. Continue?'),
    ).toBeInTheDocument()
  })

  it('does not end session until Confirm End is clicked in normal end-session flow', async () => {
    const user = userEvent.setup()
    const onEndSession = vi.fn()

    render(
      <VoteResults
        currentStory="Story 2"
        isConsensus={false}
        isModerator={true}
        onEndSession={onEndSession}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
        storyList={[
          { estimatedVote: '5', id: '1', title: 'Story 1' },
          { estimatedVote: null, id: '2', title: 'Story 2' },
          { estimatedVote: null, id: '3', title: 'Story 3' },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: /^End Session$/ }))
    expect(onEndSession).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Confirm End' }))
    expect(onEndSession).toHaveBeenCalledTimes(1)
  })

  it('calls onEndSession when Confirm End is clicked in modal', async () => {
    const user = userEvent.setup()
    const onEndSession = vi.fn()
    const onNextStory = vi.fn()

    render(
      <VoteResults
        isConsensus={false}
        isModerator={true}
        onEndSession={onEndSession}
        onNextStory={onNextStory}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
        storyList={[
          { estimatedVote: '5', id: '1', title: 'Story 1' },
          { estimatedVote: '8', id: '2', title: 'Story 2' },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: /End Session/ }))
    await user.click(screen.getByRole('button', { name: 'Confirm End' }))

    expect(onEndSession).toHaveBeenCalledTimes(1)
    expect(onNextStory).not.toHaveBeenCalled()
  })

  it('persists final pending story estimate when Confirm End is clicked', async () => {
    const user = userEvent.setup()
    const onEndSession = vi.fn()
    const onNextStory = vi.fn()

    render(
      <VoteResults
        currentStory="Story 2"
        isConsensus={false}
        isModerator={true}
        onEndSession={onEndSession}
        onNextStory={onNextStory}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
        storyList={[
          { estimatedVote: '5', id: '1', title: 'Story 1' },
          { estimatedVote: null, id: '2', title: 'Story 2' },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: /End Session/ }))
    await user.click(screen.getByRole('button', { name: 'Confirm End' }))

    expect(onNextStory).toHaveBeenCalledWith('5.5')
    expect(onEndSession).not.toHaveBeenCalled()
  })

  it('shows Add Adhoc button in modal when callback provided', async () => {
    const user = userEvent.setup()

    render(
      <VoteResults
        isConsensus={false}
        isModerator={true}
        onAddAdhoc={() => {}}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
        storyList={[
          { estimatedVote: '5', id: '1', title: 'Story 1' },
          { estimatedVote: '8', id: '2', title: 'Story 2' },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: /End Session/ }))

    expect(screen.getByRole('button', { name: 'Add Adhoc' })).toBeInTheDocument()
  })

  it('calls onAddAdhoc when Add Adhoc button is clicked', async () => {
    const user = userEvent.setup()
    const onAddAdhoc = vi.fn()

    render(
      <VoteResults
        isConsensus={false}
        isModerator={true}
        onAddAdhoc={onAddAdhoc}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
        storyList={[
          { estimatedVote: '5', id: '1', title: 'Story 1' },
          { estimatedVote: '8', id: '2', title: 'Story 2' },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: /End Session/ }))
    await user.click(screen.getByRole('button', { name: 'Add Adhoc' }))

    expect(onAddAdhoc).toHaveBeenCalledTimes(1)
  })

  it('passes estimate override to onAddAdhoc from final pending story', async () => {
    const user = userEvent.setup()
    const onAddAdhoc = vi.fn()

    render(
      <VoteResults
        currentStory="Story 2"
        isConsensus={false}
        isModerator={true}
        onAddAdhoc={onAddAdhoc}
        onEndSession={() => {}}
        onNextStory={() => {}}
        onReestimate={() => {}}
        players={[buildPlayer('1', '3'), buildPlayer('2', '8')]}
        storyList={[
          { estimatedVote: '5', id: '1', title: 'Story 1' },
          { estimatedVote: null, id: '2', title: 'Story 2' },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: /End Session/ }))
    await user.click(screen.getByRole('button', { name: 'Add Adhoc' }))

    expect(onAddAdhoc).toHaveBeenCalledWith('5.5')
  })
})
