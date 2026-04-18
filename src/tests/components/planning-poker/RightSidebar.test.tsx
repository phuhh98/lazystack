import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { PlayerData } from '@/hooks/usePlanningPoker'

import RightSidebar from '@/components/planning-poker/RightSidebar'

const mockPlayers: PlayerData[] = [
  {
    handRaised: false,
    id: 'p1',
    isOnline: true,
    lastSeen: Date.now(),
    name: 'Alice',
    vote: '5',
    voted: true,
  },
  {
    handRaised: true,
    id: 'p2',
    isOnline: true,
    lastSeen: Date.now(),
    name: 'Bob',
    vote: null,
    voted: false,
  },
]

describe('RightSidebar Component', () => {
  it('renders icon rail controls', () => {
    render(
      <RightSidebar
        chat={[]}
        codeWord="test-code"
        isModerator={false}
        onLowerHand={() => {}}
        onSend={() => {}}
        onSetTimerDuration={() => {}}
        onToggleHand={() => {}}
        playerId="p1"
        players={mockPlayers}
        timerDuration={0}
      />,
    )

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open chat' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open hand panel' })).toBeInTheDocument()
  })

  it('opens chat tab and shows empty state', async () => {
    const user = userEvent.setup()

    render(
      <RightSidebar
        chat={[]}
        codeWord="test-code"
        isModerator={false}
        onLowerHand={() => {}}
        onSend={() => {}}
        onSetTimerDuration={() => {}}
        onToggleHand={() => {}}
        playerId="p1"
        players={mockPlayers}
        timerDuration={0}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open chat' }))

    expect(screen.getByText('No messages yet. Say hello!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument()
  })

  it('sends message from chat composer', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()

    render(
      <RightSidebar
        chat={[]}
        codeWord="test-code"
        isModerator={false}
        onLowerHand={() => {}}
        onSend={onSend}
        onSetTimerDuration={() => {}}
        onToggleHand={() => {}}
        playerId="p1"
        players={mockPlayers}
        timerDuration={0}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open chat' }))
    await user.type(screen.getByPlaceholderText('Type a message...'), 'Need a quick break{Enter}')

    expect(onSend).toHaveBeenCalledWith('Need a quick break')
  })

  it('toggles hand from hand tab', async () => {
    const user = userEvent.setup()
    const onToggleHand = vi.fn()

    render(
      <RightSidebar
        chat={[]}
        codeWord="test-code"
        isModerator={false}
        onLowerHand={() => {}}
        onSend={() => {}}
        onSetTimerDuration={() => {}}
        onToggleHand={onToggleHand}
        playerId="p1"
        players={mockPlayers}
        timerDuration={0}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open hand panel' }))
    await user.click(screen.getByRole('button', { name: /raise hand|lower hand/i }))

    expect(onToggleHand).toHaveBeenCalledTimes(1)
  })

  it('shows timer tab only for moderator and sets timer preset', async () => {
    const user = userEvent.setup()
    const onSetTimerDuration = vi.fn()

    render(
      <RightSidebar
        chat={[]}
        codeWord="test-code"
        isModerator={true}
        onLowerHand={() => {}}
        onSend={() => {}}
        onSetCodeWord={() => {}}
        onSetTimerDuration={onSetTimerDuration}
        onToggleHand={() => {}}
        playerId="p1"
        players={mockPlayers}
        timerDuration={0}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open timer settings' }))
    await user.click(screen.getByRole('button', { name: '30s' }))

    expect(onSetTimerDuration).toHaveBeenCalledWith(30)
  })
})
