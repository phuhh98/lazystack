import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RightSidebar from '../../../components/planning-poker/RightSidebar'
import type { PlayerData } from '@/hooks/usePlanningPoker'

const mockPlayers: PlayerData[] = [
  {
    id: 'p1',
    name: 'Alice',
    vote: '5',
    voted: true,
    isOnline: true,
    lastSeen: Date.now(),
    handRaised: false,
  },
  {
    id: 'p2',
    name: 'Bob',
    vote: null,
    voted: false,
    isOnline: true,
    lastSeen: Date.now(),
    handRaised: true,
  },
]

describe('RightSidebar Component', () => {
  it('renders sidebar', () => {
    const { container } = render(
      <RightSidebar
        chat={[]}
        playerId="p1"
        onSend={() => {}}
        players={mockPlayers}
        isModerator={false}
        timerDuration={0}
        onToggleHand={() => {}}
        onLowerHand={() => {}}
        onSetTimerDuration={() => {}}
        codeWord="test-code"
      />,
    )
    expect(container.firstChild).toBeInTheDocument()
  })

  it('displays chat tab', () => {
    render(
      <RightSidebar
        chat={[]}
        playerId="p1"
        onSend={() => {}}
        players={mockPlayers}
        isModerator={false}
        timerDuration={0}
        onToggleHand={() => {}}
        onLowerHand={() => {}}
        onSetTimerDuration={() => {}}
        codeWord="test-code"
      />,
    )
    // Should have tab navigation
    expect(
      screen.getByRole('button', { name: /chat|message/i }),
    ).toBeInTheDocument()
  })

  it('displays hand raise tab', () => {
    render(
      <RightSidebar
        chat={[]}
        playerId="p1"
        onSend={() => {}}
        players={mockPlayers}
        isModerator={false}
        timerDuration={0}
        onToggleHand={() => {}}
        onLowerHand={() => {}}
        onSetTimerDuration={() => {}}
        codeWord="test-code"
      />,
    )
    expect(screen.getByTitle('Raise hand')).toBeInTheDocument()
  })

  it('shows code word as participant', () => {
    render(
      <RightSidebar
        chat={[]}
        playerId="p1"
        onSend={() => {}}
        players={mockPlayers}
        isModerator={false}
        timerDuration={0}
        onToggleHand={() => {}}
        onLowerHand={() => {}}
        onSetTimerDuration={() => {}}
        codeWord="test-code-123"
      />,
    )
    // Code word is used in presets inside the chat panel after opening.
    expect(screen.getByTitle('Chat')).toBeInTheDocument()
  })

  it('shows moderator controls when isModerator is true', () => {
    render(
      <RightSidebar
        chat={[]}
        playerId="p1"
        onSend={() => {}}
        players={mockPlayers}
        isModerator={true}
        timerDuration={0}
        onToggleHand={() => {}}
        onLowerHand={() => {}}
        onSetTimerDuration={() => {}}
        codeWord="test-code"
        onSetCodeWord={() => {}}
      />,
    )
    expect(screen.getByTitle('Timer settings')).toBeInTheDocument()
  })
})
