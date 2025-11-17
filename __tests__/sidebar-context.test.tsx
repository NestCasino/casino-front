import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SidebarProvider, useSidebar } from '@/lib/sidebar-context'

function SidebarConsumer() {
  const { isCollapsed, toggleSidebar } = useSidebar()
  return (
    <div>
      <span data-testid="collapsed-state">{isCollapsed ? 'collapsed' : 'expanded'}</span>
      <button onClick={toggleSidebar}>Toggle</button>
    </div>
  )
}

describe('SidebarContext', () => {
  it("toggles 'isCollapsed' state when toggleSidebar is called", () => {
    render(
      <SidebarProvider>
        <SidebarConsumer />
      </SidebarProvider>
    )

    const state = screen.getByTestId('collapsed-state')
    const toggleButton = screen.getByText('Toggle')

    // Initial state should be expanded (isCollapsed = false)
    expect(state.textContent).toBe('expanded')

    // After one toggle, it should be collapsed
    fireEvent.click(toggleButton)
    expect(state.textContent).toBe('collapsed')

    // After another toggle, it should switch back
    fireEvent.click(toggleButton)
    expect(state.textContent).toBe('expanded')
  })
})