'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { api } from './api-client'
import { toast } from '@/hooks/use-toast'

interface Player {
  id: string
  username: string
  email: string
}

interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in?: number
  player: Player
}

interface ApiSuccessResponse<T> {
  success: true
  data: T
  error?: never
}

interface ApiErrorResponse {
  success: false
  data?: never
  error: {
    message: string
    code?: string
  }
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  checkEmailAvailability: (email: string) => Promise<boolean>
  checkUsernameAvailability: (username: string) => Promise<boolean>
  openAuthModal: (tab?: 'login' | 'register') => void
  closeAuthModal: () => void
  isAuthModalOpen: boolean
  authModalTab: 'login' | 'register'
}

interface RegisterData {
  username: string
  email: string
  password: string
  currency?: string
  country?: string
  lang?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')

  // Check if user is authenticated on mount
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (accessToken && refreshToken) {
      setIsAuthenticated(true)
    }
    
    setIsLoading(false)
  }, [])

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab)
    setIsAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
  }, [])

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      const response: ApiResponse<AuthResponse> = await api.auth.login({ email, password })
      
      if (response.success && response.data) {
        const { access_token, refresh_token, player } = response.data
        
        if (!access_token || !refresh_token || !player?.id) {
          throw new Error('Invalid response from server')
        }
        
        // Store tokens
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        localStorage.setItem('player_id', player.id)
        
        if (rememberMe) {
          localStorage.setItem('remember_me', 'true')
        }
        
        setIsAuthenticated(true)
        closeAuthModal()
        
        toast({
          title: 'Welcome back!',
          description: `Successfully logged in as ${player.username}`,
        })
      } else {
        throw new Error(response.error?.message || 'Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = 
        error.response?.data?.error?.message || 
        error.message || 
        'Invalid email or password. Please try again.'
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      })
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      // Validate required fields before sending
      if (!data.username || !data.email || !data.password) {
        throw new Error('All fields are required')
      }
      
      const response: ApiResponse<AuthResponse> = await api.auth.register(data)
      
      if (response.success && response.data) {
        const { access_token, refresh_token, player } = response.data
        
        if (!access_token || !refresh_token || !player?.id) {
          throw new Error('Invalid response from server')
        }
        
        // Store tokens
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        localStorage.setItem('player_id', player.id)
        
        setIsAuthenticated(true)
        closeAuthModal()
        
        toast({
          title: 'Welcome to Nest Casino!',
          description: `Account created successfully. Welcome, ${player.username}!`,
        })
      } else {
        throw new Error(response.error?.message || 'Registration failed')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      const errorMessage = 
        error.response?.data?.error?.message || 
        error.message || 
        'Registration failed. Please try again.'
      
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('access_token')
      
      if (accessToken) {
        // Call logout endpoint to blacklist token
        await api.auth.logout(accessToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with logout even if API call fails
    } finally {
      // Clear tokens and state
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('player_id')
      localStorage.removeItem('remember_me')
      
      setIsAuthenticated(false)
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      })
    }
  }

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      if (!email || !email.includes('@')) {
        return false
      }
      
      const response = await api.players.checkEmail(email)
      
      if (response.success && response.data) {
        // exists: true means email is taken (not available)
        return !response.data.exists
      }
      
      return false
    } catch (error) {
      console.error('Email check error:', error)
      // Return false on error to not block the user
      return false
    }
  }

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      if (!username || username.length < 3) {
        return false
      }
      
      const response = await api.players.checkUsername(username)
      
      if (response.success && response.data) {
        // exists: true means username is taken (not available)
        return !response.data.exists
      }
      
      return false
    } catch (error) {
      console.error('Username check error:', error)
      // Return false on error to not block the user
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkEmailAvailability,
        checkUsernameAvailability,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

