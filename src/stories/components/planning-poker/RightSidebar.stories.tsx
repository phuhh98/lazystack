import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { useEffect, useRef } from 'react'

import type { ChatMessage, PlayerData } from '@/hooks/usePlanningPoker'

import RightSidebar from '../../../components/planning-poker/RightSidebar'

const meta: Meta<typeof RightSidebar> = {
  args: {
    chat: [],
    codeWord: '',
    isModerator: false,
    onLowerHand: () => {},
    onSend: () => {},
    onSetTimerDuration: () => {},
    onToggleHand: () => {},
    playerId: 'player-1',
    players: [],
    timerDuration: 0,
  },
  component: RightSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/RightSidebar',
}

export default meta
type RightSidebarProps = ComponentProps<typeof RightSidebar>

type Story = StoryObj<typeof RightSidebar>

function AutoOpenSidebarStory(props: RightSidebarProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chatButton = rootRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Open chat"]')
    chatButton?.click()
  }, [])

  return (
    <div className="h-screen" ref={rootRef}>
      <RightSidebar {...props} />
    </div>
  )
}

const samplePlayers: PlayerData[] = [
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
  {
    handRaised: false,
    id: 'p3',
    isOnline: false,
    lastSeen: Date.now() - 60000,
    name: 'Carol',
    vote: '8',
    voted: true,
  },
]

const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    name: 'Alice',
    playerId: 'p1',
    text: '👋 Hello!',
    ts: Date.now() - 30000,
  },
  {
    id: '2',
    name: 'Bob',
    playerId: 'p2',
    text: '👍 Looks good',
    ts: Date.now() - 20000,
  },
]

/**
 * Right sidebar as participant (not moderator)
 */
export const AsParticipant: Story = {
  args: {
    chat: sampleMessages,
    codeWord: 'poker-room-123',
    isModerator: false,
    players: samplePlayers,
    timerDuration: 0,
  },
  render: (args) => <AutoOpenSidebarStory {...args} />,
}

/**
 * Right sidebar as moderator
 */
export const AsModerator: Story = {
  args: {
    chat: sampleMessages,
    codeWord: 'poker-room-123',
    isModerator: true,
    onSetCodeWord: () => {},
    players: samplePlayers,
    timerDuration: 30,
  },
  render: (args) => <AutoOpenSidebarStory {...args} />,
}

/**
 * Right sidebar with active hand raises
 */
export const WithHandRaises: Story = {
  args: {
    chat: sampleMessages,
    isModerator: true,
    playerId: 'p1',
    players: [
      {
        handRaised: true,
        id: 'p1',
        isOnline: true,
        lastSeen: Date.now(),
        name: 'Alice',
        vote: null,
        voted: false,
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
      {
        handRaised: false,
        id: 'p3',
        isOnline: true,
        lastSeen: Date.now(),
        name: 'Carol',
        vote: null,
        voted: false,
      },
    ],
  },
  render: (args) => <AutoOpenSidebarStory {...args} />,
}

/**
 * Sidebar collapsed with unread badges visible in icon rail
 */
export const CollapsedWithUnread: Story = {
  args: {
    chat: sampleMessages,
    codeWord: 'room-42',
    isModerator: true,
    onSetCodeWord: () => {},
    playerId: 'p1',
    players: samplePlayers,
    timerDuration: 15,
  },
}
