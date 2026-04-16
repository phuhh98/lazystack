import { Drawer } from '@base-ui/react'
import { ChevronLeft, Hand, MessageSquare, Send, Timer } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { ChatMessage, PlayerData } from '@/hooks/usePlanningPoker'

const PRESETS = [
  '👋 Hello!',
  '👍 Looks good',
  '🤔 Need more info',
  '☕ Coffee break!',
  "⏰ Let's move on",
  '🎉 Great estimate!',
  '🙏 Thanks everyone!',
]

const TIMER_PRESETS = [0, 15, 30, 60] as const

interface RightSidebarProps {
  chat: ChatMessage[]
  codeWord: string
  isModerator: boolean
  onLowerHand: (id: string) => void
  onSend: (text: string) => void
  onSetCodeWord?: (word: string) => void
  onSetTimerDuration: (s: number) => void
  onToggleHand: () => void
  playerId: string
  players: PlayerData[]
  timerDuration: number
}

type Tab = 'chat' | 'hand' | 'timer'

export default function RightSidebar({
  chat,
  codeWord,
  isModerator,
  onLowerHand,
  onSend,
  onSetCodeWord,
  onSetTimerDuration,
  onToggleHand,
  playerId,
  players,
  timerDuration,
}: RightSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [input, setInput] = useState('')
  const [lastReadIndex, setLastReadIndex] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  const unread = Math.max(0, chat.length - lastReadIndex)
  const raisedPlayers = players.filter((p) => p.handRaised)
  const myPlayer = players.find((p) => p.id === playerId)
  const myHandRaised = myPlayer?.handRaised ?? false

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      setLastReadIndex(chat.length)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [isOpen, activeTab, chat.length])

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chat.length, isOpen, activeTab])

  function handleSend(text: string) {
    if (!text.trim()) return
    onSend(text)
    setInput('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSend(input)
  }

  const allPresets = codeWord ? [codeWord, ...PRESETS] : PRESETS

  return (
    <Drawer.Root modal={false} onOpenChange={setIsOpen} open={isOpen}>
      <div className="flex h-full shrink-0 border-l" style={{ borderColor: 'var(--border)' }}>
        {/* Icon strip — always visible */}
        <div className="flex w-10 shrink-0 flex-col items-center gap-1 pt-1" style={{ background: 'var(--surface)' }}>
          {/* Expand / collapse toggle */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            onClick={() => setIsOpen((v) => !v)}
            style={{ color: 'var(--ink-muted)' }}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            type="button"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="h-px w-6" style={{ background: 'var(--border)' }} />

          {/* Chat */}
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            onClick={() => {
              if (activeTab === 'chat' && isOpen) {
                setIsOpen(false)
              } else {
                setActiveTab('chat')
                setIsOpen(true)
              }
            }}
            style={{
              background: isOpen && activeTab === 'chat' ? 'rgba(204,136,83,0.12)' : 'transparent',
              color: isOpen && activeTab === 'chat' ? 'var(--primary)' : 'var(--ink-muted)',
            }}
            title="Chat"
            type="button"
          >
            <MessageSquare size={16} />
            {unread > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: 'var(--success)' }}
              >
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Raise Hand */}
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            onClick={() => {
              if (activeTab === 'hand' && isOpen) {
                setIsOpen(false)
              } else {
                setActiveTab('hand')
                setIsOpen(true)
              }
            }}
            style={{
              background: isOpen && activeTab === 'hand' ? 'rgba(204,136,83,0.12)' : 'transparent',
              color: isOpen && activeTab === 'hand' ? 'var(--primary)' : 'var(--ink-muted)',
            }}
            title="Raise hand"
            type="button"
          >
            {myHandRaised ? <span style={{ fontSize: '14px' }}>🤚</span> : <Hand size={16} />}
            {raisedPlayers.length > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: 'var(--primary)' }}
              >
                {raisedPlayers.length > 9 ? '9+' : raisedPlayers.length}
              </span>
            )}
          </button>

          {/* Timer — moderator only */}
          {isModerator && (
            <button
              className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              onClick={() => {
                if (activeTab === 'timer' && isOpen) {
                  setIsOpen(false)
                } else {
                  setActiveTab('timer')
                  setIsOpen(true)
                }
              }}
              style={{
                background: isOpen && activeTab === 'timer' ? 'rgba(204,136,83,0.12)' : 'transparent',
                color: isOpen && activeTab === 'timer' ? 'var(--primary)' : 'var(--ink-muted)',
              }}
              title="Timer settings"
              type="button"
            >
              <Timer size={16} />
              {timerDuration > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full"
                  style={{ background: 'var(--primary)' }}
                />
              )}
            </button>
          )}
        </div>

        <Drawer.Portal>
          {/* Drawer for content */}
          <Drawer.Content
            className="flex flex-col overflow-hidden transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--surface-strong)',
              borderLeft: isOpen ? '1px solid var(--border)' : 'none',
              height: '100%',
              minWidth: 0,
              width: isOpen ? '240px' : '0px',
            }}
          >
            {/* Panel header */}
            <div
              className="flex shrink-0 items-center justify-between border-b px-3 py-2"
              style={{ borderColor: 'var(--border)' }}
            >
              <p className="island-kicker capitalize">{activeTab}</p>
            </div>

            {/* Chat tab */}
            {activeTab === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto px-3 py-2">
                  {chat.length === 0 ? (
                    <p className="py-4 text-center text-xs" style={{ color: 'var(--ink-muted)' }}>
                      No messages yet. Say hello!
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {chat.map((msg) => {
                        const isSelf = msg.playerId === playerId
                        return (
                          <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`} key={msg.id}>
                            <span className="mb-0.5 text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                              {msg.name}
                            </span>
                            <div
                              className="max-w-[85%] rounded-2xl px-2.5 py-1.5 text-xs"
                              style={{
                                background: isSelf ? 'var(--primary)' : 'var(--surface)',
                                border: isSelf ? 'none' : '1px solid var(--border)',
                                color: isSelf ? 'white' : 'var(--ink)',
                              }}
                            >
                              {msg.text}
                            </div>
                          </div>
                        )
                      })}
                      <div ref={bottomRef} />
                    </div>
                  )}
                </div>

                {/* Code word section */}
                <div className="shrink-0 px-3 pt-2 pb-1" style={{ borderTop: '1px solid var(--border)' }}>
                  {onSetCodeWord ? (
                    <>
                      <p className="mb-1 text-[10px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                        Code word
                      </p>
                      <CodeWordEditor codeWord={codeWord} onSet={onSetCodeWord} />
                    </>
                  ) : codeWord ? (
                    <p className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                      Code word: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{codeWord}</span>
                    </p>
                  ) : null}
                </div>

                {/* Presets */}
                <div className="flex shrink-0 flex-wrap gap-1 px-3 pt-1.5 pb-1">
                  {allPresets.map((preset, i) => (
                    <button
                      className="rounded-full border px-2 py-0.5 text-[10px] transition-colors"
                      key={preset}
                      onClick={() => handleSend(preset)}
                      style={
                        i === 0 && codeWord
                          ? {
                              background: 'rgba(204,136,83,0.1)',
                              borderColor: 'var(--primary)',
                              color: 'var(--primary)',
                              fontWeight: 700,
                            }
                          : {
                              background: 'var(--chip-bg)',
                              borderColor: 'var(--chip-border)',
                              color: 'var(--ink)',
                            }
                      }
                      type="button"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <form className="flex shrink-0 gap-1.5 px-3 pt-2 pb-4" onSubmit={handleSubmit}>
                  <input
                    className="min-w-0 flex-1 rounded-xl border px-2.5 py-1.5 text-xs outline-none"
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message…"
                    style={{
                      background: 'var(--surface)',
                      borderColor: 'var(--border)',
                      color: 'var(--ink)',
                    }}
                    type="text"
                    value={input}
                  />
                  <button
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl disabled:opacity-40"
                    disabled={!input.trim()}
                    style={{ background: 'var(--primary)', color: 'white' }}
                    type="submit"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </>
            )}

            {/* Hand tab */}
            {activeTab === 'hand' && (
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
                <div>
                  <p className="mb-2 text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    Your hand
                  </p>
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-sm font-semibold transition-colors"
                    onClick={onToggleHand}
                    style={{
                      background: myHandRaised ? 'rgba(204,136,83,0.1)' : 'var(--surface)',
                      borderColor: myHandRaised ? 'var(--primary)' : 'var(--border)',
                      color: myHandRaised ? 'var(--primary)' : 'var(--ink)',
                    }}
                    type="button"
                  >
                    <span style={{ fontSize: '1.2rem' }}>{myHandRaised ? '🤚' : '✋'}</span>
                    {myHandRaised ? 'Lower hand' : 'Raise hand'}
                  </button>
                  {!myHandRaised && (
                    <p className="mt-1.5 text-center text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                      Raise to ask a question
                    </p>
                  )}
                </div>

                {isModerator && (
                  <div>
                    <p className="mb-2 text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                      Raised hands {raisedPlayers.length > 0 && `(${raisedPlayers.length})`}
                    </p>
                    {raisedPlayers.length === 0 ? (
                      <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                        No hands raised.
                      </p>
                    ) : (
                      <ul className="flex flex-col gap-1">
                        {raisedPlayers.map((p) => (
                          <li
                            className="flex items-center justify-between rounded-lg border px-2.5 py-1.5"
                            key={p.id}
                            style={{
                              background: 'var(--surface)',
                              borderColor: 'var(--border)',
                            }}
                          >
                            <span
                              className="flex items-center gap-1.5 text-xs font-medium"
                              style={{ color: 'var(--ink)' }}
                            >
                              <span>🤚</span>
                              {p.name}
                            </span>
                            <button
                              className="rounded-lg px-2 py-0.5 text-[10px] font-semibold text-white"
                              onClick={() => onLowerHand(p.id)}
                              style={{ background: 'var(--primary)' }}
                              type="button"
                            >
                              Lower
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Timer tab — moderator only */}
            {activeTab === 'timer' && isModerator && (
              <div className="flex flex-1 flex-col gap-3 px-3 py-3">
                <p className="text-xs font-semibold" style={{ color: 'var(--ink-muted)' }}>
                  Vote timer
                </p>
                <div className="flex flex-wrap gap-2">
                  {TIMER_PRESETS.map((sec) => (
                    <button
                      className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                      key={sec}
                      onClick={() => onSetTimerDuration(sec)}
                      style={{
                        background: timerDuration === sec ? 'var(--primary)' : 'var(--surface)',
                        borderColor: timerDuration === sec ? 'var(--primary)' : 'var(--border)',
                        color: timerDuration === sec ? 'white' : 'var(--ink)',
                      }}
                      type="button"
                    >
                      {sec === 0 ? 'Off' : `${sec}s`}
                    </button>
                  ))}
                </div>
                <p className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                  Set duration. Start timer manually during voting.
                </p>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </div>
    </Drawer.Root>
  )
}

function CodeWordEditor({ codeWord, onSet }: { codeWord: string; onSet: (w: string) => void }) {
  const [draft, setDraft] = useState(codeWord)

  // Sync if remote update comes in
  useEffect(() => {
    setDraft(codeWord)
  }, [codeWord])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSet(draft.trim())
  }

  return (
    <form className="flex gap-1.5" onSubmit={handleSubmit}>
      <input
        className="min-w-0 flex-1 rounded-lg border px-2 py-1 text-[10px] outline-none"
        maxLength={40}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Set code word…"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--ink)',
        }}
        type="text"
        value={draft}
      />
      <button
        className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold text-white"
        style={{ background: 'var(--primary)' }}
        type="submit"
      >
        Set
      </button>
    </form>
  )
}
