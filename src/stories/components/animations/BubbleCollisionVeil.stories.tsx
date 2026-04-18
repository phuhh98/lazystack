import type { Meta, StoryObj } from '@storybook/react-vite'

import BubbleCollisionVeil from '@/components/animations/BubbleCollisionVeil'

const meta: Meta<typeof BubbleCollisionVeil> = {
  args: {
    initBlobCount: 11,
    opacity: 0.35,
    speed: 1,
  },
  component: BubbleCollisionVeil,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'Animations/BubbleCollisionVeil',
}

export default meta
type Story = StoryObj<typeof BubbleCollisionVeil>

export const HeroOverlay: Story = {
  render: (args) => (
    <section className="border-border bg-bg-surface relative mx-auto my-12 w-[min(920px,calc(100%-2rem))] overflow-hidden rounded-4xl border p-10">
      <BubbleCollisionVeil {...args} />
      <div className="text-ink relative z-10 max-w-2xl space-y-4">
        <p className="island-kicker">Decorative Layer</p>
        <h2 className="display-title text-4xl sm:text-5xl">Magma Veil</h2>
        <p className="text-ink-muted text-sm sm:text-base">
          A reusable PixiJS veil that fills its parent container while preserving child interaction and layout behavior.
        </p>
        <button
          className="border-border inline-flex rounded-full border bg-white/60 px-4 py-2 text-sm font-semibold"
          type="button"
        >
          Foreground action remains clickable
        </button>
      </div>
    </section>
  ),
}

export const ReducedMotionPreview: Story = {
  args: {
    paused: true,
  },
  render: (args) => (
    <section className="border-border bg-bg-surface relative mx-auto my-12 w-[min(920px,calc(100%-2rem))] overflow-hidden rounded-4xl border p-10">
      <BubbleCollisionVeil {...args} />
      <div className="text-ink relative z-10 max-w-xl">
        <h2 className="display-title text-3xl">Paused Variant</h2>
        <p className="text-ink-muted text-sm">Use this state for reduced-motion or deterministic visual testing.</p>
      </div>
    </section>
  ),
}

export const MergeHeavy: Story = {
  args: {
    initBlobCount: 16,
    opacity: 0.4,
    speed: 1,
  },
  render: (args) => (
    <section className="border-border bg-bg-surface relative mx-auto my-12 h-105 w-[min(920px,calc(100%-2rem))] overflow-hidden rounded-4xl border p-10">
      <BubbleCollisionVeil {...args} />
      <div className="text-ink relative z-10 max-w-xl space-y-3">
        <h2 className="display-title text-3xl">Merge-heavy Simulation</h2>
        <p className="text-ink-muted text-sm">
          Higher initial density makes collisions and radius-growth easier to inspect.
        </p>
      </div>
    </section>
  ),
}

export const SlowFlow: Story = {
  args: {
    initBlobCount: 9,
    opacity: 0.32,
    speed: 1,
  },
  render: (args) => (
    <section className="border-border bg-bg-surface relative mx-auto my-12 h-95 w-[min(920px,calc(100%-2rem))] overflow-hidden rounded-4xl border p-10">
      <BubbleCollisionVeil {...args} />
      <div className="text-ink relative z-10 max-w-xl space-y-3">
        <h2 className="display-title text-3xl">Constant 0.05 Drift</h2>
        <p className="text-ink-muted text-sm">
          Blobs move at a constant slow speed and fade out at lifecycle completion.
        </p>
      </div>
    </section>
  ),
}
