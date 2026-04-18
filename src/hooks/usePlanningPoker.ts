import type { Array as YArray, Doc as YDoc, Map as YMap } from 'yjs'

import { useCallback, useEffect, useRef, useState } from 'react'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import { Doc } from 'yjs'

export interface AwarenessState {
  lastSeen: number
  name: string
  playerId: string
}
export interface ChatMessage {
  id: string
  name: string
  playerId: string
  text: string
  ts: number
}

export type GamePhase = 'dashboard' | 'lobby' | 'revealed' | 'voting'

export interface GameState {
  codeWord: string
  moderatorId: string
  phase: GamePhase
  story: string
  storyIndex: number
  timerDuration: number
  timerStartedAt: number
}

export interface PlayerData {
  handRaised: boolean
  id: string
  isOnline: boolean
  lastSeen: number
  name: string
  vote: null | string
  voted: boolean
}

export interface StoryItem {
  estimatedVote?: string
  id: string
  title: string
}

export interface UsePlanningPokerReturn {
  addStory: (title: string) => void
  canClaimModerator: boolean
  castVote: (card: string) => void
  chat: ChatMessage[]
  claimModerator: () => void
  clearStorySelection: () => void
  endSession: () => void
  gameState: GameState
  isConnected: boolean
  isConsensus: boolean
  isModerator: boolean
  lowerHand: (id: string) => void
  moveStory: (fromId: string, toId: string) => void
  myVote: null | string
  nextStory: (estimateOverride?: string) => void
  playerId: string
  players: PlayerData[]
  removeStory: (id: string) => void
  reorderStory: (id: string, dir: 'down' | 'up') => void
  revealVotes: () => void
  selectStory: (storyId: string, title: string) => void
  sendMessage: (text: string) => void
  setCodeWord: (word: string) => void
  setStoryEstimate: (storyId: string, vote: string) => void
  setTimerDuration: (seconds: number) => void
  startTimer: () => void
  startVoting: (story: string) => void
  stopTimer: () => void
  storyList: StoryItem[]
  timerRemaining: null | number
  toggleHand: () => void
}

interface PlayerRecord {
  handRaised: boolean
  name: string
  vote: null | string
  voted: boolean
}

function getOrCreatePlayerId(): string {
  const stored = localStorage.getItem('pp-player-id')
  if (stored) return stored
  const id = crypto.randomUUID()
  localStorage.setItem('pp-player-id', id)
  return id
}

function getSignalingUrls(): string[] {
  const envUrls = import.meta.env.VITE_SIGNALING_URLS as string | undefined
  if (envUrls) return envUrls.split(',').map((s) => s.trim())
  if (import.meta.env.DEV) return ['ws://localhost:4444']
  return ['wss://y-webrtc-signaling-eu.fly.dev', 'wss://y-webrtc-signaling-us.fly.dev']
}

const DEFAULT_GAME_STATE: GameState = {
  codeWord: '',
  moderatorId: '',
  phase: 'lobby',
  story: '',
  storyIndex: 0,
  timerDuration: 0,
  timerStartedAt: 0,
}

export function usePlanningPoker(roomId: string): UsePlanningPokerReturn {
  const [playerId] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return getOrCreatePlayerId()
  })

  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE)
  const [players, setPlayers] = useState<PlayerData[]>([])
  const [storyList, setStoryList] = useState<StoryItem[]>([])
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [now, setNow] = useState(Date.now)

  const ydocRef = useRef<null | YDoc>(null)
  const gameMapRef = useRef<null | YMap<number | string>>(null)
  const playersMapRef = useRef<null | YMap<PlayerRecord>>(null)
  const storyListRef = useRef<null | YArray<StoryItem>>(null)
  const chatArrayRef = useRef<null | YArray<ChatMessage>>(null)
  const providerRef = useRef<null | WebrtcProvider>(null)
  const playerNameRef = useRef<string>('Anonymous')

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!playerId) return

    const lifecycle = { disposed: false }
    let cleanup: (() => void) | undefined

    async function init() {
      const ydoc = new Doc()

      // Load persisted state first — restores local room history for reconnects
      const idbProvider = new IndexeddbPersistence(`pp-room-${roomId}`, ydoc)
      await idbProvider.whenSynced

      if (lifecycle.disposed) return

      const provider = new WebrtcProvider(roomId, ydoc, {
        signaling: getSignalingUrls(),
      })

      const gameMap = ydoc.getMap<number | string>('game')
      const playersMap = ydoc.getMap<PlayerRecord>('players')
      const storyListArray = ydoc.getArray<StoryItem>('storyList')
      const chatArray = ydoc.getArray<ChatMessage>('chat')
      const name = localStorage.getItem('pp-player-name') ?? 'Anonymous'
      playerNameRef.current = name

      // Broadcast presence immediately so existing peers see us
      provider.awareness.setLocalState({ lastSeen: Date.now(), name, playerId })

      // Register the `synced` listener SYNCHRONOUSLY right after provider creation —
      // before any further await. BroadcastChannel sync (same browser) fires within
      // the next event-loop tick, so we must not yield before attaching this.
      //
      // We wait up to 2 s for a peer sync. If no peer responds (first in room),
      // the timeout fires and we claim defaults ourselves.
      const syncedPromise = new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, 2000)
        function onSynced() {
          clearTimeout(timer)
          provider.off('synced', onSynced)
          resolve()
        }
        provider.on('synced', onSynced)
      })

      function buildPlayers(): PlayerData[] {
        const onlineStates = new Map<string, Omit<AwarenessState, 'playerId'>>()
        ;(provider.awareness.getStates() as Map<number, Partial<AwarenessState>>).forEach((state) => {
          const pid = state.playerId
          if (pid) {
            onlineStates.set(pid, {
              lastSeen: state.lastSeen ? state.lastSeen : Date.now(),
              name: state.name ? state.name : 'Unknown',
            })
          }
        })

        const seenIds = new Set<string>()
        const list: PlayerData[] = []

        // Authoritative players from Yjs map
        playersMap.forEach((record, id) => {
          const presence = onlineStates.get(id)
          list.push({
            handRaised: !!record.handRaised,
            id,
            isOnline: !!presence,
            lastSeen: presence?.lastSeen ?? 0,
            name: record.name,
            vote: record.vote,
            voted: record.voted,
          })
          seenIds.add(id)
        })

        // Awareness-only: connected but Yjs map not yet received (pre-sync window)
        onlineStates.forEach(({ lastSeen, name: aName }, pid) => {
          if (!seenIds.has(pid)) {
            list.push({
              handRaised: false,
              id: pid,
              isOnline: true,
              lastSeen,
              name: aName,
              vote: null,
              voted: false,
            })
          }
        })

        return list
      }

      function syncGameState() {
        if (lifecycle.disposed) return
        setGameState({
          codeWord: gameMap.has('codeWord') ? (gameMap.get('codeWord') as string) : '',
          moderatorId: gameMap.has('moderatorId') ? (gameMap.get('moderatorId') as string) : '',
          phase: gameMap.has('phase') ? (gameMap.get('phase') as GamePhase) : 'lobby',
          story: gameMap.has('story') ? (gameMap.get('story') as string) : '',
          storyIndex: gameMap.has('storyIndex') ? (gameMap.get('storyIndex') as number) : 0,
          timerDuration: gameMap.has('timerDuration') ? (gameMap.get('timerDuration') as number) : 0,
          timerStartedAt: gameMap.has('timerStartedAt') ? (gameMap.get('timerStartedAt') as number) : 0,
        })
      }

      function syncPlayers() {
        if (lifecycle.disposed) return
        setPlayers(buildPlayers())
      }

      function syncStoryList() {
        if (lifecycle.disposed) return
        setStoryList(storyListArray.toArray())
      }

      function syncChat() {
        if (lifecycle.disposed) return
        const all = chatArray.toArray()
        setChat(all.slice(-100))
      }

      // Register ALL observers SYNCHRONOUSLY here — before the next await.
      gameMap.observe(syncGameState)
      playersMap.observe(syncPlayers)
      storyListArray.observe(syncStoryList)
      chatArray.observe(syncChat)
      provider.awareness.on('change', syncPlayers)

      // Show the game UI immediately with whatever IDB state we have.
      syncGameState()
      syncPlayers()
      syncStoryList()
      syncChat()

      setIsConnected(true)
      ydocRef.current = ydoc
      gameMapRef.current = gameMap
      playersMapRef.current = playersMap
      storyListRef.current = storyListArray
      chatArrayRef.current = chatArray
      providerRef.current = provider

      // Now await peer sync (or timeout) before writing defaults.
      await syncedPromise

      // Only the first peer to write to the Yjs document becomes the "initializer" that sets default values.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (lifecycle.disposed) return

      ydoc.transact(() => {
        if (!playersMap.has(playerId)) {
          playersMap.set(playerId, {
            handRaised: false,
            name,
            vote: null,
            voted: false,
          })
        }
        if (!gameMap.has('moderatorId')) gameMap.set('moderatorId', playerId)
        if (!gameMap.has('phase')) gameMap.set('phase', 'lobby')
        if (!gameMap.has('story')) gameMap.set('story', '')
        if (!gameMap.has('storyIndex')) gameMap.set('storyIndex', 0)
        if (!gameMap.has('timerDuration')) gameMap.set('timerDuration', 0)
        if (!gameMap.has('timerStartedAt')) gameMap.set('timerStartedAt', 0)
        if (!gameMap.has('codeWord')) gameMap.set('codeWord', '')
      })

      const heartbeatInterval = setInterval(() => {
        provider.awareness.setLocalState({
          ...provider.awareness.getLocalState(),
          lastSeen: Date.now(),
        })
      }, 10_000)

      cleanup = () => {
        clearInterval(heartbeatInterval)
        provider.awareness.setLocalState(null)
        provider.destroy()
        idbProvider.destroy()
        ydoc.destroy()
      }
    }

    init()

    return () => {
      lifecycle.disposed = true
      cleanup?.()
    }
  }, [roomId, playerId])

  const castVote = useCallback(
    (card: string) => {
      const pm = playersMapRef.current
      if (!pm || !playerId) return
      const current = pm.get(playerId)
      if (!current) return
      pm.set(playerId, { ...current, vote: card, voted: true })
    },
    [playerId],
  )

  const startVoting = useCallback((story: string) => {
    const gm = gameMapRef.current
    const pm = playersMapRef.current
    const sl = storyListRef.current
    const ydoc = ydocRef.current
    if (!gm || !pm || !ydoc) return

    const storyTitle = story.trim()
    if (!storyTitle) return

    ydoc.transact(() => {
      // Ad-hoc start should still appear in the shared story sidebar.
      if (sl) {
        const hasUnestimatedMatch = sl.toArray().some((item) => item.title === storyTitle && !item.estimatedVote)

        if (!hasUnestimatedMatch) {
          sl.push([{ id: crypto.randomUUID(), title: storyTitle }])
        }
      }

      gm.set('story', storyTitle)
      gm.set('phase', 'voting')
      gm.set('timerStartedAt', 0) // timer must be started manually
      pm.forEach((record, id) => {
        pm.set(id, { ...record, vote: null, voted: false })
      })
    })
  }, [])

  const selectStory = useCallback((storyId: string, title: string) => {
    const gm = gameMapRef.current
    const sl = storyListRef.current
    const ydoc = ydocRef.current
    if (!gm) return
    gm.set('story', title)
    // Move story to front of unestimated list
    if (storyId && sl && ydoc) {
      const items = sl.toArray()
      const fromIdx = items.findIndex((s) => s.id === storyId)
      if (fromIdx === -1) return
      const firstUnestimated = items.findIndex((s) => !s.estimatedVote)
      if (firstUnestimated !== -1 && fromIdx !== firstUnestimated) {
        const item = items[fromIdx]
        ydoc.transact(() => {
          sl.delete(fromIdx, 1)
          sl.insert(firstUnestimated, [item])
        })
      }
    }
  }, [])

  const clearStorySelection = useCallback(() => {
    gameMapRef.current?.set('story', '')
  }, [])

  const startTimer = useCallback(() => {
    const gm = gameMapRef.current
    if (!gm) return
    const dur = gm.get('timerDuration') as number
    if (dur > 0) gm.set('timerStartedAt', Date.now())
  }, [])

  const revealVotes = useCallback(() => {
    const gm = gameMapRef.current
    if (!gm) return
    gm.set('phase', 'revealed')
    gm.set('timerStartedAt', 0)
  }, [])

  const stopTimer = useCallback(() => {
    gameMapRef.current?.set('timerStartedAt', 0)
  }, [])

  const endSession = useCallback(() => {
    gameMapRef.current?.set('phase', 'dashboard')
  }, [])

  const nextStory = useCallback((estimateOverride?: string) => {
    const gm = gameMapRef.current
    const pm = playersMapRef.current
    const sl = storyListRef.current
    const ydoc = ydocRef.current
    if (!gm || !pm || !ydoc) return

    // Compute auto vote from current players state
    const currentPlayers = [...pm.entries()].map(([id, record]) => ({
      handRaised: !!record.handRaised,
      id,
      isOnline: true,
      lastSeen: 0,
      name: record.name,
      vote: record.vote,
      voted: record.voted,
    }))
    const autoVote = estimateOverride?.trim() || computeAutoVote(currentPlayers)

    ydoc.transact(() => {
      // Save estimate to current story in storyList if it exists
      if (sl && sl.length > 0) {
        const currentStoryTitle = gm.get('story') as string
        const currentIndex = gm.has('storyIndex') ? (gm.get('storyIndex') as number) : 0
        // Find the story in storyList that matches current voting story
        const storyItems = sl.toArray()
        const targetIdx = storyItems.findIndex((s) => s.title === currentStoryTitle && !s.estimatedVote)
        if (targetIdx !== -1) {
          const updated = { ...storyItems[targetIdx], estimatedVote: autoVote }
          sl.delete(targetIdx, 1)
          sl.insert(targetIdx, [updated])
        }

        // Find next story without estimatedVote
        const updatedItems = sl.toArray()
        const nextIdx = updatedItems.findIndex((s) => !s.estimatedVote)
        if (nextIdx !== -1) {
          // Start voting on next story
          gm.set('story', updatedItems[nextIdx].title)
          gm.set('phase', 'voting')
          gm.set('storyIndex', currentIndex + 1)
          gm.set('timerStartedAt', 0)
          pm.forEach((record, id) => {
            pm.set(id, { ...record, vote: null, voted: false })
          })
          return
        }
        // All stories estimated → dashboard
        gm.set('phase', 'dashboard')
        gm.set('timerStartedAt', 0)
        return
      }

      // Free-form mode: just go to next story
      gm.set('phase', 'voting')
      gm.set('storyIndex', (gm.has('storyIndex') ? (gm.get('storyIndex') as number) : 0) + 1)
      gm.set('story', '')
      gm.set('timerStartedAt', 0)
      pm.forEach((record, id) => {
        pm.set(id, { ...record, vote: null, voted: false })
      })
    })
  }, [])

  const claimModerator = useCallback(() => {
    if (!playerId) return
    gameMapRef.current?.set('moderatorId', playerId)
  }, [playerId])

  const addStory = useCallback((title: string) => {
    const sl = storyListRef.current
    if (!sl) return
    sl.push([{ id: crypto.randomUUID(), title }])
  }, [])

  const removeStory = useCallback((id: string) => {
    const sl = storyListRef.current
    if (!sl) return
    const items = sl.toArray()
    const idx = items.findIndex((s) => s.id === id)
    if (idx !== -1) sl.delete(idx, 1)
  }, [])

  const reorderStory = useCallback((id: string, dir: 'down' | 'up') => {
    const sl = storyListRef.current
    const ydoc = ydocRef.current
    if (!sl || !ydoc) return
    const items = sl.toArray()
    const idx = items.findIndex((s) => s.id === id)
    if (idx === -1) return
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= items.length) return
    ydoc.transact(() => {
      const a = items[idx]
      const b = items[swapIdx]
      sl.delete(Math.min(idx, swapIdx), 2)
      sl.insert(Math.min(idx, swapIdx), dir === 'up' ? [a, b] : [b, a])
    })
  }, [])

  const moveStory = useCallback((fromId: string, toId: string) => {
    const sl = storyListRef.current
    const ydoc = ydocRef.current
    if (!sl || !ydoc || fromId === toId) return
    const items = sl.toArray()
    const fromIdx = items.findIndex((s) => s.id === fromId)
    const toIdx = items.findIndex((s) => s.id === toId)
    if (fromIdx === -1 || toIdx === -1) return
    const item = items[fromIdx]
    ydoc.transact(() => {
      sl.delete(fromIdx, 1)
      const insertAt = fromIdx < toIdx ? toIdx - 1 : toIdx
      sl.insert(insertAt, [item])
    })
  }, [])

  const setStoryEstimate = useCallback((storyId: string, vote: string) => {
    const sl = storyListRef.current
    const ydoc = ydocRef.current
    if (!sl || !ydoc) return
    const items = sl.toArray()
    const idx = items.findIndex((s) => s.id === storyId)
    if (idx === -1) return
    ydoc.transact(() => {
      const updated = { ...items[idx], estimatedVote: vote }
      sl.delete(idx, 1)
      sl.insert(idx, [updated])
    })
  }, [])

  const sendMessage = useCallback(
    (text: string) => {
      const ca = chatArrayRef.current
      if (!ca || !playerId || !text.trim()) return
      ca.push([
        {
          id: crypto.randomUUID(),
          name: playerNameRef.current,
          playerId,
          text: text.trim(),
          ts: Date.now(),
        },
      ])
    },
    [playerId],
  )

  const toggleHand = useCallback(() => {
    const pm = playersMapRef.current
    if (!pm || !playerId) return
    const current = pm.get(playerId)
    if (!current) return
    pm.set(playerId, { ...current, handRaised: !current.handRaised })
  }, [playerId])

  const lowerHand = useCallback((id: string) => {
    const pm = playersMapRef.current
    if (!pm) return
    const current = pm.get(id)
    if (!current) return
    pm.set(id, { ...current, handRaised: false })
  }, [])

  const setTimerDuration = useCallback((seconds: number) => {
    gameMapRef.current?.set('timerDuration', seconds)
  }, [])

  const setCodeWord = useCallback((word: string) => {
    gameMapRef.current?.set('codeWord', word)
  }, [])

  const myVote = players.find((p) => p.id === playerId)?.vote ?? null
  const isModerator = !!playerId && gameState.moderatorId === playerId

  const moderatorPlayer = players.find((p) => p.id === gameState.moderatorId)
  const canClaimModerator =
    !isModerator &&
    isConnected &&
    !!gameState.moderatorId &&
    !moderatorPlayer?.isOnline &&
    !!moderatorPlayer &&
    now - moderatorPlayer.lastSeen > 30_000

  // Consensus: all online voters have same numeric vote; ☕ ignored; ? breaks it
  const onlineVoters = players.filter((p) => p.isOnline && p.voted && p.vote !== null)
  const numericVotes = onlineVoters.filter((p) => p.vote !== '?' && p.vote !== '☕').map((p) => p.vote as string)
  const isConsensus =
    gameState.phase === 'revealed' &&
    !onlineVoters.some((p) => p.vote === '?') &&
    numericVotes.length > 0 &&
    numericVotes.every((v) => v === numericVotes[0])

  // Derived timer countdown
  const timerRemaining = (() => {
    const dur = gameState.timerDuration
    const start = gameState.timerStartedAt
    if (!dur || !start) return null
    return Math.max(0, Math.round((start + dur * 1000 - now) / 1000))
  })()

  // Auto-reveal when timer reaches 0
  useEffect(() => {
    if (timerRemaining === 0 && gameState.phase === 'voting') {
      revealVotes()
    }
  }, [timerRemaining, gameState.phase, revealVotes])

  return {
    addStory,
    canClaimModerator,
    castVote,
    chat,
    claimModerator,
    clearStorySelection,
    endSession,
    gameState,
    isConnected,
    isConsensus,
    isModerator,
    lowerHand,
    moveStory,
    myVote,
    nextStory,
    playerId,
    players,
    removeStory,
    reorderStory,
    revealVotes,
    selectStory,
    sendMessage,
    setCodeWord,
    setStoryEstimate,
    setTimerDuration,
    startTimer,
    startVoting,
    stopTimer,
    storyList,
    timerRemaining,
    toggleHand,
  }
}

function computeAutoVote(players: PlayerData[]): string {
  const numeric = players
    .filter((p) => p.isOnline && p.voted && p.vote !== null && p.vote !== '?' && p.vote !== '☕')
    .map((p) => p.vote as string)

  if (numeric.length === 0) return '?'

  const counts = new Map<string, number>()
  for (const v of numeric) counts.set(v, (counts.get(v) ?? 0) + 1)

  let maxCount = 0
  for (const c of counts.values()) if (c > maxCount) maxCount = c

  const tied = [...counts.entries()].filter(([, c]) => c === maxCount).map(([v]) => v)

  if (tied.length === 1) return tied[0]

  // Tie: return the highest numeric value
  return tied.sort((a, b) => Number(b) - Number(a))[0]
}
