import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/planning-poker/')({
  component: PlanningPokerLobby,
})

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => chars[b % chars.length])
    .join('')
}

function PlanningPokerLobby() {
  const router = useRouter()
  const [name, setName] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('pp-player-name') ?? '') : '',
  )
  const [roomCode, setRoomCode] = useState(() => generateRoomCode())
  const [error, setError] = useState('')

  function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!roomCode.trim()) {
      setError('Please enter a room code.')
      return
    }
    localStorage.setItem('pp-player-name', name.trim())
    router.navigate({
      params: { roomId: roomCode.toUpperCase().trim() },
      to: '/planning-poker/$roomId',
    })
  }

  return (
    <main className="page-wrap px-4 py-14">
      <div className="rise-in mx-auto max-w-md">
        <div className="island-shell rounded-[2rem] px-8 py-10">
          <p className="island-kicker mb-2">Planning Poker</p>
          <h1 className="display-title mb-6 text-3xl font-bold text-[var(--ink)]">Estimate Together</h1>
          <p className="mb-8 text-sm text-[var(--ink-muted)]">
            Pick cards in secret, reveal simultaneously. No anchoring bias.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleJoin}>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]" htmlFor="player-name">
                Your name
              </label>
              <input
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(79,184,178,0.2)]"
                id="player-name"
                maxLength={40}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder="e.g. Alice"
                type="text"
                value={name}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]" htmlFor="room-code">
                Room code
              </label>
              <div className="flex gap-2">
                <input
                  className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 font-mono text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(79,184,178,0.2)]"
                  id="room-code"
                  maxLength={12}
                  onChange={(e) => {
                    setRoomCode(e.target.value.toUpperCase())
                    setError('')
                  }}
                  placeholder="e.g. XKCD42"
                  type="text"
                  value={roomCode}
                />
                <button
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-xs font-semibold text-[var(--ink-muted)] transition-colors hover:border-[var(--primary-deep)] hover:text-[var(--ink)]"
                  onClick={() => setRoomCode(generateRoomCode())}
                  title="Generate new code"
                  type="button"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-[var(--ink-muted)]">Share this code with teammates to join the same room.</p>
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              className="mt-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-deep)]"
              type="submit"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
