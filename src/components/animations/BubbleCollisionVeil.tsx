import type { Graphics } from 'pixi.js'

import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils/styles'

import type { BlobLifecyclePolicy, SimulationBlob, SimulationBounds } from './bubbleCollisionVeilSimulation'

import {
  applyOversizeRule,
  bindBlobToPhysics,
  clamp,
  createMergedBlob,
  createPhysicsWorld,
  createSimulationBlob,
  DEFAULT_BLOB_POLICY,
  destroyPhysicsWorld,
  detachBlobFromPhysics,
  findCollisionPairsFromWorld,
  getBlobAlpha,
  getDisplayRadius,
  getMergeSurvivor,
  isBlobExpired,
  lerp,
  randomBetween,
  stepPhysicsWorld,
  syncBlobsFromPhysics,
  updatePhysicsWorldBounds,
} from './bubbleCollisionVeilSimulation'

interface BubbleCollisionVeilProps {
  className?: string
  initBlobCount?: number
  maxLifeMs?: number
  minLifeMs?: number
  opacity?: number
  overscan?: number
  paused?: boolean
  speed?: number
}

interface DrawBounds extends SimulationBounds {
  originX: number
  originY: number
  visibleHeight: number
  visibleWidth: number
}

interface Palette {
  blobColors: number[]
  smoke: number
}

function BubbleCollisionVeil(props: Readonly<BubbleCollisionVeilProps>) {
  const { className, initBlobCount = 11, opacity = 0.42, overscan = 1.45, paused = false, speed = 1 } = props
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const isJsdom = /jsdom/i.test(globalThis.navigator.userAgent)

    if (paused || isJsdom) {
      return undefined
    }

    let disposed = false
    let cleanup: (() => void) | undefined

    const boot = async () => {
      const host = hostRef.current
      if (host === null) {
        return
      }

      const pixi = await import('pixi.js')

      const app = new pixi.Application()
      await app.init({
        antialias: true,
        autoDensity: true,
        backgroundAlpha: 0,
        preference: 'webgl',
      })

      if (disposed) {
        app.destroy(true)
        return
      }

      app.canvas.className = 'h-full w-full'
      host.appendChild(app.canvas)

      const graphics = new pixi.Graphics()
      app.stage.addChild(graphics)

      const lifecyclePolicy: BlobLifecyclePolicy = {
        ...DEFAULT_BLOB_POLICY,
        baseLifeMs: 10_000,
        fadeWindowMs: 2_400,
      }
      const speedPxPerMs = Math.max(0.15, speed) * 0.05
      const overscanScale = Math.max(1, overscan)
      const reduceMotionQuery = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
      let palette = readPalette()
      const initialCount = Math.max(1, Math.round(initBlobCount))
      const populationMin = Math.max(1, Math.floor(initialCount * 0.7))
      const populationMax = Math.max(populationMin, Math.ceil(initialCount * 1.3))
      let populationTarget = initialCount
      let nextPopulationAdjustmentAtMs = performance.now() + randomBetween(380, 960)
      let lastFrameMs = performance.now()
      let nextBlobId = 0

      const boundsFromRenderer = (): DrawBounds => {
        const width = app.renderer.width
        const height = app.renderer.height
        const simulationWidth = width * overscanScale
        const simulationHeight = height * overscanScale
        return {
          height: simulationHeight,
          originX: (width - simulationWidth) / 2,
          originY: (height - simulationHeight) / 2,
          visibleHeight: height,
          visibleWidth: width,
          width: simulationWidth,
        }
      }

      const pickBlobColor = () => {
        const colorCount = palette.blobColors.length
        if (colorCount === 0) {
          return palette.smoke
        }
        const colorIndex = Math.floor(randomBetween(0, colorCount))
        return palette.blobColors[colorIndex] ?? palette.smoke
      }

      const spawnBlob = (nowMs: number, bounds: DrawBounds): SimulationBlob =>
        createSimulationBlob({
          bounds,
          color: pickBlobColor(),
          engine: physicsWorld.engine,
          id: `blob-${nextBlobId++}`,
          lifecycle: lifecyclePolicy,
          nowMs,
          speedPxPerMs,
        })

      const blobs: SimulationBlob[] = []
      const seedBounds = boundsFromRenderer()
      const physicsWorld = createPhysicsWorld(seedBounds)
      for (let index = 0; index < initialCount; index += 1) {
        blobs.push(spawnBlob(performance.now(), seedBounds))
      }

      const resize = () => {
        const width = Math.max(1, Math.floor(host.clientWidth))
        const height = Math.max(1, Math.floor(host.clientHeight))
        app.renderer.resize(width, height)
        updatePhysicsWorldBounds({
          bounds: boundsFromRenderer(),
          physicsWorld,
        })
      }

      const draw = (nowMs: number) => {
        const bounds = boundsFromRenderer()
        const deltaMs = clamp(nowMs - lastFrameMs, 0, 80)
        lastFrameMs = nowMs

        stepPhysicsWorld({
          blobs,
          deltaMs,
          physicsWorld,
          speedPxPerMs,
        })
        syncBlobsFromPhysics({ blobs, physicsWorld })
        settleMergeAnimations(blobs, nowMs)

        if (nowMs >= nextPopulationAdjustmentAtMs) {
          populationTarget = Math.round(randomBetween(populationMin, populationMax + 0.999))
          randomizePopulation({
            blobs,
            bounds,
            nowMs,
            populationTarget,
            spawnBlob,
          })
          nextPopulationAdjustmentAtMs = nowMs + randomBetween(260, 920)
        }

        resolveCollisions({ blobs, bounds, lifecyclePolicy, nowMs, physicsWorld, speedPxPerMs })
        removeExpiredBlobs({ blobs, nowMs, physicsWorld })

        if (blobs.length < populationMin) {
          blobs.push(spawnBlob(nowMs, bounds))
        }

        const width = app.renderer.width
        const height = app.renderer.height

        graphics.clear()

        graphics.circle(width * 0.5, height * 0.57, Math.max(bounds.width, bounds.height) * 0.54).fill({
          alpha: opacity * 0.12,
          color: palette.smoke,
        })

        for (const blob of blobs) {
          const blobAlpha = getBlobAlpha(blob, nowMs)
          if (blobAlpha <= 0) {
            continue
          }

          const radius = getDisplayRadius(blob, nowMs)
          drawGlossyBlob({
            alpha: opacity * blobAlpha,
            color: blob.color,
            graphics,
            radius,
            x: bounds.originX + blob.x,
            y: bounds.originY + blob.y,
          })
        }
      }

      const applyPlayback = () => {
        if (reduceMotionQuery.matches) {
          app.ticker.stop()
          draw(performance.now())
          return
        }

        app.ticker.start()
      }

      const renderFrame = () => {
        draw(performance.now())
      }

      const handleThemeChange = () => {
        palette = readPalette()
        for (let index = 0; index < blobs.length; index += 1) {
          const blob = blobs[index]
          blobs[index] = {
            ...blob,
            color: pickBlobColor(),
          }
        }
      }

      resize()
      app.ticker.add(renderFrame)

      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(host)

      const themeObserver = new MutationObserver(handleThemeChange)
      themeObserver.observe(document.documentElement, {
        attributeFilter: ['class', 'data-theme', 'style'],
        attributes: true,
      })

      reduceMotionQuery.addEventListener('change', applyPlayback)
      applyPlayback()

      const animationFrame = globalThis.requestAnimationFrame(() => {
        draw(performance.now())
      })

      cleanup = () => {
        globalThis.cancelAnimationFrame(animationFrame)
        reduceMotionQuery.removeEventListener('change', applyPlayback)
        themeObserver.disconnect()
        resizeObserver.disconnect()
        app.ticker.remove(renderFrame)
        for (const blob of blobs) {
          detachBlobFromPhysics({ blob, physicsWorld })
        }
        destroyPhysicsWorld(physicsWorld)
        app.destroy(true)
      }
    }

    void boot()

    return () => {
      disposed = true
      cleanup?.()
      cleanup = undefined
    }
  }, [initBlobCount, opacity, overscan, paused, speed])

  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="h-full w-full" ref={hostRef} />
    </div>
  )
}

function drawGlossyBlob(params: {
  alpha: number
  color: number
  graphics: Graphics
  radius: number
  x: number
  y: number
}): void {
  const { alpha, color, graphics, radius, x, y } = params

  const shadowColor = mixColors(color, 0x000000, 0.42)
  const coreColor = mixColors(color, 0xffffff, 0.2)
  const glowColor = mixColors(color, 0xffffff, 0.72)

  graphics.circle(x + radius * 0.22, y + radius * 0.2, radius * 1.02).fill({
    alpha: alpha * 0.22,
    color: shadowColor,
  })

  for (let layer = 0; layer < 8; layer += 1) {
    const ringProgress = layer / 7
    const ringRadius = radius * (1 - ringProgress * 0.16)
    const ringColor = mixColors(coreColor, color, ringProgress * 0.8)
    const ringAlpha = alpha * lerp(0.58, 0.12, ringProgress)

    graphics.circle(x - radius * 0.03 * ringProgress, y - radius * 0.02 * ringProgress, ringRadius).fill({
      alpha: ringAlpha,
      color: ringColor,
    })
  }

  for (let highlight = 0; highlight < 5; highlight += 1) {
    const highlightProgress = highlight / 4
    graphics
      .circle(
        x - radius * lerp(0.29, 0.16, highlightProgress),
        y - radius * lerp(0.34, 0.21, highlightProgress),
        radius * lerp(0.46, 0.18, highlightProgress),
      )
      .fill({
        alpha: alpha * lerp(0.24, 0.05, highlightProgress),
        color: mixColors(glowColor, color, highlightProgress * 0.45),
      })
  }
}

function mixColors(base: number, target: number, amount: number): number {
  const ratio = Math.min(1, Math.max(0, amount))

  const baseR = (base >> 16) & 0xff
  const baseG = (base >> 8) & 0xff
  const baseB = base & 0xff

  const targetR = (target >> 16) & 0xff
  const targetG = (target >> 8) & 0xff
  const targetB = target & 0xff

  const r = Math.round(lerp(baseR, targetR, ratio))
  const g = Math.round(lerp(baseG, targetG, ratio))
  const b = Math.round(lerp(baseB, targetB, ratio))

  return (r << 16) + (g << 8) + b
}

function randomizePopulation(params: {
  blobs: SimulationBlob[]
  bounds: DrawBounds
  nowMs: number
  populationTarget: number
  spawnBlob: (nowMs: number, bounds: DrawBounds) => SimulationBlob
}): void {
  const { blobs, bounds, nowMs, populationTarget, spawnBlob } = params

  if (blobs.length < populationTarget) {
    blobs.push(spawnBlob(nowMs, bounds))
    return
  }

  if (blobs.length <= populationTarget) {
    return
  }

  const candidateIndex = blobs.findIndex((blob) => blob.mergeUntilMs === null)
  const retiringIndex = Math.max(0, candidateIndex)
  const retiringBlob = blobs[retiringIndex]

  const elapsedMs = Math.max(0, nowMs - retiringBlob.bornAtMs)
  blobs[retiringIndex] = {
    ...retiringBlob,
    fadeWindowMs: Math.min(retiringBlob.fadeWindowMs, 800),
    lifeDurationMs: Math.min(retiringBlob.lifeDurationMs, elapsedMs + 900),
  }
}

function readPalette(): Palette {
  const styles = globalThis.getComputedStyle(document.documentElement)

  const warmColorVariables = [
    '--color-amber-earth-200',
    '--color-amber-earth-300',
    '--color-amber-earth-400',
    '--color-amber-earth-500',
    '--color-amber-earth-600',
    '--color-amber-earth-700',
    '--color-rich-mahogany-300',
    '--color-rich-mahogany-400',
    '--color-rich-mahogany-500',
    '--color-blood-red-300',
    '--color-blood-red-400',
  ]

  const warmFallbacks = [
    0xfbdeb1, 0xfacd8a, 0xf8bc63, 0xf6ac3c, 0xf49b15, 0xd5840a, 0xf84f53, 0xf50f16, 0xbf080d, 0xf47173, 0xf14144,
  ]

  const blobColors = warmColorVariables.map((variable, index) => {
    const fallback = warmFallbacks[index] ?? warmFallbacks[0]
    return toPixiColor(styles.getPropertyValue(variable).trim(), fallback)
  })

  return {
    blobColors,
    smoke: toPixiColor(styles.getPropertyValue('--ink').trim(), 0x492d03),
  }
}

function removeExpiredBlobs(params: {
  blobs: SimulationBlob[]
  nowMs: number
  physicsWorld: ReturnType<typeof createPhysicsWorld>
}): void {
  const { blobs, nowMs, physicsWorld } = params
  const living: SimulationBlob[] = []
  for (const blob of blobs) {
    if (isBlobExpired(blob, nowMs)) {
      detachBlobFromPhysics({ blob, physicsWorld })
      continue
    }

    living.push(blob)
  }

  if (living.length !== blobs.length) {
    blobs.splice(0, blobs.length, ...living)
  }
}

function resolveCollisions(params: {
  blobs: SimulationBlob[]
  bounds: DrawBounds
  lifecyclePolicy: BlobLifecyclePolicy
  nowMs: number
  physicsWorld: ReturnType<typeof createPhysicsWorld>
  speedPxPerMs: number
}): void {
  const { blobs, bounds, lifecyclePolicy, nowMs, physicsWorld, speedPxPerMs } = params
  const collisionPairs = findCollisionPairsFromWorld({ blobs, physicsWorld })
  if (collisionPairs.length === 0) {
    return
  }

  const consumedBlobIds = new Set<string>()
  const resolvedBlobIds = new Set<string>()

  for (const pair of collisionPairs) {
    const first = blobs[pair.firstIndex]
    const second = blobs[pair.secondIndex]
    if (
      consumedBlobIds.has(first.id) ||
      consumedBlobIds.has(second.id) ||
      resolvedBlobIds.has(first.id) ||
      resolvedBlobIds.has(second.id)
    ) {
      continue
    }

    const { consumed, survivor } = getMergeSurvivor({ first, second })
    const mergedBlobWithPolicy = applyOversizeRule({
      blob: createMergedBlob({
        consumed,
        lifecycle: lifecyclePolicy,
        nowMs,
        speedPxPerMs,
        survivor,
      }),
      bounds,
      lifecycle: lifecyclePolicy,
    })
    detachBlobFromPhysics({ blob: survivor, physicsWorld })
    detachBlobFromPhysics({ blob: consumed, physicsWorld })

    const mergedBlob = bindBlobToPhysics({
      blob: mergedBlobWithPolicy,
      bounds,
      physicsWorld,
      speedPxPerMs,
    })

    if (survivor.id === first.id) {
      blobs[pair.firstIndex] = mergedBlob
    } else {
      blobs[pair.secondIndex] = mergedBlob
    }

    consumedBlobIds.add(consumed.id)
    resolvedBlobIds.add(consumed.id)
    resolvedBlobIds.add(survivor.id)
  }

  if (consumedBlobIds.size === 0) {
    return
  }

  const surviving: SimulationBlob[] = []
  for (const blob of blobs) {
    if (!consumedBlobIds.has(blob.id)) {
      surviving.push(blob)
    }
  }
  blobs.splice(0, blobs.length, ...surviving)
}

function settleMergeAnimations(blobs: SimulationBlob[], nowMs: number): void {
  for (let index = 0; index < blobs.length; index += 1) {
    const blob = blobs[index]
    if (blob.mergeUntilMs === null || nowMs < blob.mergeUntilMs) {
      continue
    }

    blobs[index] = {
      ...blob,
      mergeFromRadius: null,
      mergeStartedAtMs: null,
      mergeUntilMs: null,
    }
  }
}

function toPixiColor(input: string, fallback: number): number {
  if (!input) {
    return fallback
  }

  const normalized = input.trim().toLowerCase()
  if (normalized.startsWith('#')) {
    const rawHex = normalized.slice(1)
    const expandedHex =
      rawHex.length === 3
        ? rawHex
            .split('')
            .map((char) => `${char}${char}`)
            .join('')
        : rawHex
    const numeric = Number.parseInt(expandedHex, 16)

    return Number.isNaN(numeric) ? fallback : numeric
  }

  const rgbPattern = /rgba?\((\d+),\s*(\d+),\s*(\d+)/
  const rgbMatch = rgbPattern.exec(normalized)
  if (!rgbMatch) {
    return fallback
  }

  const [, r, g, b] = rgbMatch
  const red = Number.parseInt(r, 10)
  const green = Number.parseInt(g, 10)
  const blue = Number.parseInt(b, 10)

  return (red << 16) + (green << 8) + blue
}
export default BubbleCollisionVeil
