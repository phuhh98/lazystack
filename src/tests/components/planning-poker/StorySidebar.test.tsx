import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { StoryItem } from '@/hooks/usePlanningPoker'

import StorySidebar from '@/components/planning-poker/StorySidebar'

const defaultStoryList: StoryItem[] = [
  {
    id: 's-1',
    title: 'Set up auth flow',
  },
]

describe('StorySidebar Component', () => {
  it('adds a story when pressing Enter in add input', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()

    render(
      <StorySidebar
        onAdd={onAdd}
        onlineCount={3}
        onMove={() => {}}
        onRemove={() => {}}
        onSelectStory={() => {}}
        phase="lobby"
        roomId="ROOM42"
        storyList={defaultStoryList}
      />,
    )

    const input = screen.getByPlaceholderText('Add story…')
    await user.type(input, '  Improve build caching  {Enter}')

    expect(onAdd).toHaveBeenCalledWith('Improve build caching')
    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('')
  })

  it('adds a story when clicking submit button', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()

    render(
      <StorySidebar
        onAdd={onAdd}
        onlineCount={2}
        onMove={() => {}}
        onRemove={() => {}}
        onSelectStory={() => {}}
        phase="revealed"
        roomId="ROOM99"
        storyList={defaultStoryList}
      />,
    )

    const input = screen.getByPlaceholderText('Add story…')
    await user.type(input, 'Rate limit middleware')
    await user.click(screen.getByTitle('Add story'))

    expect(onAdd).toHaveBeenCalledWith('Rate limit middleware')
    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('')
  })
})
