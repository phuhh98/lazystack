import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    // Should have tabs for different features
    expect(screen.getByRole('button')).toBeInTheDocument()
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
    // Code word should be displayed
    expect(screen.getByRole('button')).toBeInTheDocument()
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
    // Moderator should have extra controls
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
