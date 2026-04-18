import type { ComponentProps } from 'react'

import { useEffect, useState } from 'react'

import Button from '@/components/basic/Button'

type FormSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0]

type RightSidebarCodeWordEditorProps = Readonly<{
  codeWord: string
  onSet: (word: string) => void
}>

export default function RightSidebarCodeWordEditor({ codeWord, onSet }: RightSidebarCodeWordEditorProps) {
  const [draft, setDraft] = useState(codeWord)

  useEffect(() => {
    setDraft(codeWord)
  }, [codeWord])

  function handleSubmit(event: FormSubmitEvent) {
    event.preventDefault()
    onSet(draft.trim())
  }

  return (
    <form className="flex gap-1.5" onSubmit={handleSubmit}>
      <input
        className="bg-bg-surface text-ink border-border min-w-0 flex-1 rounded-lg border px-2 py-1 text-[10px] outline-none"
        maxLength={40}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Set code word..."
        type="text"
        value={draft}
      />
      <Button className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold" type="submit">
        Set
      </Button>
    </form>
  )
}
