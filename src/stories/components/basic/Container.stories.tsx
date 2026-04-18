import type { Meta, StoryObj } from '@storybook/react-vite'

import Container from '@/components/basic/Container'

const meta: Meta<typeof Container> = {
  argTypes: {
    align: {
      control: {
        type: 'select',
      },
      options: ['start', 'center', 'end', 'stretch'],
    },
    as: {
      control: {
        type: 'select',
      },
      options: ['div', 'section', 'article', 'main'],
    },
    className: {
      control: 'text',
    },
    columns: {
      control: {
        max: 6,
        min: 1,
        step: 1,
        type: 'number',
      },
    },
    direction: {
      control: {
        type: 'select',
      },
      options: ['row', 'row-reverse', 'col', 'col-reverse'],
    },
    justify: {
      control: {
        type: 'select',
      },
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
    layout: {
      control: {
        type: 'inline-radio',
      },
      options: ['flex', 'grid'],
    },
    wrap: {
      control: {
        type: 'select',
      },
      options: ['nowrap', 'wrap', 'wrap-reverse'],
    },
  },
  component: Container,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'Basic/Container',
}

export default meta
type Story = StoryObj<typeof Container>

export const DefaultCenteredFlex: Story = {
  args: {
    children: 'Centered content',
    className: 'min-h-32 rounded-xl border border-border bg-bg-surface p-4 text-ink',
  },
}

export const VerticalFlex: Story = {
  args: {
    align: 'start',
    className: 'min-h-48 rounded-xl border border-border bg-bg-surface p-4 text-ink',
    direction: 'col',
    justify: 'start',
    wrap: 'nowrap',
  },
  render: (args) => (
    <Container {...args}>
      <div className="bg-lagoon-300/20 rounded-md px-3 py-2">Item 1</div>
      <div className="bg-banana-cream-300 rounded-md px-3 py-2">Item 2</div>
      <div className="bg-coral-300/25 rounded-md px-3 py-2">Item 3</div>
    </Container>
  ),
}

export const GridLayout: Story = {
  args: {
    align: 'stretch',
    className: 'gap-3 rounded-xl border border-border bg-bg-surface p-4 text-ink',
    columns: 3,
    justify: 'center',
    layout: 'grid',
  },
  render: (args) => (
    <Container {...args}>
      <div className="border-border bg-bg rounded-md border p-3">A</div>
      <div className="border-border bg-bg rounded-md border p-3">B</div>
      <div className="border-border bg-bg rounded-md border p-3">C</div>
      <div className="border-border bg-bg rounded-md border p-3">D</div>
      <div className="border-border bg-bg rounded-md border p-3">E</div>
      <div className="border-border bg-bg rounded-md border p-3">F</div>
    </Container>
  ),
}

export const SemanticMain: Story = {
  args: {
    as: 'main',
    children: 'Main landmark container',
    className: 'min-h-24 rounded-xl border border-border bg-bg-surface p-4 text-ink',
  },
}
