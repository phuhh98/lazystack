import { Drawer } from '@base-ui/react'
import { MessageSquare, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { ChatMessage } from '@/hooks/usePlanningPoker'

const PRESETS = [
  '👋 Hello!',
  '👍 Looks good',
  '🤔 Need more info',
  '☕ Coffee break!',
  "⏰ Let's move on",
  '🎉 Great estimate!',
  '🙏 Thanks everyone!',
]

interface ChatDrawerProps {
  chat: ChatMessage[]
  onSend: (text: string) => void
  playerId: string
}

export default function ChatDrawer({ chat, onSend, playerId }: ChatDrawerProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [lastReadIndex, setLastReadIndex] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  const unread = Math.max(0, chat.length - lastReadIndex)

  useEffect(() => {
    if (open) {
      setLastReadIndex(chat.length)
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [open, chat.length])

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chat.length, open])

  function handleSend(text: string) {
    if (!text.trim()) return
    onSend(text)
    setInput('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSend(input)
  }

  return (
    <Drawer.Root onOpenChange={setOpen} open={open}>
      {/* Trigger button */}
      <Drawer.Trigger
        className="fixed right-4 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors"
        style={{
          background: 'var(--primary)',
          color: 'white',
        }}
        title="Open chat"
      >
        <MessageSquare size={20} />
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: 'var(--success)' }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Backdrop
          className="fixed inset-0 z-[150]"
          style={{ backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.3)' }}
        />
        <Drawer.Popup
          className="fixed right-0 bottom-0 left-0 z-[200] flex max-h-[70vh] flex-col rounded-t-3xl"
          style={{
            background: 'var(--surface-strong)',
            borderTop: '1px solid var(--border)',
            boxShadow: '0 -8px 40px rgba(61,26,0,0.12)',
          }}
        >
          {/* Handle */}
          <div className="mx-auto mt-3 h-1.5 w-10 rounded-full" style={{ background: 'var(--border)' }} />

          {/* Header */}
          <div
            className="flex items-center justify-between border-b px-5 py-3"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="island-kicker">Chat</p>
            <Drawer.Close className="rounded-xl p-1.5 transition-colors" style={{ color: 'var(--ink-muted)' }}>
              <X size={16} />
            </Drawer.Close>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {chat.length === 0 ? (
              <p className="py-4 text-center text-sm" style={{ color: 'var(--ink-muted)' }}>
                No messages yet. Say hello!
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {chat.map((msg) => {
                  const isSelf = msg.playerId === playerId
                  return (
                    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`} key={msg.id}>
                      <span className="mb-0.5 text-xs" style={{ color: 'var(--ink-muted)' }}>
                        {msg.name}
                      </span>
                      <div
                        className="max-w-[75%] rounded-2xl px-3 py-2 text-sm"
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

          {/* Presets */}
          <div className="flex flex-wrap gap-1.5 px-4 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            {PRESETS.map((preset) => (
              <button
                className="rounded-full border px-2.5 py-1 text-xs transition-colors"
                key={preset}
                onClick={() => handleSend(preset)}
                style={{
                  background: 'var(--chip-bg)',
                  borderColor: 'var(--chip-border)',
                  color: 'var(--ink)',
                }}
                type="button"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Input */}
          <form className="flex gap-2 px-4 pt-2 pb-6" onSubmit={handleSubmit}>
            <input
              className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors disabled:opacity-40"
              disabled={!input.trim()}
              style={{ background: 'var(--primary)', color: 'white' }}
              type="submit"
            >
              <Send size={15} />
            </button>
          </form>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
