'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './auth-context'
import { useNotifications } from './notification-context'
import { Notification } from './notification-context'

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:4003'

interface WebSocketContextType {
  socket: Socket | null
  isConnected: boolean
  connectionError: string | null
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

// Helper function to transform WebSocket notification to frontend notification
function transformWebSocketNotification(wsNotif: {
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  action?: { label: string; url: string }
}): Notification {
  const typeMap: Record<string, Notification['type']> = {
    'info': 'info',
    'success': 'success',
    'warning': 'warning',
    'error': 'error',
  }

  const iconMap: Record<string, string> = {
    'info': 'ℹ️',
    'success': '✅',
    'warning': '⚠️',
    'error': '❌',
  }

  return {
    id: Date.now(), // Temporary ID, will be replaced when fetched from API
    type: typeMap[wsNotif.type] || 'info',
    title: wsNotif.title,
    message: wsNotif.message,
    timestamp: new Date(wsNotif.timestamp),
    read: false,
    link: wsNotif.action?.url,
    icon: iconMap[wsNotif.type] || 'ℹ️',
  }
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated } = useAuth()
  const { addRealtimeNotification } = useNotifications()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    // Only connect if authenticated
    if (!isAuthenticated || !accessToken) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    // Create socket connection with JWT authentication
    const socketInstance = io(WEBSOCKET_URL, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('WebSocket connected:', socketInstance.id)
      setIsConnected(true)
      setConnectionError(null)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      setConnectionError(error.message)
      setIsConnected(false)
    })

    // Authentication event handlers
    socketInstance.on('authenticated', (data) => {
      console.log('WebSocket authenticated:', data)
    })

    socketInstance.on('unauthorized', (error) => {
      console.error('WebSocket unauthorized:', error)
      setConnectionError('Authentication failed')
    })

    // Private event handlers for authenticated users
    socketInstance.on('notification', (data) => {
      console.log('New notification received:', data)
      try {
        const notification = transformWebSocketNotification(data)
        addRealtimeNotification(notification)
      } catch (error) {
        console.error('Failed to process notification:', error)
      }
    })

    socketInstance.on('balance:update', (data) => {
      console.log('Balance update received:', data)
      // This could be handled by a separate balance context
      // For now, we'll just log it
    })

    socketInstance.on('transaction:update', (data) => {
      console.log('Transaction update received:', data)
      // This could be handled by a separate transaction context
      // For now, we'll just log it
    })

    // Public event handlers (for all users)
    socketInstance.on('bet:placed', (data) => {
      console.log('Bet placed (public):', data)
      // This could be displayed in a live feed
    })

    socketInstance.on('win:big', (data) => {
      console.log('Big win (public):', data)
      // This could be displayed in a live feed or as a toast
    })

    setSocket(socketInstance)

    // Cleanup on unmount or when token changes
    return () => {
      socketInstance.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [isAuthenticated, accessToken, addRealtimeNotification])

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        connectionError,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}









