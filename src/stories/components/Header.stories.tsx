import type { Meta, StoryObj } from '@storybook/react-vite'

import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router'

import Header from '../../components/Header'

const rootRoute = createRootRoute({
  component: Header,
})

const router = createRouter({
  history: createMemoryHistory(),
  routeTree: rootRoute,
})

const meta: Meta<typeof Header> = {
  component: Header,
  decorators: [
    (Story) => (
      <RouterProvider router={router}>
        <div style={{ background: 'var(--bg-base)', minHeight: '400px' }}>
          <Story />
        </div>
      </RouterProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Layout/Header',
}

export default meta
type Story = StoryObj<typeof Header>

/**
 * Default header component showing the LazyStack branding, navigation links,
 * and theme toggle. The header is sticky and appears at the top of the page.
 */
export const Default: Story = {}
