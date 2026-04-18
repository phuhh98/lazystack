import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import type { StoryItem } from '@/hooks/usePlanningPoker'

import Button from '@/components/basic/Button'
import Container from '@/components/basic/Container'
import Typography from '@/components/basic/Typography'
import { cn } from '@/lib/utils/styles'

interface ParticipantStorySidebarProps {
  readonly currentStory: string
  readonly onlineCount: number
  readonly roomId: string
  readonly storyList: StoryItem[]
}

const STORY_ITEM_CLASS_BY_STATE = {
  active: 'bg-primary/10 border-primary',
  estimated: 'bg-primary/5 border-primary',
  idle: 'bg-bg-surface border-border',
} as const

export default function ParticipantStorySidebar({
  currentStory,
  onlineCount,
  roomId,
  storyList,
}: ParticipantStorySidebarProps) {
  const [copied, setCopied] = useState(false)

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
        Stories
      </Typography>
      <ul className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {storyList.length === 0 ? (
          <li className="text-ink-muted py-2 text-xs">No stories yet.</li>
        ) : (
          storyList.map((story) => {
            const isActive = story.title === currentStory
            return (
              <li
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-2 py-1.5',
                  getStoryItemClasses(isActive, story.estimatedVote),
                )}
                key={story.id}
              >
                {isActive && <span className="bg-primary h-1.5 w-1.5 shrink-0 animate-pulse rounded-full" />}
                <Typography
                  as="span"
                  className={cn(
                    'flex-1 truncate text-xs',
                    isActive ? 'text-primary font-bold' : 'text-ink font-normal',
                  )}
                  title={story.title}
                >
                  {story.title}
                </Typography>
                {story.estimatedVote && (
                  <Typography
                    as="span"
                    className="bg-primary shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
                  >
                    {story.estimatedVote}
                  </Typography>
                )}
              </li>
            )
          })
        )}
      </ul>
    </Container>
  )
}

function getStoryItemClasses(isActive: boolean, estimatedVote?: string) {
  if (isActive) {
    return STORY_ITEM_CLASS_BY_STATE.active
  }

  return estimatedVote ? STORY_ITEM_CLASS_BY_STATE.estimated : STORY_ITEM_CLASS_BY_STATE.idle
}
