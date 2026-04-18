import { Form, Input } from '@base-ui/react'
import { Check, Copy, Play, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { GamePhase, StoryItem } from '@/hooks/usePlanningPoker'

import Button from '@/components/basic/Button'
import Container from '@/components/basic/Container'
import Typography from '@/components/basic/Typography'
import { cn } from '@/lib/utils/styles'

type FormSubmitEvent = Parameters<NonNullable<React.ComponentProps<'form'>['onSubmit']>>[0]

interface StorySidebarProps {
  readonly onAdd: (title: string) => void
  readonly onlineCount: number
  readonly onMove: (fromId: string, toId: string) => void
  readonly onRemove: (id: string) => void
  readonly onSelectStory: (storyId: string, title: string) => void
  readonly phase: GamePhase
  readonly roomId: string
  readonly storyList: StoryItem[]
}

export default function StorySidebar({
  onAdd,
  onlineCount,
  onMove,
  onRemove,
  onSelectStory,
  phase,
  roomId,
  storyList,
}: StorySidebarProps) {
  const [input, setInput] = useState('')
  const [dragOverId, setDragOverId] = useState<null | string>(null)
  const [copied, setCopied] = useState(false)

  const canSelect = phase === 'lobby' || phase === 'revealed'

  function handleAdd(e: FormSubmitEvent) {
    e.preventDefault()
    if (!input.trim()) return

    onAdd(input.trim())
    setInput('')
  }

  function handleCopy() {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Container
      as="aside"
      className="border-border flex w-56 shrink-0 flex-col gap-2 overflow-hidden border-r p-3"
      disableDefaultClasses
    >
      <Container as="div" className="shrink-0" disableDefaultClasses>
        <Typography as="p" className="island-kicker mb-1">
          Room
        </Typography>
        <Container as="div" className="flex items-center gap-1.5" disableDefaultClasses>
          <Typography as="span" className="text-ink font-mono text-sm font-semibold">
            {roomId}
          </Typography>
          <Button
            className={cn(
              'rounded p-0.5',
              copied ? 'text-success hover:text-success' : 'text-ink-muted hover:text-ink',
            )}
            onClick={handleCopy}
            title="Copy room code"
            type="button"
            variant="outline"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
          </Button>
          <Typography as="span" className="text-ink-muted flex items-center gap-1 text-xs">
            <span className="bg-success h-1.5 w-1.5 rounded-full" />
            {onlineCount}
          </Typography>
        </Container>
      </Container>

      <Container as="div" className="border-border my-1 border-t" disableDefaultClasses />

      <Typography as="p" className="island-kicker shrink-0">
        Story List
      </Typography>
      <Form className="flex shrink-0 gap-1.5" onSubmit={handleAdd}>
        <Input
          className="border-border bg-bg-surface text-ink placeholder:text-ink-muted focus:border-primary min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add story…"
          type="text"
          value={input}
        />
        <Button
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg p-0"
          disabled={!input.trim()}
          title="Add story"
          type="submit"
        >
          <Plus size={13} />
        </Button>
      </Form>

      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {storyList.length === 0 ? (
          <li className="text-ink-muted py-2 text-xs">No stories yet.</li>
        ) : (
          storyList.map((story) => {
            const isDragOver = dragOverId === story.id
            return (
              <li
                className={cn(
                  'flex items-center gap-1 rounded-lg border px-2 py-1.5 transition-colors',
                  getStoryItemClasses(isDragOver, story.estimatedVote),
                  story.estimatedVote ? 'cursor-default' : 'cursor-grab',
                )}
                draggable={!story.estimatedVote}
                key={story.id}
                onDragEnd={() => setDragOverId(null)}
                onDragLeave={() => setDragOverId(null)}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverId(story.id)
                }}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', story.id)
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOverId(null)
                  const fromId = e.dataTransfer.getData('text/plain')
                  if (fromId && fromId !== story.id) {
                    onMove(fromId, story.id)
                  }
                }}
              >
                <Typography as="span" className="text-ink flex-1 truncate text-xs" title={story.title}>
                  {story.title}
                </Typography>
                {story.estimatedVote ? (
                  <Typography
                    as="span"
                    className="bg-primary shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
                  >
                    {story.estimatedVote}
                  </Typography>
                ) : (
                  <Container as="div" className="flex shrink-0 items-center gap-0.5" disableDefaultClasses>
                    {canSelect && (
                      <Button
                        className="flex h-5 w-5 items-center justify-center rounded p-0 hover:opacity-80"
                        onClick={() => onSelectStory(story.id, story.title)}
                        title="Select this story"
                        type="button"
                      >
                        <Play fill="currentColor" size={9} />
                      </Button>
                    )}
                    <Button
                      className="text-ink-muted rounded p-0.5 hover:text-red-500"
                      onClick={() => onRemove(story.id)}
                      type="button"
                      variant="outline"
                    >
                      <Trash2 size={11} />
                    </Button>
                  </Container>
                )}
              </li>
            )
          })
        )}
      </ul>
    </Container>
  )
}

function getStoryItemClasses(isDragOver: boolean, estimatedVote?: string) {
  if (isDragOver) {
    return 'bg-primary/10 border-primary'
  }

  if (estimatedVote) {
    return 'bg-primary/5 border-primary'
  }

  return 'bg-bg-surface border-border'
}
