import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '../../components/Header'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: Header,
})

const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory(),
})

describe('Header Component', () => {
  it('renders header with logo', () => {
    render(
      <RouterProvider router={router}>
        <Header />
      </RouterProvider>,
    )
    expect(screen.getByText('LazyStack')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <RouterProvider router={router}>
        <Header />
      </RouterProvider>,
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Planning Poker')).toBeInTheDocument()
  })

  it('renders theme toggle button', () => {
    render(
      <RouterProvider router={router}>
        <Header />
      </RouterProvider>,
    )
    const themeButton = screen.getByRole('button', { name: /light|dark|auto/i })
    expect(themeButton).toBeInTheDocument()
  })

  it('has sticky positioning', () => {
    const { container } = render(
      <RouterProvider router={router}>
        <Header />
      </RouterProvider>,
    )
    const header = container.querySelector('header')
    expect(header).toHaveClass('sticky', 'top-0', 'z-50')
  })

  it('has proper styling classes', () => {
    const { container } = render(
      <RouterProvider router={router}>
        <Header />
      </RouterProvider>,
    )
    const header = container.querySelector('header')
    expect(header).toHaveClass('border-b', 'backdrop-blur-lg')
  })
})
