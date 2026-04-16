import type { Meta, StoryObj } from '@storybook/react-vite'

import { useState } from 'react'

import CardDeck from '../../../components/planning-poker/CardDeck'

const CARDS = ['1', '2', '3', '5', '8', '13', '21', '?', '☕']

const meta: Meta<typeof CardDeck> = {
  args: {
    cards: CARDS,
    disabled: false,
    onSelect: () => {},
  },
  component: CardDeck,
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--bg-base)' },
        { name: 'dark', value: '#0a1418' },
      ],
    },
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/CardDeck',
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { selectedCard: null },
}

export const WithSelection: Story = {
  args: { selectedCard: '5' },
}

export const Disabled: Story = {
  args: { disabled: true, selectedCard: '8' },
  parameters: {
    docs: {
      description: {
        story: 'Cards are disabled after voting or when phase is not voting.',
      },
    },
  },
}

export const AllCards: Story = {
  args: { selectedCard: null },
  parameters: {
    docs: {
      description: {
        story: 'Interactive: click cards to select/deselect.',
      },
    },
  },
  render: (args) => {
    const [selected, setSelected] = useState<null | string>(null)
    return <CardDeck {...args} onSelect={(card) => setSelected(card)} selectedCard={selected} />
  },
}
