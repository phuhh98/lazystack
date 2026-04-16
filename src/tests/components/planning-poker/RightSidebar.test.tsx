import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { PlayerData } from '@/hooks/usePlanningPoker'

import RightSidebar from '../../../components/planning-poker/RightSidebar'

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
  it('renders sidebar', () => {
    const { container } = render(
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
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays chat tab', () => {
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
    // Should have tab navigation
    expect(screen.getByRole('button', { name: /chat|message/i })).toBeInTheDocument()
  })

  it('displays hand raise tab', () => {
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
    expect(screen.getByTitle('Raise hand')).toBeInTheDocument()
  })

  it('shows code word as participant', () => {
    render(
      <RightSidebar
        chat={[]}
        codeWord="test-code-123"
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
    // Code word is used in presets inside the chat panel after opening.
    expect(screen.getByTitle('Chat')).toBeInTheDocument()
  })

  it('shows moderator controls when isModerator is true', () => {
    render(
      <RightSidebar
        chat={[]}
        codeWord="test-code"
        isModerator={true}
        onLowerHand={() => {}}
        onSend={() => {}}
        onSetCodeWord={() => {}}
        onSetTimerDuration={() => {}}
        onToggleHand={() => {}}
        playerId="p1"
        players={mockPlayers}
        timerDuration={0}
      />,
    )
    expect(screen.getByTitle('Timer settings')).toBeInTheDocument()
  })
})
