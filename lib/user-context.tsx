'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Avatar {
  id: string
  name: string
  emoji: string
  bgColor: string
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  emailVerified: boolean
  balance: number
  currency: string
  level: number
  levelProgress: number
  avatarId: string
}

export const AVAILABLE_AVATARS: Avatar[] = [
  { id: '1', name: 'Dog King', emoji: '👑🐕', bgColor: 'from-blue-400 to-purple-500' },
  { id: '2', name: 'Fox', emoji: '🦊', bgColor: 'from-green-400 to-teal-500' },
  { id: '3', name: 'Cat', emoji: '😺', bgColor: 'from-orange-400 to-amber-500' },
  { id: '4', name: 'Ghost', emoji: '👻', bgColor: 'from-purple-400 to-pink-500' },
  { id: '5', name: 'Penguin', emoji: '🐧', bgColor: 'from-cyan-400 to-blue-500' },
  { id: '6', name: 'Duck', emoji: '🦆', bgColor: 'from-yellow-400 to-orange-400' },
  { id: '7', name: 'Bear', emoji: '🐻', bgColor: 'from-amber-500 to-orange-600' },
  { id: '8', name: 'Dog Life Ring', emoji: '🐕🛟', bgColor: 'from-red-400 to-orange-500' },
  { id: '9', name: 'Tropical', emoji: '🌺🦜', bgColor: 'from-lime-400 to-green-500' },
]

interface UserContextType {
  user: User
  updateUser: (updates: Partial<User>) => void
  selectAvatar: (avatarId: string) => void
  getAvatar: (avatarId: string) => Avatar | undefined
  isAvatarModalOpen: boolean
  openAvatarModal: () => void
  closeAvatarModal: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'John Smith',
    username: 'jsmith',
    email: 'john.smith@example.com',
    emailVerified: false,
    balance: 0.00,
    currency: 'USD',
    level: 1,
    levelProgress: 0,
    avatarId: '2', // Default to Fox
  })

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const selectAvatar = (avatarId: string) => {
    setUser(prev => ({ ...prev, avatarId }))
    setIsAvatarModalOpen(false)
  }

  const getAvatar = (avatarId: string) => {
    return AVAILABLE_AVATARS.find(avatar => avatar.id === avatarId)
  }

  const openAvatarModal = () => setIsAvatarModalOpen(true)
  const closeAvatarModal = () => setIsAvatarModalOpen(false)

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      selectAvatar,
      getAvatar,
      isAvatarModalOpen,
      openAvatarModal,
      closeAvatarModal,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

