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

  it('allows moderator to choose a non-numeric estimate from popover', async () => {
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
    await user.click(screen.getByRole('button', { name: 'Set estimate to ?' }))
    await user.click(screen.getByRole('button', { name: 'Next Story' }))

    expect(onNextStory).toHaveBeenCalledWith('?')
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
})
