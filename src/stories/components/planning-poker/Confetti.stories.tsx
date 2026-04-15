import type { Meta, StoryObj } from '@storybook/react'
import Confetti from '../../../components/planning-poker/Confetti'

const meta: Meta<typeof Confetti> = {
  title: 'PlanningPoker/Confetti',
  component: Confetti,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Confetti>

/**
 * Confetti animation that plays when a consensus is reached.
 * This is a celebratory visual effect with colored pieces falling.
 * The animation auto-dismisses after ~8.5 seconds.
 */
export const Default: Story = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Confetti />
      <div
        style={{
          background: 'var(--surface)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginTop: 0, color: 'var(--ink)' }}>
          Consensus Reached! 🎉
        </h2>
        <p style={{ color: 'var(--ink-muted)' }}>
          Watch the confetti fall above...
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The confetti automatically appears and dismisses after ~8.5 seconds. It creates a festive celebration effect when the team reaches consensus on story estimation.',
      },
    },
  },
}
