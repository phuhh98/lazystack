import type { Meta, StoryObj } from '@storybook/react'
import ExternalLink from './ExternalLink'
import GithubIcon from '@/components/brandIcons/GithubIcon'

const meta: Meta<typeof ExternalLink> = {
  title: 'Components/ExternalLink',
  component: ExternalLink,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--bg-base)' },
        { name: 'dark', value: '#0a1418' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'URL to navigate to',
    },
    target: {
      control: {
        type: 'select',
        options: ['_blank', '_self', '_parent', '_top'],
      },
      description: 'Target attribute for the link',
    },
    rel: {
      control: 'text',
      description:
        'Relationship between the current document and the linked document',
    },
    withIcon: {
      control: 'boolean',
      description: 'Whether to apply icon styling',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default external link with standard nav-link styling
 */
export const Default: Story = {
  args: {
    href: 'https://example.com',
    children: 'Visit Example',
    className: '',
  },
}

/**
 * External link with icon styling (rounded background)
 */
export const WithIcon: Story = {
  args: {
    href: 'https://github.com',
    children: <GithubIcon />,
    withIcon: true,
    className: '',
  },
}

/**
 * Multiple external links in a row
 */
export const Multiple: Story = {
  render: (args) => (
    <div className="flex gap-4">
      <ExternalLink href="https://github.com" className={args.className}>
        GitHub
      </ExternalLink>
      <ExternalLink href="https://twitter.com" className={args.className}>
        Twitter
      </ExternalLink>
      <ExternalLink href="https://linkedin.com" className={args.className}>
        LinkedIn
      </ExternalLink>
    </div>
  ),
  args: {
    className: '',
  },
}

/**
 * Icon links grouped together
 */
export const IconGroup: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <ExternalLink
        href="https://github.com"
        withIcon
        title="GitHub"
        className={args.className}
      >
        GH
      </ExternalLink>
      <ExternalLink
        href="https://twitter.com"
        withIcon
        title="Twitter"
        className={args.className}
      >
        TW
      </ExternalLink>
      <ExternalLink
        href="https://linkedin.com"
        withIcon
        title="LinkedIn"
        className={args.className}
      >
        LI
      </ExternalLink>
    </div>
  ),
  args: {
    className: '',
  },
}

/**
 * External link with custom className
 */
export const CustomStyling: Story = {
  args: {
    href: 'https://example.com',
    children: 'Custom Styled Link',
    className: 'text-red-600 font-bold underline',
  },
}

/**
 * External link with different rel attribute
 */
export const WithCustomRel: Story = {
  args: {
    href: 'https://example.com',
    children: 'Link with custom rel',
    rel: 'noopener noreferrer nofollow',
  },
}
