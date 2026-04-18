import { Pencil, Trophy } from 'lucide-react'

import type { StoryItem } from '@/hooks/usePlanningPoker'

import IslandShell from '@/components/basic/IslandShell'
import SetCardValuePopover from '@/components/planning-poker/SetCardValuePopover'

interface SessionDashboardProps {
  readonly isModerator: boolean
  readonly onSetEstimate: (storyId: string, vote: string) => void
  readonly storyList: StoryItem[]
}

export default function SessionDashboard({ isModerator, onSetEstimate, storyList }: SessionDashboardProps) {
  const completed = storyList.filter((s) => s.estimatedVote)
  const numeric = completed.map((s) => Number.parseInt(s.estimatedVote!, 10)).filter((n) => !Number.isNaN(n))
  const avg = numeric.length > 0 ? numeric.reduce((a, b) => a + b, 0) / numeric.length : null

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="flex items-center gap-3">
        <Trophy size={24} style={{ color: 'var(--primary)' }} />
        <h2 className="display-title text-2xl font-bold" style={{ color: 'var(--ink)' }}>
          Session Complete
        </h2>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <IslandShell className="rounded-2xl px-5 py-3 text-center" style={{ minWidth: '120px' }}>
          <p className="island-kicker mb-1">Total</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
            {storyList.length}
          </p>
        </IslandShell>
        <IslandShell className="rounded-2xl px-5 py-3 text-center" style={{ minWidth: '120px' }}>
          <p className="island-kicker mb-1">Estimated</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
            {completed.length}
          </p>
        </IslandShell>
        {avg !== null && (
          <IslandShell className="rounded-2xl px-5 py-3 text-center" style={{ minWidth: '120px' }}>
            <p className="island-kicker mb-1">Avg</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
              {avg % 1 === 0 ? avg : avg.toFixed(1)}
            </p>
          </IslandShell>
        )}
      </div>

      {/* Stories table */}
      {storyList.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
          No stories were tracked this session.
        </p>
      ) : (
        <IslandShell className="overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="px-5 py-3 text-left font-semibold" style={{ color: 'var(--ink-muted)' }}>
                  Story
                </th>
                <th className="px-5 py-3 text-center font-semibold" style={{ color: 'var(--ink-muted)' }}>
                  Estimate
                </th>
                {isModerator && <th className="w-12 px-5 py-3" />}
              </tr>
            </thead>
            <tbody>
              {storyList.map((story, idx) => (
                <tr
                  key={story.id}
                  style={{
                    background: idx % 2 === 1 ? 'rgba(204,136,83,0.02)' : 'transparent',
                    borderBottom: idx < storyList.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <td className="px-5 py-3" style={{ color: 'var(--ink)' }}>
                    {story.title}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {story.estimatedVote ? (
                      <span
                        className="inline-block rounded-full px-3 py-0.5 text-xs font-bold text-white"
                        style={{ background: 'var(--primary)' }}
                      >
                        {story.estimatedVote}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--ink-muted)' }}>—</span>
                    )}
                  </td>
                  {isModerator && (
                    <td className="px-5 py-3 text-center">
                      <SetCardValuePopover
                        currentValue={story.estimatedVote ?? null}
                        onSelectValue={(value) => onSetEstimate(story.id, value)}
                        title="Set estimate"
                        triggerAriaLabel="Edit estimate"
                        triggerClassName="text-ink-muted"
                        triggerTitle="Edit estimate"
                      >
                        <Pencil size={14} />
                      </SetCardValuePopover>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </IslandShell>
      )}
    </div>
  )
}
