'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { api } from './api-client'

export interface Avatar {
  id: string
  name: string
  emoji: string
  bgColor: string
}

export interface User {
  id: string
  playerUuid: string
  username: string
  email: string
  emailVerified: boolean
  firstName?: string
  lastName?: string
  balance: number
  currency: string
  level: number
  levelProgress: number
  avatarId: string
  country?: string
  lang: string
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
  user: User | null
  isLoadingUser: boolean
  updateUser: (updates: Partial<User>) => void
  selectAvatar: (avatarId: string) => void
  getAvatar: (avatarId: string) => Avatar | undefined
  isAvatarModalOpen: boolean
  openAvatarModal: () => void
  closeAvatarModal: () => void
  loadUserProfile: () => Promise<void>
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  // Load user profile when authenticated, clear when not
  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated && !user) {
        loadUserProfile()
      } else if (!isAuthenticated && user) {
        clearUser()
      }
    }
  }, [isAuthenticated, isAuthLoading])

  const loadUserProfile = async () => {
    setIsLoadingUser(true)
    try {
      const response = await api.players.getMe()
      if (response.success && response.data) {
        const playerData = response.data
        setUser({
          id: playerData.id,
          playerUuid: playerData.playerUuid,
          username: playerData.username,
          email: playerData.email,
          emailVerified: playerData.emailVerified || false,
          firstName: playerData.firstName,
          lastName: playerData.lastName,
          balance: 0.00, // TODO: Get from wallet/balance API
          currency: playerData.currency,
          level: 1, // TODO: Get from player stats
          levelProgress: 0, // TODO: Get from player stats
          avatarId: '2', // TODO: Get from player settings or use avatar field
          country: playerData.country,
          lang: playerData.lang || 'EN',
        })
      }
    } catch (error) {
      console.error('Failed to load user profile:', error)
    } finally {
      setIsLoadingUser(false)
    }
  }

  const clearUser = () => {
    setUser(null)
  }

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? ({ ...prev, ...updates }) : null)
  }

  const selectAvatar = (avatarId: string) => {
    setUser(prev => prev ? ({ ...prev, avatarId }) : null)
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
      isLoadingUser,
      updateUser,
      selectAvatar,
      getAvatar,
      isAvatarModalOpen,
      openAvatarModal,
      closeAvatarModal,
      loadUserProfile,
      clearUser,
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




