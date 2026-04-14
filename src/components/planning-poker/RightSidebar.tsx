import { MessageSquare, Hand, Timer, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ChatMessage, PlayerData } from '@/hooks/usePlanningPoker'

const PRESETS = [
  '👋 Hello!',
  '👍 Looks good',
  '🤔 Need more info',
  '☕ Coffee break!',
  '⏰ Let\'s move on',
  '🎉 Great estimate!',
  '🙏 Thanks everyone!',
]

const TIMER_PRESETS = [0, 15, 30, 60] as const

interface RightSidebarProps {
  chat: ChatMessage[]
  playerId: string
  onSend: (text: string) => void
  players: PlayerData[]
  isModerator: boolean
  timerDuration: number
  onToggleHand: () => void
  onLowerHand: (id: string) => void
  onSetTimerDuration: (s: number) => void
  codeWord: string
  onSetCodeWord?: (word: string) => void
}

type Tab = 'chat' | 'hand' | 'timer'

function CodeWordEditor({ codeWord, onSet }: { codeWord: string; onSet: (w: string) => void }) {
  const [draft, setDraft] = useState(codeWord)

  // Sync if remote update comes in
  useEffect(() => { setDraft(codeWord) }, [codeWord])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSet(draft.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-1.5">
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Set code word…"
        maxLength={40}
        className="min-w-0 flex-1 rounded-lg border px-2 py-1 text-[10px] outline-none"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--ink)' }}
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold text-white"
        style={{ background: 'var(--primary)' }}
      >
        Set
      </button>
    </form>
  )
}

export default function RightSidebar({
  chat,
  playerId,
  onSend,
  players,
  isModerator,
  timerDuration,
  onToggleHand,
  onLowerHand,
  onSetTimerDuration,
  codeWord,
  onSetCodeWord,
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

  function handleTabClick(tab: Tab) {
    if (!isOpen) {
      setActiveTab(tab)
      setIsOpen(true)
    } else if (activeTab === tab) {
      setIsOpen(false)
    } else {
      setActiveTab(tab)
    }
  }

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
    <div
      className="flex h-full shrink-0 border-l"
      style={{ borderColor: 'var(--border)' }}
    >
      {/* Expanding panel */}
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: isOpen ? '240px' : '0px',
          minWidth: 0,
          transition: 'width 0.2s ease',
          background: 'var(--surface-strong)',
          borderRight: isOpen ? '1px solid var(--border)' : 'none',
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
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <span className="mb-0.5 text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                          {msg.name}
                        </span>
                        <div
                          className="max-w-[85%] rounded-2xl px-2.5 py-1.5 text-xs"
                          style={{
                            background: isSelf ? 'var(--primary)' : 'var(--surface)',
                            color: isSelf ? 'white' : 'var(--ink)',
                            border: isSelf ? 'none' : '1px solid var(--border)',
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
            <div
              className="shrink-0 px-3 pt-2 pb-1"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              {onSetCodeWord ? (
                <>
                  <p className="mb-1 text-[10px] font-semibold" style={{ color: 'var(--ink-muted)' }}>
                    Code word
                  </p>
                  <CodeWordEditor codeWord={codeWord} onSet={onSetCodeWord} />
                </>
              ) : codeWord ? (
                <p className="text-[10px]" style={{ color: 'var(--ink-muted)' }}>
                  Code word:{' '}
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{codeWord}</span>
                </p>
              ) : null}
            </div>

            {/* Presets */}
            <div className="flex shrink-0 flex-wrap gap-1 px-3 pt-1.5 pb-1">
              {allPresets.map((preset, i) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSend(preset)}
                  className="rounded-full border px-2 py-0.5 text-[10px] transition-colors"
                  style={
                    i === 0 && codeWord
                      ? {
                          borderColor: 'var(--primary)',
                          background: 'rgba(204,136,83,0.1)',
                          color: 'var(--primary)',
                          fontWeight: 700,
                        }
                      : {
                          borderColor: 'var(--chip-border)',
                          background: 'var(--chip-bg)',
                          color: 'var(--ink)',
                        }
                  }
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex shrink-0 gap-1.5 px-3 pb-4 pt-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="min-w-0 flex-1 rounded-xl border px-2.5 py-1.5 text-xs outline-none"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl disabled:opacity-40"
                style={{ background: 'var(--primary)', color: 'white' }}
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
                type="button"
                onClick={onToggleHand}
                className="flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-sm font-semibold transition-colors"
                style={{
                  borderColor: myHandRaised ? 'var(--primary)' : 'var(--border)',
                  background: myHandRaised ? 'rgba(204,136,83,0.1)' : 'var(--surface)',
                  color: myHandRaised ? 'var(--primary)' : 'var(--ink)',
                }}
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
                  <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>No hands raised.</p>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {raisedPlayers.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between rounded-lg border px-2.5 py-1.5"
                        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                      >
                        <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--ink)' }}>
                          <span>🤚</span>{p.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => onLowerHand(p.id)}
                          className="rounded-lg px-2 py-0.5 text-[10px] font-semibold text-white"
                          style={{ background: 'var(--primary)' }}
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
                  key={sec}
                  type="button"
                  onClick={() => onSetTimerDuration(sec)}
                  className="rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    borderColor: timerDuration === sec ? 'var(--primary)' : 'var(--border)',
                    background: timerDuration === sec ? 'var(--primary)' : 'var(--surface)',
                    color: timerDuration === sec ? 'white' : 'var(--ink)',
                  }}
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
      </div>

      {/* Icon strip — always visible */}
      <div
        className="flex w-10 shrink-0 flex-col items-center gap-1 pt-1"
        style={{ background: 'var(--surface)' }}
      >
        {/* Expand / collapse toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--ink-muted)' }}
        >
          {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="h-px w-6" style={{ background: 'var(--border)' }} />

        {/* Chat */}
        <button
          type="button"
          onClick={() => handleTabClick('chat')}
          title="Chat"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          style={{
            background: isOpen && activeTab === 'chat' ? 'rgba(204,136,83,0.12)' : 'transparent',
            color: isOpen && activeTab === 'chat' ? 'var(--primary)' : 'var(--ink-muted)',
          }}
        >
          <MessageSquare size={16} />
          {unread > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: 'var(--success)' }}
            >
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* Raise Hand */}
        <button
          type="button"
          onClick={() => handleTabClick('hand')}
          title="Raise hand"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          style={{
            background: isOpen && activeTab === 'hand' ? 'rgba(204,136,83,0.12)' : 'transparent',
            color: isOpen && activeTab === 'hand' ? 'var(--primary)' : 'var(--ink-muted)',
          }}
        >
          {myHandRaised ? (
            <span style={{ fontSize: '14px' }}>🤚</span>
          ) : (
            <Hand size={16} />
          )}
          {raisedPlayers.length > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ background: 'var(--primary)' }}
            >
              {raisedPlayers.length > 9 ? '9+' : raisedPlayers.length}
            </span>
          )}
        </button>

        {/* Timer — moderator only */}
        {isModerator && (
          <button
            type="button"
            onClick={() => handleTabClick('timer')}
            title="Timer settings"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{
              background: isOpen && activeTab === 'timer' ? 'rgba(204,136,83,0.12)' : 'transparent',
              color: isOpen && activeTab === 'timer' ? 'var(--primary)' : 'var(--ink-muted)',
            }}
          >
            <Timer size={16} />
            {timerDuration > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full"
                style={{ background: 'var(--primary)' }}
              />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
