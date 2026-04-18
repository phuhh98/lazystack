import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import RightSidebarIconRail from '@/components/planning-poker/right-sidebar/RightSidebarIconRail'

describe('RightSidebarIconRail', () => {
  it('renders core controls for participants', () => {
    render(
      <RightSidebarIconRail
        activeTab="chat"
        isModerator={false}
        isOpen={false}
        myHandRaised={false}
        onSelectTab={() => {}}
        onToggleOpen={() => {}}
        raisedCount={0}
        timerDuration={0}
        unread={0}
      />,
    )

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open chat' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open hand panel' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Open timer settings' })).not.toBeInTheDocument()
  })

  it('calls tab selection and toggle callbacks', async () => {
    const user = userEvent.setup()
    const onSelectTab = vi.fn()
    const onToggleOpen = vi.fn()

    render(
      <RightSidebarIconRail
        activeTab="chat"
        isModerator={true}
        isOpen={true}
        myHandRaised={false}
        onSelectTab={onSelectTab}
        onToggleOpen={onToggleOpen}
        raisedCount={0}
        timerDuration={0}
        unread={0}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open hand panel' }))
    await user.click(screen.getByRole('button', { name: 'Open timer settings' }))
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }))

    expect(onSelectTab).toHaveBeenNthCalledWith(1, 'hand')
    expect(onSelectTab).toHaveBeenNthCalledWith(2, 'timer')
    expect(onToggleOpen).toHaveBeenCalledTimes(1)
  })

  it('caps unread and raised badges at 9 plus', () => {
    render(
      <RightSidebarIconRail
        activeTab="chat"
        isModerator={true}
        isOpen={true}
        myHandRaised={false}
        onSelectTab={() => {}}
        onToggleOpen={() => {}}
        raisedCount={12}
        timerDuration={15}
        unread={10}
      />,
    )

    expect(screen.getAllByText('9+')).toHaveLength(2)
  })

  it('shows raised-hand glyph when my hand is raised', () => {
    render(
      <RightSidebarIconRail
        activeTab="hand"
        isModerator={false}
        isOpen={true}
        myHandRaised={true}
        onSelectTab={() => {}}
        onToggleOpen={() => {}}
        raisedCount={1}
        timerDuration={0}
        unread={0}
      />,
    )

    expect(screen.getByText('🤚')).toBeInTheDocument()
  })
})
