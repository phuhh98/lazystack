import { Collapsible } from '@base-ui/react'
import { ChevronDown, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { useState } from 'react'
import type { StoryItem } from '@/hooks/usePlanningPoker'

interface StoryPresetPanelProps {
  storyList: StoryItem[]
  onAdd: (title: string) => void
  onRemove: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
  disabled?: boolean
}

export default function StoryPresetPanel({
  storyList,
  onAdd,
  onRemove,
  onReorder,
  disabled,
}: StoryPresetPanelProps) {
  const [input, setInput] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onAdd(input.trim())
    setInput('')
  }

  return (
    <Collapsible.Root className="island-shell rounded-2xl">
      <Collapsible.Trigger
        className="flex w-full items-center justify-between gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
        style={{ color: 'var(--ink)' }}
      >
        <span className="island-kicker">
          Story List {storyList.length > 0 ? `(${storyList.length})` : ''}
        </span>
        <ChevronDown
          size={16}
          className="transition-transform duration-200 [[data-open]_&]:rotate-180"
          style={{ color: 'var(--ink-muted)' }}
        />
      </Collapsible.Trigger>

      <Collapsible.Panel className="px-5 pb-4">
        {/* Add form */}
        <form onSubmit={handleAdd} className="mb-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a story or task…"
            disabled={disabled}
            className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface)',
              color: 'var(--ink)',
            }}
          />
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: 'var(--primary)',
              color: 'white',
            }}
            title="Add story"
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
                key={story.id}
                className="flex items-center gap-2 rounded-xl border px-3 py-2"
                style={{
                  borderColor: story.estimatedVote ? 'var(--primary)' : 'var(--border)',
                  background: story.estimatedVote
                    ? 'rgba(204,136,83,0.06)'
                    : 'var(--surface)',
                }}
              >
                <span
                  className="flex-1 truncate text-sm"
                  style={{ color: 'var(--ink)' }}
                >
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
                      type="button"
                      onClick={() => onReorder(story.id, 'up')}
                      disabled={disabled || idx === 0}
                      className="rounded p-1 transition-colors disabled:opacity-30"
                      style={{ color: 'var(--ink-muted)' }}
                      title="Move up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onReorder(story.id, 'down')}
                      disabled={disabled || idx === storyList.length - 1}
                      className="rounded p-1 transition-colors disabled:opacity-30"
                      style={{ color: 'var(--ink-muted)' }}
                      title="Move down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(story.id)}
                      disabled={disabled}
                      className="rounded p-1 transition-colors hover:text-red-500 disabled:opacity-30"
                      style={{ color: 'var(--ink-muted)' }}
                      title="Remove story"
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
