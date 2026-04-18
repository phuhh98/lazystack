import type { Meta, StoryObj } from '@storybook/react-vite'

import { Pencil } from 'lucide-react'
import { useState } from 'react'

import SetCardValuePopover from '@/components/planning-poker/SetCardValuePopover'

function PopoverDemo(
  args: Omit<React.ComponentProps<typeof SetCardValuePopover>, 'children' | 'currentValue' | 'onSelectValue'>,
) {
  const [value, setValue] = useState<null | string>('5')

  return (
    <div className="bg-bg-surface-strong inline-flex rounded-2xl p-4">
      <SetCardValuePopover {...args} currentValue={value} onSelectValue={setValue}>
        <span className="bg-bg-surface border-border text-ink flex items-center gap-1 rounded-xl border px-2.5 py-1">
          <span className="text-xs font-bold">{value ?? '—'}</span>
          <Pencil className="h-3.5 w-3.5" />
        </span>
      </SetCardValuePopover>
    </div>
  )
}

const meta: Meta<typeof SetCardValuePopover> = {
  args: {
    title: 'Set estimate',
    triggerAriaLabel: 'Edit estimate',
    triggerTitle: 'Edit estimate',
  },
  component: SetCardValuePopover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/SetCardValuePopover',
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <PopoverDemo {...args} />,
}

export const CustomDeck: Story = {
  args: {
    cardValues: ['XS', 'S', 'M', 'L', 'XL'],
    title: 'Set size',
  },
  render: (args) => <PopoverDemo {...args} />,
}
