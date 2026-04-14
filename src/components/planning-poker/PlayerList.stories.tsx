import type { Meta, StoryObj } from '@storybook/react'
import PlayerList from './PlayerList'

const meta: Meta<typeof PlayerList> = {
  title: 'PlanningPoker/PlayerList',
  component: PlayerList,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--bg-base)' },
        { name: 'dark', value: '#0a1418' },
      ],
    },
  },
  tags: ['autodocs'],
  args: {
    currentPlayerId: 'p1',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const playersVoting = [
  { id: 'p1', name: 'Alice', voted: true, vote: '5', isOnline: true },
  { id: 'p2', name: 'Bob', voted: false, vote: null, isOnline: true },
  { id: 'p3', name: 'Carol', voted: true, vote: '8', isOnline: true },
  { id: 'p4', name: 'Dan', voted: false, vote: null, isOnline: false },
]

const playersRevealed = [
  { id: 'p1', name: 'Alice', voted: true, vote: '5', isOnline: true },
  { id: 'p2', name: 'Bob', voted: true, vote: '8', isOnline: true },
  { id: 'p3', name: 'Carol', voted: true, vote: '5', isOnline: true },
  { id: 'p4', name: 'Dan', voted: true, vote: '?', isOnline: false },
]

export const Voting: Story = {
  args: { players: playersVoting, phase: 'voting' },
  parameters: {
    docs: { description: { story: 'Voting phase: shows checkmark for voted players, ellipsis for waiting.' } },
  },
}

export const Revealed: Story = {
  args: { players: playersRevealed, phase: 'revealed' },
  parameters: {
    docs: { description: { story: 'Revealed phase: all vote values are shown.' } },
  },
}

export const WithCurrentPlayer: Story = {
  args: { players: playersVoting, phase: 'voting', currentPlayerId: 'p2' },
  parameters: {
    docs: { description: { story: 'The current player row is highlighted with a sand background.' } },
  },
}

export const OfflinePlayers: Story = {
  args: {
    players: [
      { id: 'p1', name: 'Alice', voted: true, vote: '3', isOnline: true },
      { id: 'p2', name: 'Bob', voted: false, vote: null, isOnline: false },
      { id: 'p3', name: 'Carol', voted: false, vote: null, isOnline: false },
    ],
    phase: 'voting',
  },
}

export const Empty: Story = {
  args: { players: [], phase: 'lobby' },
}
