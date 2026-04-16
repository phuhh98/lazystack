import type { Meta, StoryObj } from '@storybook/react-vite'

import Confetti from '@/components/planning-poker/Confetti'

const meta: Meta<typeof Confetti> = {
  component: Confetti,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'PlanningPoker/Confetti',
}

export default meta
type Story = StoryObj<typeof Confetti>

/**
 * Confetti animation that plays when a consensus is reached.
 * This is a celebratory visual effect with colored pieces falling.
 * The animation auto-dismisses after ~8.5 seconds.
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The confetti automatically appears and dismisses after ~8.5 seconds. It creates a festive celebration effect when the team reaches consensus on story estimation.',
      },
    },
  },
  render: () => (
    <div
      style={{
        alignItems: 'center',
        background: 'var(--bg-base)',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Confetti />
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: 'var(--ink)', marginTop: 0 }}>Consensus Reached! 🎉</h2>
        <p style={{ color: 'var(--ink-muted)' }}>Watch the confetti fall above...</p>
      </div>
    </div>
  ),
}
