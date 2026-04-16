import type { Meta, StoryObj } from '@storybook/react-vite'

import ExternalLink from '../../../components/basic/ExternalLink'
import GithubIcon from '../../../components/brandIcons/GithubIcon'

const meta: Meta<typeof ExternalLink> = {
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    href: {
      control: 'text',
      description: 'URL to navigate to',
    },
    rel: {
      control: 'text',
      description: 'Relationship between the current document and the linked document',
    },
    target: {
      control: {
        options: ['_blank', '_self', '_parent', '_top'],
        type: 'select',
      },
      description: 'Target attribute for the link',
    },
    withIcon: {
      control: 'boolean',
      description: 'Whether to apply icon styling',
    },
  },
  component: ExternalLink,
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--bg-base)' },
        { name: 'dark', value: '#0a1418' },
      ],
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'Basic/ExternalLink',
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default external link with standard nav-link styling
 */
export const Default: Story = {
  args: {
    children: 'Visit Example',
    className: '',
    href: 'https://example.com',
  },
}

/**
 * External link with icon styling (rounded background)
 */
export const WithIcon: Story = {
  args: {
    children: <GithubIcon />,
    className: '',
    href: 'https://github.com',
    withIcon: true,
  },
}

/**
 * Multiple external links in a row
 */
export const Multiple: Story = {
  args: {
    className: '',
  },
  render: (args) => (
    <div className="flex gap-4">
      <ExternalLink className={args.className} href="https://github.com">
        GitHub
      </ExternalLink>
      <ExternalLink className={args.className} href="https://twitter.com">
        Twitter
      </ExternalLink>
      <ExternalLink className={args.className} href="https://linkedin.com">
        LinkedIn
      </ExternalLink>
    </div>
  ),
}

/**
 * Icon links grouped together
 */
export const IconGroup: Story = {
  args: {
    className: '',
  },
  render: (args) => (
    <div className="flex gap-2">
      <ExternalLink href="https://github.com" withIcon {...args}>
        <GithubIcon size={20} />
      </ExternalLink>
      <ExternalLink href="https://twitter.com" withIcon {...args}>
        <GithubIcon size={20} />
      </ExternalLink>
    </div>
  ),
}
