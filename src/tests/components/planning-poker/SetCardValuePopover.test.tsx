import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import SetCardValuePopover from '@/components/planning-poker/SetCardValuePopover'

describe('SetCardValuePopover', () => {
  it('opens popup and calls onSelectValue when selecting a card', async () => {
    const user = userEvent.setup()
    const onSelectValue = vi.fn()

    render(
      <SetCardValuePopover
        currentValue={null}
        onSelectValue={onSelectValue}
        triggerAriaLabel="Edit estimate"
        triggerTitle="Edit estimate"
      >
        <span>Trigger</span>
      </SetCardValuePopover>,
    )

    await user.click(screen.getByRole('button', { name: 'Edit estimate' }))
    await user.click(screen.getByRole('button', { name: 'Set estimate to 8' }))

    expect(onSelectValue).toHaveBeenCalledWith('8')
    expect(onSelectValue).toHaveBeenCalledTimes(1)
  })

  it('renders custom card values', async () => {
    const user = userEvent.setup()

    render(
      <SetCardValuePopover currentValue={null} onSelectValue={() => {}} triggerAriaLabel="Pick value">
        <span>Open</span>
      </SetCardValuePopover>,
    )

    await user.click(screen.getByRole('button', { name: 'Pick value' }))

    expect(screen.getByRole('button', { name: 'Set estimate to ☕' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Set estimate to 21' })).toBeInTheDocument()
  })
})
