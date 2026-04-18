import type Matter from 'matter-js'

import pkg from 'matter-js'

const { Bodies, Body, Composite, Engine, World } = pkg

export interface BlobLifecyclePolicy {
  baseLifeMs: number
  fadeWindowMs: number
  maxExtendedLifeFactor: number
  mergeAnimationMs: number
  oversizeDiameterScale: number
  remainingLifeBoost: number
}

export interface CollisionPair {
  firstIndex: number
  secondIndex: number
}

export interface PhysicsWorld {
  engine: Matter.Engine
  walls: Matter.Body[]
  wallThickness: number
}

export interface SimulationBlob {
  bodyId: null | number
  bornAtMs: number
  color: number
  fadeWindowMs: number
  id: string
  lifeDurationMs: number
  mergeFromRadius: null | number
  mergeStartedAtMs: null | number
  mergeUntilMs: null | number
  oversizeExcluded: boolean
  radius: number
  vx: number
  vy: number
  x: number
  y: number
}

export interface SimulationBounds {
  height: number
  width: number
}

const MATTER_BASE_TIMESTEP_MS = 1_000 / 60
const DEFAULT_WALL_THICKNESS = 140

export const DEFAULT_BLOB_POLICY: BlobLifecyclePolicy = {
  baseLifeMs: 10_000,
  fadeWindowMs: 2_000,
  maxExtendedLifeFactor: 1.6,
  mergeAnimationMs: 420,
  oversizeDiameterScale: 3,
  remainingLifeBoost: 1.3,
}

export function applyOversizeRule(params: {
  blob: SimulationBlob
  bounds: SimulationBounds
  lifecycle: BlobLifecyclePolicy
}): SimulationBlob {
  const { blob, bounds, lifecycle } = params
  const minDim = Math.min(bounds.width, bounds.height)
  const oversizeThreshold = minDim * lifecycle.oversizeDiameterScale

  if (blob.radius * 2 <= oversizeThreshold) {
    return blob
  }

  return {
    ...blob,
    oversizeExcluded: true,
  }
}

export function bindBlobToPhysics(params: {
  blob: SimulationBlob
  bounds: SimulationBounds
  physicsWorld: PhysicsWorld
  speedPxPerMs: number
}): SimulationBlob {
  const { blob, bounds, physicsWorld, speedPxPerMs } = params
  const minX = blob.radius
  const maxX = Math.max(minX, bounds.width - blob.radius)
  const minY = blob.radius
  const maxY = Math.max(minY, bounds.height - blob.radius)
  const clampedX = clamp(blob.x, minX, maxX)
  const clampedY = clamp(blob.y, minY, maxY)

  const body = Bodies.circle(clampedX, clampedY, blob.radius, {
    friction: 0,
    frictionAir: 0.002,
    frictionStatic: 0,
    inertia: Infinity,
    label: 'magma-blob',
    restitution: 1,
    slop: 0.01,
  })

  Body.setVelocity(body, {
    x: blob.vx,
    y: blob.vy,
  })
  normalizeBodySpeed(body, speedPxPerMs)
  World.add(physicsWorld.engine.world, body)

  return {
    ...blob,
    bodyId: body.id,
    vx: body.velocity.x,
    vy: body.velocity.y,
    x: body.position.x,
    y: body.position.y,
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function createMergedBlob(params: {
  consumed: SimulationBlob
  lifecycle: BlobLifecyclePolicy
  nowMs: number
  speedPxPerMs: number
  survivor: SimulationBlob
}): SimulationBlob {
  const { consumed, lifecycle, nowMs, speedPxPerMs, survivor } = params
  const survivorVolume = survivor.radius ** 3
  const consumedVolume = consumed.radius ** 3
  const mergedVolume = survivorVolume + consumedVolume

  const mergedX = (survivor.x * survivorVolume + consumed.x * consumedVolume) / mergedVolume
  const mergedY = (survivor.y * survivorVolume + consumed.y * consumedVolume) / mergedVolume
  const mergedVx = (survivor.vx * survivorVolume + consumed.vx * consumedVolume) / mergedVolume
  const mergedVy = (survivor.vy * survivorVolume + consumed.vy * consumedVolume) / mergedVolume
  const mergedRadius = getMergedRadius(survivor.radius, consumed.radius)

  const velocityMagnitude = Math.hypot(mergedVx, mergedVy)
  const normalizedScale = velocityMagnitude > 0.0001 ? speedPxPerMs / velocityMagnitude : 1

  return {
    ...survivor,
    bodyId: null,
    lifeDurationMs: extendLifeOnMerge({
      consumed,
      lifecycle,
      nowMs,
      survivor,
    }),
    mergeFromRadius: survivor.radius,
    mergeStartedAtMs: nowMs,
    mergeUntilMs: nowMs + lifecycle.mergeAnimationMs,
    radius: mergedRadius,
    vx: mergedVx * normalizedScale,
    vy: mergedVy * normalizedScale,
    x: mergedX,
    y: mergedY,
  }
}

export function createPhysicsWorld(bounds: SimulationBounds): PhysicsWorld {
  const engine = Engine.create({
    gravity: {
      scale: 0,
      x: 0,
      y: 0,
    },
  } satisfies Matter.IEngineDefinition)

  const walls = createBoundaryWalls(bounds, DEFAULT_WALL_THICKNESS)
  World.add(engine.world, walls)

  return {
    engine,
    walls,
    wallThickness: DEFAULT_WALL_THICKNESS,
  }
}

export function createSimulationBlob(params: {
  bounds: SimulationBounds
  color: number
  engine: Matter.Engine
  id: string
  lifecycle: BlobLifecyclePolicy
  nowMs: number
  speedPxPerMs: number
}): SimulationBlob {
  const { bounds, color, engine, id, lifecycle, nowMs, speedPxPerMs } = params
  const radius = getInitialBlobRadius(bounds)
  const velocity = getConstantVelocity(speedPxPerMs)
  const x = randomBetween(radius, Math.max(radius + 1, bounds.width - radius))
  const y = randomBetween(radius, Math.max(radius + 1, bounds.height - radius))

  const body = Bodies.circle(x, y, radius, {
    friction: 0,
    frictionAir: 0.002,
    frictionStatic: 0,
    inertia: Infinity,
    label: 'magma-blob',
    restitution: 1,
    slop: 0.01,
  })

  Body.setVelocity(body, {
    x: velocity.vx,
    y: velocity.vy,
  })
  normalizeBodySpeed(body, speedPxPerMs)
  World.add(engine.world, body)

  return {
    bodyId: body.id,
    bornAtMs: nowMs,
    color,
    fadeWindowMs: lifecycle.fadeWindowMs,
    id,
    lifeDurationMs: lifecycle.baseLifeMs,
    mergeFromRadius: null,
    mergeStartedAtMs: null,
    mergeUntilMs: null,
    oversizeExcluded: false,
    radius,
    vx: body.velocity.x,
    vy: body.velocity.y,
    x: body.position.x,
    y: body.position.y,
  }
}

export function destroyPhysicsWorld(physicsWorld: PhysicsWorld): void {
  World.clear(physicsWorld.engine.world, false)
  Engine.clear(physicsWorld.engine)
}

export function detachBlobFromPhysics(params: { blob: SimulationBlob; physicsWorld: PhysicsWorld }): void {
  const { blob, physicsWorld } = params
  const body = getBodyById(physicsWorld, blob.bodyId)
  if (body === null) {
    return
  }

  World.remove(physicsWorld.engine.world, body)
}

export function easeInOut(value: number): number {
  const t = clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

export function extendLifeOnMerge(params: {
  consumed: SimulationBlob
  lifecycle: BlobLifecyclePolicy
  nowMs: number
  survivor: SimulationBlob
}): number {
  const { consumed, lifecycle, nowMs, survivor } = params
  const survivorElapsed = Math.max(0, nowMs - survivor.bornAtMs)
  const survivorRemaining = Math.max(0, survivor.lifeDurationMs - survivorElapsed)
  const consumedElapsed = Math.max(0, nowMs - consumed.bornAtMs)
  const consumedRemaining = Math.max(0, consumed.lifeDurationMs - consumedElapsed)

  const mergedRemaining = (survivorRemaining + consumedRemaining) * lifecycle.remainingLifeBoost
  const mergedTotalLife = survivorElapsed + mergedRemaining
  const mergedLifeCap = lifecycle.baseLifeMs * lifecycle.maxExtendedLifeFactor
  const clampedLife = Math.min(mergedLifeCap, mergedTotalLife)

  return Math.max(survivorElapsed + 1, clampedLife)
}

export function findCollisionPairs(blobs: readonly SimulationBlob[]): CollisionPair[] {
  const pairs: CollisionPair[] = []

  for (let firstIndex = 0; firstIndex < blobs.length - 1; firstIndex += 1) {
    const first = blobs[firstIndex]
    if (first.oversizeExcluded) {
      continue
    }

    for (let secondIndex = firstIndex + 1; secondIndex < blobs.length; secondIndex += 1) {
      const second = blobs[secondIndex]
      if (second.oversizeExcluded) {
        continue
      }

      const dx = second.x - first.x
      const dy = second.y - first.y
      const radii = first.radius + second.radius
      if (dx * dx + dy * dy <= radii * radii) {
        pairs.push({ firstIndex, secondIndex })
      }
    }
  }

  return pairs
}

export function findCollisionPairsFromWorld(params: {
  blobs: readonly SimulationBlob[]
  physicsWorld: PhysicsWorld
}): CollisionPair[] {
  const { blobs, physicsWorld } = params
  const indexByBodyId = new Map<number, number>()

  for (let index = 0; index < blobs.length; index += 1) {
    const blob = blobs[index]
    if (blob.oversizeExcluded || blob.bodyId === null) {
      continue
    }

    indexByBodyId.set(blob.bodyId, index)
  }

  const resolvedPairs = new Set<string>()
  const collisions: CollisionPair[] = []

  for (const pair of physicsWorld.engine.pairs.list) {
    if (!pair.isActive) {
      continue
    }

    const firstIndex = indexByBodyId.get(pair.bodyA.id)
    const secondIndex = indexByBodyId.get(pair.bodyB.id)
    if (firstIndex === undefined || secondIndex === undefined || firstIndex === secondIndex) {
      continue
    }

    const sortedFirst = Math.min(firstIndex, secondIndex)
    const sortedSecond = Math.max(firstIndex, secondIndex)
    const key = `${sortedFirst}:${sortedSecond}`

    if (resolvedPairs.has(key)) {
      continue
    }

    resolvedPairs.add(key)
    collisions.push({
      firstIndex: sortedFirst,
      secondIndex: sortedSecond,
    })
  }

  return collisions
}

export function getBlobAlpha(blob: SimulationBlob, nowMs: number): number {
  const ageMs = nowMs - blob.bornAtMs
  if (ageMs <= 0) {
    return 1
  }

  if (ageMs >= blob.lifeDurationMs) {
    return 0
  }

  const fadeWindowMs = Math.max(300, Math.min(blob.fadeWindowMs, blob.lifeDurationMs))
  const fadeStartMs = blob.lifeDurationMs - fadeWindowMs

  if (ageMs <= fadeStartMs) {
    return 1
  }

  const fadeProgress = clamp((ageMs - fadeStartMs) / fadeWindowMs, 0, 1)
  return 1 - easeInOut(fadeProgress)
}

export function getConstantVelocity(speedPxPerMs: number): { vx: number; vy: number } {
  const angle = randomBetween(0, Math.PI * 2)
  return {
    vx: Math.cos(angle) * speedPxPerMs * MATTER_BASE_TIMESTEP_MS,
    vy: Math.sin(angle) * speedPxPerMs * MATTER_BASE_TIMESTEP_MS,
  }
}

export function getDisplayRadius(blob: SimulationBlob, nowMs: number): number {
  if (blob.mergeUntilMs === null || blob.mergeFromRadius === null || blob.mergeStartedAtMs === null) {
    return blob.radius
  }

  const mergeDurationMs = Math.max(1, blob.mergeUntilMs - blob.mergeStartedAtMs)
  const progress = clamp((nowMs - blob.mergeStartedAtMs) / mergeDurationMs, 0, 1)

  return lerp(blob.mergeFromRadius, blob.radius, easeInOut(progress))
}

export function getInitialBlobRadius(bounds: SimulationBounds): number {
  const minDim = Math.min(bounds.width, bounds.height)
  const minRadius = Math.max(12, minDim * 0.08)
  const maxRadius = Math.max(minRadius + 6, minDim * 0.24)
  return randomBetween(minRadius, maxRadius)
}

export function getMergedRadius(firstRadius: number, secondRadius: number): number {
  return Math.cbrt(firstRadius ** 3 + secondRadius ** 3)
}

export function getMergeSurvivor(params: { first: SimulationBlob; second: SimulationBlob }): {
  consumed: SimulationBlob
  survivor: SimulationBlob
} {
  const { first, second } = params
  if (first.radius > second.radius) {
    return { consumed: second, survivor: first }
  }

  if (second.radius > first.radius) {
    return { consumed: first, survivor: second }
  }

  if (first.bornAtMs <= second.bornAtMs) {
    return { consumed: second, survivor: first }
  }

  return { consumed: first, survivor: second }
}

export function isBlobExpired(blob: SimulationBlob, nowMs: number): boolean {
  return nowMs - blob.bornAtMs >= blob.lifeDurationMs
}

export function lerp(start: number, end: number, amount: number): number {
  return start + (end - start) * amount
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function shouldKeepBlobForCollision(blob: SimulationBlob): boolean {
  return !blob.oversizeExcluded
}

export function stepPhysicsWorld(params: {
  blobs: readonly SimulationBlob[]
  deltaMs: number
  physicsWorld: PhysicsWorld
  speedPxPerMs: number
}): void {
  const { blobs, deltaMs, physicsWorld, speedPxPerMs } = params
  if (deltaMs <= 0) {
    return
  }

  Engine.update(physicsWorld.engine, deltaMs)

  for (const blob of blobs) {
    const body = getBodyById(physicsWorld, blob.bodyId)
    if (body === null) {
      continue
    }

    normalizeBodySpeed(body, speedPxPerMs)
  }
}

export function syncBlobsFromPhysics(params: { blobs: SimulationBlob[]; physicsWorld: PhysicsWorld }): void {
  const { blobs, physicsWorld } = params

  for (let index = 0; index < blobs.length; index += 1) {
    const blob = blobs[index]
    const body = getBodyById(physicsWorld, blob.bodyId)
    if (body === null) {
      continue
    }

    blobs[index] = {
      ...blob,
      vx: body.velocity.x,
      vy: body.velocity.y,
      x: body.position.x,
      y: body.position.y,
    }
  }
}

export function updatePhysicsWorldBounds(params: { bounds: SimulationBounds; physicsWorld: PhysicsWorld }): void {
  const { bounds, physicsWorld } = params
  World.remove(physicsWorld.engine.world, physicsWorld.walls)
  physicsWorld.walls = createBoundaryWalls(bounds, physicsWorld.wallThickness)
  World.add(physicsWorld.engine.world, physicsWorld.walls)
}

function createBoundaryWalls(bounds: SimulationBounds, wallThickness: number): Matter.Body[] {
  const halfThickness = wallThickness / 2

  return [
    Bodies.rectangle(bounds.width / 2, -halfThickness, bounds.width + wallThickness * 2, wallThickness, {
      isStatic: true,
      label: 'magma-wall-top',
      restitution: 1,
    }),
    Bodies.rectangle(bounds.width / 2, bounds.height + halfThickness, bounds.width + wallThickness * 2, wallThickness, {
      isStatic: true,
      label: 'magma-wall-bottom',
      restitution: 1,
    }),
    Bodies.rectangle(-halfThickness, bounds.height / 2, wallThickness, bounds.height + wallThickness * 2, {
      isStatic: true,
      label: 'magma-wall-left',
      restitution: 1,
    }),
    Bodies.rectangle(
      bounds.width + halfThickness,
      bounds.height / 2,
      wallThickness,
      bounds.height + wallThickness * 2,
      {
        isStatic: true,
        label: 'magma-wall-right',
        restitution: 1,
      },
    ),
  ]
}

function getBodyById(physicsWorld: PhysicsWorld, bodyId: null | number): Matter.Body | null {
  if (bodyId === null) {
    return null
  }

  return Composite.get(physicsWorld.engine.world, bodyId, 'body') as Matter.Body
}

function normalizeBodySpeed(body: Matter.Body, speedPxPerMs: number): void {
  const targetSpeed = Math.max(0.001, speedPxPerMs * MATTER_BASE_TIMESTEP_MS)
  Body.setSpeed(body, targetSpeed)
}
