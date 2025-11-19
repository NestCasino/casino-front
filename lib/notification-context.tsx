'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Notification {
  id: string
  type: 'bonus' | 'win' | 'system' | 'promotion' | 'achievement'
  title: string
  message: string
  timestamp: Date
  read: boolean
  link?: string
  icon?: string
}

interface NotificationContextType {
  notifications: Notification[]
  isOpen: boolean
  openNotifications: () => void
  closeNotifications: () => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'bonus',
    title: 'Welcome Bonus Available!',
    message: 'Claim your $500 welcome bonus + 200 free spins',
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    read: false,
    link: '/bonuses',
    icon: '🎁'
  },
  {
    id: '2',
    type: 'win',
    title: 'Big Win!',
    message: 'Congratulations! You won $1,250 on Sweet Bonanza',
    timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    read: false,
    icon: '🎉'
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Weekend Special',
    message: '50% cashback on all slots this weekend!',
    timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
    read: false,
    link: '/promotions',
    icon: '🔥'
  },
  {
    id: '4',
    type: 'achievement',
    title: 'New Achievement Unlocked',
    message: 'You\'ve reached VIP Silver status! Enjoy exclusive benefits.',
    timestamp: new Date(Date.now() - 5 * 60 * 60000), // 5 hours ago
    read: true,
    link: '/profile/achievements',
    icon: '⭐'
  },
  {
    id: '5',
    type: 'system',
    title: 'Deposit Successful',
    message: 'Your deposit of $200 has been credited to your account',
    timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
    read: true,
    icon: '💰'
  },
  {
    id: '6',
    type: 'win',
    title: 'Jackpot Winner Nearby!',
    message: 'Someone just won $50,000 on Mega Fortune! Will you be next?',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
    read: true,
    link: '/games/mega-fortune',
    icon: '🎰'
  }
]

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const openNotifications = () => setIsOpen(true)
  const closeNotifications = () => setIsOpen(false)

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isOpen,
        openNotifications,
        closeNotifications,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

