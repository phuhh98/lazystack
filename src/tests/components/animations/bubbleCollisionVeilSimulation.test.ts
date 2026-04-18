import { describe, expect, it } from 'vitest'

import type { SimulationBlob } from '@/components/animations/bubbleCollisionVeilSimulation'

import {
  applyOversizeRule,
  DEFAULT_BLOB_POLICY,
  extendLifeOnMerge,
  findCollisionPairs,
  getMergedRadius,
  getMergeSurvivor,
} from '@/components/animations/bubbleCollisionVeilSimulation'

function createBlob(partial: Partial<SimulationBlob>): SimulationBlob {
  const bodyId = partial.bodyId ?? null

  return {
    bornAtMs: 0,
    color: 0xffaa33,
    fadeWindowMs: 2_000,
    id: `blob-${Math.random().toString(36).slice(2)}`,
    lifeDurationMs: 10_000,
    mergeFromRadius: null,
    mergeStartedAtMs: null,
    mergeUntilMs: null,
    oversizeExcluded: false,
    radius: 20,
    vx: 0.05,
    vy: 0,
    x: 100,
    y: 100,
    ...partial,
    bodyId,
  }
}

describe('bubbleCollisionVeilSimulation', () => {
  it('conserves sphere volume when computing merged radius', () => {
    const mergedRadius = getMergedRadius(20, 30)
    const mergedVolume = mergedRadius ** 3
    const originalVolume = 20 ** 3 + 30 ** 3

    expect(mergedVolume).toBeCloseTo(originalVolume, 8)
  })

  it('keeps larger blob as merge survivor', () => {
    const smaller = createBlob({ id: 'small', radius: 25 })
    const larger = createBlob({ id: 'large', radius: 36 })

    const result = getMergeSurvivor({
      first: smaller,
      second: larger,
    })

    expect(result.survivor.id).toBe('large')
    expect(result.consumed.id).toBe('small')
  })

  it('extends lifecycle using combined remaining life with cap', () => {
    const lifecycle = {
      ...DEFAULT_BLOB_POLICY,
      baseLifeMs: 10_000,
      maxExtendedLifeFactor: 1.6,
      remainingLifeBoost: 1.3,
    }

    const survivor = createBlob({ bornAtMs: 0, lifeDurationMs: 10_000, radius: 32 })
    const consumed = createBlob({ bornAtMs: 2_000, lifeDurationMs: 10_000, radius: 22 })
    const nowMs = 4_000

    const extendedLife = extendLifeOnMerge({
      consumed,
      lifecycle,
      nowMs,
      survivor,
    })

    expect(extendedLife).toBe(16_000)
  })

  it('marks oversized merged blobs as excluded from collision counting', () => {
    const oversized = applyOversizeRule({
      blob: createBlob({ radius: 170 }),
      bounds: {
        height: 100,
        width: 120,
      },
      lifecycle: DEFAULT_BLOB_POLICY,
    })

    expect(oversized.oversizeExcluded).toBe(true)
  })

  it('ignores oversize-excluded blobs in collision detection', () => {
    const excluded = createBlob({
      id: 'excluded',
      oversizeExcluded: true,
      radius: 60,
      x: 100,
      y: 100,
    })
    const first = createBlob({
      id: 'first',
      radius: 50,
      x: 100,
      y: 100,
    })
    const second = createBlob({
      id: 'second',
      radius: 50,
      x: 160,
      y: 100,
    })

    const pairs = findCollisionPairs([excluded, first, second])

    expect(pairs).toHaveLength(1)
    expect(pairs[0]).toStrictEqual({
      firstIndex: 1,
      secondIndex: 2,
    })
  })
})
