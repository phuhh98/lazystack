import type { ComponentProps, KeyboardEvent, ReactNode, RefObject } from 'react'

import { Form, Input } from '@base-ui/react'
import { Send } from 'lucide-react'

import type { ChatMessage } from '@/hooks/usePlanningPoker'

import Button from '@/components/basic/Button'
import Container from '@/components/basic/Container'
import Typography from '@/components/basic/Typography'
import RightSidebarCodeWordEditor from '@/components/planning-poker/right-sidebar/RightSidebarCodeWordEditor'
import { cn } from '@/lib/utils/styles'

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0]

type RightSidebarChatTabProps = Readonly<{
  allPresets: string[]
  bottomRef: RefObject<HTMLDivElement | null>
  chat: ChatMessage[]
  codeWord: string
  input: string
  onInputChange: (value: string) => void
  onSend: (text: string) => void
  onSetCodeWord?: (word: string) => void
  onSubmit: (event: FormSubmitEvent) => void
  playerId: string
}>

export default function RightSidebarChatTab({
  allPresets,
  bottomRef,
  chat,
  codeWord,
  input,
  onInputChange,
  onSend,
  onSetCodeWord,
  onSubmit,
  playerId,
}: RightSidebarChatTabProps) {
  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    onSend(input)
  }

  let codeWordSection: ReactNode = null

  if (onSetCodeWord) {
    codeWordSection = (
      <>
        <Typography as="p" className="text-ink-muted mb-1 text-[10px] leading-none font-semibold">
          Code word
        </Typography>
        <RightSidebarCodeWordEditor codeWord={codeWord} onSet={onSetCodeWord} />
      </>
    )
  } else if (codeWord) {
    codeWordSection = (
      <Typography as="p" className="text-ink-muted text-[10px]">
        Code word:{' '}
        <Typography as="span" className="text-primary text-[10px] font-bold">
          {codeWord}
        </Typography>
      </Typography>
    )
  }

  return (
    <>
      <Container as="div" className="flex-1 overflow-y-auto px-3 py-2" disableDefaultClasses>
        {chat.length === 0 ? (
          <Typography as="p" className="text-ink-muted py-4 text-center text-xs">
            No messages yet. Say hello!
          </Typography>
        ) : (
          <Container as="div" className="flex flex-col gap-2" disableDefaultClasses>
            {chat.map((message) => {
              const isSelf = message.playerId === playerId

              return (
                <Container
                  as="div"
                  className={cn('flex flex-col', isSelf ? 'items-end' : 'items-start')}
                  disableDefaultClasses
                  key={message.id}
                >
                  <Typography as="span" className="text-ink-muted mb-0.5 text-[10px] leading-none">
                    {message.name}
                  </Typography>
                  <Typography
                    as="p"
                    className={cn(
                      'max-w-[85%] rounded-2xl px-2.5 py-1.5 text-xs',
                      isSelf ? 'bg-primary text-white' : 'bg-bg-surface text-ink border-border border',
                    )}
                  >
                    {message.text}
                  </Typography>
                </Container>
              )
            })}
            <div ref={bottomRef} />
          </Container>
        )}
      </Container>

      <Container as="div" className="border-border shrink-0 border-t px-3 pt-2 pb-1" disableDefaultClasses>
        {codeWordSection}
      </Container>

      <Container as="div" className="flex shrink-0 flex-wrap gap-1 px-3 pt-1.5 pb-1" disableDefaultClasses>
        {allPresets.map((preset, index) => {
          const isCodeWordPreset = index === 0 && codeWord.length > 0

          return (
            <Button
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-normal',
                isCodeWordPreset
                  ? 'border-primary bg-primary/10 text-primary hover:bg-primary/15 border font-bold'
                  : 'bg-chip-bg text-ink border-chip-border hover:bg-bg-surface-strong border',
              )}
              key={preset}
              onClick={() => onSend(preset)}
              variant="outline"
            >
              {preset}
            </Button>
          )
        })}
      </Container>

      <Form className="flex shrink-0 gap-1.5 px-3 pt-2 pb-4" onSubmit={onSubmit}>
        <Input
          className="bg-bg-surface text-ink border-border min-w-0 flex-1 rounded-xl border px-2.5 py-1.5 text-xs outline-none"
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type a message..."
          type="text"
          value={input}
        />
        <Button
          className="h-8 w-8 shrink-0 rounded-xl px-0 py-0 disabled:opacity-40"
          disabled={!input.trim()}
          type="submit"
        >
          <Send className="h-3.25 w-3.25" />
        </Button>
      </Form>
    </>
  )
}
