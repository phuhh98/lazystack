import type { ComponentProps } from 'react'

import { Drawer } from '@base-ui/react'
import { useEffect, useRef, useState } from 'react'

import type { ChatMessage, PlayerData } from '@/hooks/usePlanningPoker'

import Typography from '@/components/basic/Typography'
import RightSidebarChatTab from '@/components/planning-poker/right-sidebar/RightSidebarChatTab'
import RightSidebarHandTab from '@/components/planning-poker/right-sidebar/RightSidebarHandTab'
import RightSidebarIconRail from '@/components/planning-poker/right-sidebar/RightSidebarIconRail'
import RightSidebarTimerTab from '@/components/planning-poker/right-sidebar/RightSidebarTimerTab'
import { cn } from '@/lib/utils/styles'

const PRESETS = [
  '👋 Hello!',
  '👍 Looks good',
  '🤔 Need more info',
  '☕ Coffee break!',
  "⏰ Let's move on",
  '🎉 Great estimate!',
  '🙏 Thanks everyone!',
]

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0]

type RightSidebarProps = Readonly<{
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
}>

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
  const sidebarRootRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [input, setInput] = useState('')
  const [lastReadIndex, setLastReadIndex] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<null | string>(null)

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

  useEffect(() => {
    if (!sidebarRootRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      const rect = sidebarRootRef.current?.getBoundingClientRect()
      if (rect) {
        setMaxHeight(`${rect.height}px`)
      }
    })

    resizeObserver.observe(sidebarRootRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  function handleSend(text: string) {
    if (!text.trim()) return
    onSend(text)
    setInput('')
  }

  function handleSubmit(event: FormSubmitEvent) {
    event.preventDefault()
    handleSend(input)
  }

  function handleSelectTab(tab: Tab) {
    if (activeTab === tab && isOpen) {
      setIsOpen(false)
      return
    }

    setActiveTab(tab)
    setIsOpen(true)
  }

  function handleToggleOpen() {
    setIsOpen(!isOpen)
  }

  const allPresets = codeWord ? [codeWord, ...PRESETS] : PRESETS

  return (
    <Drawer.Root disablePointerDismissal modal={false} onOpenChange={setIsOpen} open={isOpen}>
      <div className="border-border relative flex border-l" ref={sidebarRootRef}>
        <RightSidebarIconRail
          activeTab={activeTab}
          isModerator={isModerator}
          isOpen={isOpen}
          myHandRaised={myHandRaised}
          onSelectTab={handleSelectTab}
          onToggleOpen={handleToggleOpen}
          raisedCount={raisedPlayers.length}
          timerDuration={timerDuration}
          unread={unread}
        />

        <Drawer.Portal container={sidebarRootRef}>
          <Drawer.Content
            className={cn(
              'bg-bg-surface-strong/10 flex h-full flex-col overflow-hidden transition-[width] duration-200',
              isOpen ? 'border-border w-60 border-l' : 'h-0 w-0 border-l-0',
            )}
            onClick={(e) => e.stopPropagation()}
            style={isOpen && maxHeight ? { maxHeight } : undefined}
          >
            <div className="border-border flex shrink-0 items-center justify-between border-b px-3 py-2">
              <Typography as="p" className="island-kicker text-[0.69rem] leading-none capitalize">
                {activeTab}
              </Typography>
            </div>

            {activeTab === 'chat' && (
              <RightSidebarChatTab
                allPresets={allPresets}
                bottomRef={bottomRef}
                chat={chat}
                codeWord={codeWord}
                input={input}
                onInputChange={setInput}
                onSend={handleSend}
                onSetCodeWord={onSetCodeWord}
                onSubmit={handleSubmit}
                playerId={playerId}
              />
            )}

            {activeTab === 'hand' && (
              <RightSidebarHandTab
                isModerator={isModerator}
                myHandRaised={myHandRaised}
                onLowerHand={onLowerHand}
                onToggleHand={onToggleHand}
                raisedPlayers={raisedPlayers}
              />
            )}

            {activeTab === 'timer' && isModerator && (
              <RightSidebarTimerTab onSetTimerDuration={onSetTimerDuration} timerDuration={timerDuration} />
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </div>
    </Drawer.Root>
  )
}
