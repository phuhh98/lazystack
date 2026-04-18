import type { Meta, StoryObj } from '@storybook/react-vite'

import Typography from '@/components/basic/Typography'

const meta: Meta<typeof Typography> = {
  argTypes: {
    as: {
      control: {
        type: 'select',
      },
      options: ['p', 'span', 'small', 'h1', 'h2', 'h3', 'h4', 'label', 'em', 'strong', 'abbr', 'cite', 'mark', 'code'],
    },
    children: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
  },
  component: Typography,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'Basic/Typography',
}

export default meta
type Story = StoryObj<typeof Typography>

export const DefaultParagraph: Story = {
  args: {
    as: 'p',
    children: 'A default paragraph rendered through the Typography primitive.',
  },
}

export const Heading: Story = {
  args: {
    as: 'h2',
    children: 'Heading rendered via as prop',
    className: 'text-3xl font-bold tracking-tight text-ink',
  },
}

export const InlineSpan: Story = {
  args: {
    as: 'span',
    children: 'inline metadata',
    className: 'rounded-md bg-bg-surface px-2 py-1 text-sm text-ink-muted',
  },
  render: (args) => (
    <p className="text-ink">
      Session status: <Typography {...args} />
    </p>
  ),
}

export const LabelAssociation: Story = {
  args: {
    as: 'label',
    children: 'Display name',
    className: 'text-sm font-semibold text-ink',
    htmlFor: 'storybook-typography-name',
  },
  render: (args) => (
    <div className="flex max-w-sm flex-col gap-2">
      <Typography {...args} />
      <input
        className="border-border bg-bg-surface text-ink rounded-md border px-3 py-2 text-sm"
        id="storybook-typography-name"
        placeholder="Ada Lovelace"
        type="text"
      />
    </div>
  ),
}

export const EmptyContent: Story = {
  args: {
    as: 'p',
    children: '',
    className: 'text-base text-ink-muted',
  },
}

export const LongContentWrap: Story = {
  args: {
    as: 'p',
    children:
      'This is intentionally long content to verify typography rendering across multiple lines and ensure wrapping remains stable inside constrained containers without clipping or overflow artifacts.',
    className: 'max-w-xs text-sm leading-6 text-ink',
  },
}

export const SemanticInlineTags: Story = {
  render: () => (
    <p className="text-ink">
      Use <Typography as="strong">strong</Typography> for importance, <Typography as="em">emphasis</Typography> for
      vocal stress,{' '}
      <Typography as="abbr" title="User Experience">
        UX
      </Typography>{' '}
      for abbreviations, <Typography as="cite">LazyStack Design Notes</Typography> for citations,{' '}
      <Typography as="mark">highlight</Typography> for relevant snippets, and{' '}
      <Typography as="code">pnpm build</Typography> for inline code.
    </p>
  ),
}
