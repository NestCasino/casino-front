'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { api } from './api-client'
import { useAuth } from './auth-context'

// Backend notification structure
export interface BackendNotification {
  id: number
  playerId: number | null
  groupId: string | null
  sid: string | null
  type: string
  channel: string
  recipient: string | null
  subject: string | null
  text: string
  templateName: string | null
  templateData: Record<string, any> | null
  status: 'pending' | 'sent' | 'failed' | 'delivered' | 'read'
  retries: number
  maxRetries: number
  error: string | null
  sentAt: Date | null
  readAt: Date | null
  failedAt: Date | null
  created_at: Date
  updated_at: Date
  metadata?: Record<string, any> | null
}

// Frontend notification interface (transformed from backend)
export interface Notification {
  id: number
  type: 'bonus' | 'win' | 'system' | 'promotion' | 'achievement' | 'financial' | 'account' | 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  link?: string
  icon?: string
  // Backend fields
  playerId?: number | null
  channel?: string
  status?: string
  readAt?: Date | null
  created_at?: Date
  metadata?: Record<string, any> | null
}

interface NotificationContextType {
  notifications: Notification[]
  isOpen: boolean
  openNotifications: () => void
  closeNotifications: () => void
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  unreadCount: number
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMoreNotifications: () => Promise<void>
  refreshNotifications: () => Promise<void>
  addRealtimeNotification: (notification: Notification) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Helper function to map backend notification types to frontend types
function mapNotificationType(backendType: string): Notification['type'] {
  const typeMap: Record<string, Notification['type']> = {
    'financial': 'financial',
    'account': 'account',
    'info': 'info',
    'success': 'success',
    'warning': 'warning',
    'error': 'error',
    'bonus': 'bonus',
    'promotion': 'promotion',
    'custom': 'system',
  }
  return typeMap[backendType] || 'system'
}

// Helper function to get icon based on notification type
function getNotificationIcon(type: Notification['type'], metadata?: Record<string, any> | null): string {
  // Check if metadata has icon
  if (metadata?.icon) return metadata.icon

  const iconMap: Record<string, string> = {
    'bonus': '🎁',
    'win': '🎉',
    'system': '💰',
    'promotion': '🔥',
    'achievement': '⭐',
    'financial': '💰',
    'account': '👤',
    'info': 'ℹ️',
    'success': '✅',
    'warning': '⚠️',
    'error': '❌',
  }
  return iconMap[type] || 'ℹ️'
}

// Helper function to transform backend notification to frontend notification
function transformNotification(backendNotif: BackendNotification): Notification {
  const type = mapNotificationType(backendNotif.type)
  const title = backendNotif.subject || backendNotif.text.substring(0, 50) + (backendNotif.text.length > 50 ? '...' : '')
  const message = backendNotif.subject ? backendNotif.text : backendNotif.text.substring(50)
  const icon = getNotificationIcon(type, backendNotif.metadata)
  const link = backendNotif.metadata?.link || backendNotif.metadata?.url

  return {
    id: backendNotif.id,
    type,
    title,
    message,
    timestamp: new Date(backendNotif.created_at),
    read: backendNotif.status === 'read' || backendNotif.readAt !== null,
    link,
    icon,
    playerId: backendNotif.playerId,
    channel: backendNotif.channel,
    status: backendNotif.status,
    readAt: backendNotif.readAt ? new Date(backendNotif.readAt) : null,
    created_at: new Date(backendNotif.created_at),
    metadata: backendNotif.metadata,
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 20

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (isLoadMore: boolean = false) => {
    if (!isAuthenticated) {
      setNotifications([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const currentOffset = isLoadMore ? offset : 0
      const response = await api.notifications.getNotifications(limit, currentOffset)

      if (response.success && response.data) {
        // Ensure response.data is an array before calling map
        const dataArray = Array.isArray(response.data) ? response.data : []
        const transformedNotifications = dataArray.map(transformNotification)
        
        if (isLoadMore) {
          setNotifications(prev => [...prev, ...transformedNotifications])
        } else {
          setNotifications(transformedNotifications)
        }

        setHasMore(transformedNotifications.length === limit)
        setOffset(currentOffset + transformedNotifications.length)
      } else {
        setError(response.error?.message || 'Failed to load notifications')
      }
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err)
      setError(err.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, offset, limit])

  // Load notifications when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      setOffset(0)
      setHasMore(true)
      fetchNotifications(false)
    } else {
      setNotifications([])
      setOffset(0)
      setHasMore(true)
    }
  }, [isAuthenticated])

  const openNotifications = () => setIsOpen(true)
  const closeNotifications = () => setIsOpen(false)

  const markAsRead = async (id: number) => {
    // Optimistically update UI
    const previousNotifications = [...notifications]
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true, readAt: new Date() } : notif))
    )

    try {
      const response = await api.notifications.markAsRead(id)
      
      if (!response.success) {
        // Rollback on error
        setNotifications(previousNotifications)
        console.error('Failed to mark notification as read:', response.error?.message)
      }
    } catch (err: any) {
      // Rollback on error
      setNotifications(previousNotifications)
      console.error('Failed to mark notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    // Optimistically update UI
    const previousNotifications = [...notifications]
    const now = new Date()
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true, readAt: now }))
    )

    try {
      const response = await api.notifications.markAllAsRead()
      
      if (!response.success) {
        // Rollback on error
        setNotifications(previousNotifications)
        console.error('Failed to mark all notifications as read:', response.error?.message)
      }
    } catch (err: any) {
      // Rollback on error
      setNotifications(previousNotifications)
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  const loadMoreNotifications = async () => {
    if (!hasMore || loading) return
    await fetchNotifications(true)
  }

  const refreshNotifications = async () => {
    setOffset(0)
    setHasMore(true)
    await fetchNotifications(false)
  }

  // Function to add real-time notification from WebSocket
  const addRealtimeNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
  }, [])

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
        loading,
        error,
        hasMore,
        loadMoreNotifications,
        refreshNotifications,
        addRealtimeNotification,
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

