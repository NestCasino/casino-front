'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Bonus {
  id: string
  type: 'welcome' | 'wheel' | 'calendar' | 'rakeback' | 'cashback' | 'weekly' | 'sport'
  title: string
  description?: string
  icon: string
  status: 'available' | 'active' | 'completed' | 'locked'
  actionLabel?: string
  actionType?: 'deposit' | 'spin' | 'claim'
  countdown?: Date
  progress?: { current: number; max: number }
  reward?: string
}

interface BonusContextType {
  isOpen: boolean
  openBonuses: () => void
  closeBonuses: () => void
  bonuses: Bonus[]
  availableCount: number
}

const BonusContext = createContext<BonusContextType | undefined>(undefined)

// Mock bonuses data
const mockBonuses: Bonus[] = [
  {
    id: '1',
    type: 'welcome',
    title: 'Up to 150% + 50 FS',
    description: 'Welcome Bonus',
    icon: '🎁',
    status: 'available',
    actionLabel: 'Deposit',
    actionType: 'deposit',
  },
  {
    id: '2',
    type: 'wheel',
    title: 'Free Fury Wheel',
    description: 'Available to spin',
    icon: '🎯',
    status: 'available',
    actionLabel: 'Spin',
    actionType: 'spin',
  },
  {
    id: '3',
    type: 'calendar',
    title: 'Calendar Bonus',
    icon: '📅',
    status: 'active',
    countdown: new Date(Date.now() + 7 * 60 * 60 * 1000 + 20 * 60 * 1000 + 38 * 1000), // 7:20:38 from now
  },
  {
    id: '4',
    type: 'rakeback',
    title: 'Rakeback',
    icon: '💸',
    status: 'locked',
  },
  {
    id: '5',
    type: 'cashback',
    title: 'Cashback',
    icon: '💰',
    status: 'locked',
  },
  {
    id: '6',
    type: 'weekly',
    title: 'Weekly Bonus',
    icon: '🎰',
    status: 'active',
    progress: { current: 0, max: 150 },
  },
  {
    id: '7',
    type: 'sport',
    title: 'Weekly Sport Bonus',
    icon: '⚽',
    status: 'active',
    progress: { current: 0, max: 150 },
    reward: '$3',
  },
]

export function BonusProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [bonuses] = useState<Bonus[]>(mockBonuses)

  const openBonuses = () => setIsOpen(true)
  const closeBonuses = () => setIsOpen(false)

  const availableCount = bonuses.filter(b => b.status === 'available').length
  const totalCount = bonuses.length

  return (
    <BonusContext.Provider
      value={{
        isOpen,
        openBonuses,
        closeBonuses,
        bonuses,
        availableCount,
      }}
    >
      {children}
    </BonusContext.Provider>
  )
}

export function useBonuses() {
  const context = useContext(BonusContext)
  if (context === undefined) {
    throw new Error('useBonuses must be used within a BonusProvider')
  }
  return context
}

