import { Field, Form, Input } from '@base-ui/react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import Button from '@/components/basic/Button'
import Container from '@/components/basic/Container'
import Content from '@/components/basic/Content'
import IslandShell from '@/components/basic/IslandShell'
import Typography from '@/components/basic/Typography'
import { ROUTES } from '@/lib/constants/routes'

export const Route = createFileRoute('/planning-poker/')({
  component: PlanningPokerLobby,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { title: 'Planning Poker - LazyStack' },
      {
        content:
          'Join a Planning Poker room to estimate tasks together with your team. Generate a room code, share it, and start estimating!',
        name: 'description',
      },
      {
        content:
          'planning poker, agile estimation, team collaboration, task estimation, project management, phuhh98@gmail.com, Huynh Hoai Phu, LazyStack',
        name: 'keywords',
      },
    ],
  }),
})

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => chars[b % chars.length])
    .join('')
}

function PlanningPokerLobby() {
  const router = useRouter()
  const [name, setName] = useState(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (globalThis.window === undefined) {
      return ''
    }

    return localStorage.getItem('pp-player-name') ?? ''
  })
  const [roomCode, setRoomCode] = useState(() => generateRoomCode())
  const [error, setError] = useState('')

  function handleJoin() {
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
      to: ROUTES.planningPokerRoom,
    })
  }

  return (
    <Content as="main" className="page-wrap py-14">
      <Container className="rise-in mx-auto max-w-md">
        <IslandShell className="px-8 py-10">
          <Typography as="p" className="island-kicker mb-2">
            Planning Poker
          </Typography>
          <Typography as="h1" className="display-title text-ink mb-6 text-3xl font-bold">
            Estimate Together
          </Typography>
          <Typography as="p" className="text-ink-muted mb-8 text-sm">
            Pick cards in secret, reveal simultaneously. No anchoring bias.
          </Typography>

          <Form className="flex flex-col gap-4" onFormSubmit={handleJoin}>
            <Field.Root className="flex flex-col gap-1.5" name="playerName">
              <Field.Label className="text-ink text-sm font-semibold">Your name</Field.Label>
              <Input
                className="border-border bg-bg-surface text-ink placeholder:text-ink-muted focus:border-primary rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[rgba(79,184,178,0.2)]"
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
            </Field.Root>

            <Field.Root className="flex flex-col gap-1.5" name="roomCode">
              <Field.Label className="text-ink text-sm font-semibold">Room code</Field.Label>
              <Container align="stretch" className="gap-2" justify="start">
                <Input
                  className="border-border bg-bg-surface text-ink placeholder:text-ink-muted focus:border-primary min-w-0 flex-1 rounded-xl border px-4 py-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-[rgba(79,184,178,0.2)]"
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
                <Button
                  className="px-3 py-2.5 text-xs"
                  onClick={() => setRoomCode(generateRoomCode())}
                  title="Generate new code"
                  type="button"
                  variant="outline"
                >
                  Generate
                </Button>
              </Container>
              <Typography as="p" className="text-ink-muted text-xs">
                Share this code with teammates to join the same room.
              </Typography>
            </Field.Root>

            {error && (
              <Typography as="p" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </Typography>
            )}

            <Button className="mt-2 px-6 py-3" type="submit">
              Join Room
            </Button>
          </Form>
        </IslandShell>
      </Container>
    </Content>
  )
}
