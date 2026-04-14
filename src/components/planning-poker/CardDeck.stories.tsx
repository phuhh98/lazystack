import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import CardDeck from './CardDeck'

const CARDS = ['1', '2', '3', '5', '8', '13', '21', '?', '☕']

const meta: Meta<typeof CardDeck> = {
  title: 'PlanningPoker/CardDeck',
  component: CardDeck,
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
    cards: CARDS,
    disabled: false,
    onSelect: () => {},
  },
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
  args: { selectedCard: '8', disabled: true },
  parameters: {
    docs: { description: { story: 'Cards are disabled after voting or when phase is not voting.' } },
  },
}

export const AllCards: Story = {
  args: { selectedCard: null },
  render: (args) => {
    const [selected, setSelected] = useState<string | null>(null)
    return (
      <CardDeck
        {...args}
        selectedCard={selected}
        onSelect={(card) => setSelected(card)}
      />
    )
  },
  parameters: {
    docs: { description: { story: 'Interactive: click cards to select/deselect.' } },
  },
}
