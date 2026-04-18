import { Collapsible } from '@base-ui/react'
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { StoryItem } from '@/hooks/usePlanningPoker'

import { ISLAND_SHELL_CLASSNAME } from '@/components/basic/IslandShell'
import { cn } from '@/lib/utils/styles'

interface StoryPresetPanelProps {
  disabled?: boolean
  onAdd: (title: string) => void
  onRemove: (id: string) => void
  onReorder: (id: string, dir: 'down' | 'up') => void
  storyList: StoryItem[]
}

export default function StoryPresetPanel({ disabled, onAdd, onRemove, onReorder, storyList }: StoryPresetPanelProps) {
  const [input, setInput] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onAdd(input.trim())
    setInput('')
  }

  return (
    <Collapsible.Root className={cn(ISLAND_SHELL_CLASSNAME, 'rounded-2xl')}>
      <Collapsible.Trigger
        className="flex w-full items-center justify-between gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
        style={{ color: 'var(--ink)' }}
      >
        <span className="island-kicker">Story List {storyList.length > 0 ? `(${storyList.length})` : ''}</span>
        <ChevronDown
          className="transition-transform duration-200 [[data-open]_&]:rotate-180"
          size={16}
          style={{ color: 'var(--ink-muted)' }}
        />
      </Collapsible.Trigger>

      <Collapsible.Panel className="px-5 pb-4">
        {/* Add form */}
        <form className="mb-3 flex gap-2" onSubmit={handleAdd}>
          <input
            className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
            disabled={disabled}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a story or task…"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--ink)',
            }}
            type="text"
            value={input}
          />
          <button
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled || !input.trim()}
            style={{
              background: 'var(--primary)',
              color: 'white',
            }}
            title="Add story"
            type="submit"
          >
            <Plus size={16} />
          </button>
        </form>

        {/* Story list */}
        {storyList.length === 0 ? (
          <p className="py-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
            No stories yet. Add one above.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {storyList.map((story, idx) => (
              <li
                className="flex items-center gap-2 rounded-xl border px-3 py-2"
                key={story.id}
                style={{
                  background: story.estimatedVote ? 'rgba(204,136,83,0.06)' : 'var(--surface)',
                  borderColor: story.estimatedVote ? 'var(--primary)' : 'var(--border)',
                }}
              >
                <span className="flex-1 truncate text-sm" style={{ color: 'var(--ink)' }}>
                  {story.title}
                </span>
                {story.estimatedVote && (
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                    }}
                  >
                    {story.estimatedVote}
                  </span>
                )}
                {!story.estimatedVote && (
                  <div className="flex items-center gap-1">
                    <button
                      className="rounded p-1 transition-colors disabled:opacity-30"
                      disabled={disabled || idx === 0}
                      onClick={() => onReorder(story.id, 'up')}
                      style={{ color: 'var(--ink-muted)' }}
                      title="Move up"
                      type="button"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      className="rounded p-1 transition-colors disabled:opacity-30"
                      disabled={disabled || idx === storyList.length - 1}
                      onClick={() => onReorder(story.id, 'down')}
                      style={{ color: 'var(--ink-muted)' }}
                      title="Move down"
                      type="button"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      className="rounded p-1 transition-colors hover:text-red-500 disabled:opacity-30"
                      disabled={disabled}
                      onClick={() => onRemove(story.id)}
                      style={{ color: 'var(--ink-muted)' }}
                      title="Remove story"
                      type="button"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Collapsible.Panel>
    </Collapsible.Root>
  )
}
