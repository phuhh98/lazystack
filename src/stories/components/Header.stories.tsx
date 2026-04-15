import type { Meta, StoryObj } from '@storybook/react'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'
import Header from '../../components/Header'

const rootRoute = createRootRoute({
  component: Header,
})

const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory(),
})

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <RouterProvider router={router}>
        <div style={{ minHeight: '400px', background: 'var(--bg-base)' }}>
          <Story />
        </div>
      </RouterProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Header>

/**
 * Default header component showing the LazyStack branding, navigation links,
 * and theme toggle. The header is sticky and appears at the top of the page.
 */
export const Default: Story = {}
