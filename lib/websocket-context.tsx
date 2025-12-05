'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './auth-context'
import { useNotifications, WebSocketNotification } from './notification-context'
import { useWallet, WebSocketBalanceData } from './wallet-context'

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:4003'

// WebSocket event data types (matching backend WEBSOCKET_API.md)
interface BetPlacedEvent {
  username: string
  amount: number
  currency: string
  game: string
  provider: string
  timestamp: Date
}

interface BigWinEvent {
  username: string
  amount: number
  currency: string
  game: string
  provider: string
  multiplier: number
  timestamp: Date
}

interface TransactionUpdateEvent {
  transactionId: string
  type: 'deposit' | 'withdrawal'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  amount: number
  currency: string
  method: string
  timestamp: Date
  message?: string
}

interface AuthenticatedEvent {
  userId: string
  username: string
  message: string
}

interface ConnectedEvent {
  message: string
  canReceive: string[]
}

interface WebSocketContextType {
  socket: Socket | null
  isConnected: boolean
  connectionError: string | null
  // Expose latest public events for live feed components
  lastBetPlaced: BetPlacedEvent | null
  lastBigWin: BigWinEvent | null
  lastTransactionUpdate: TransactionUpdateEvent | null
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated } = useAuth()
  const { handleWebSocketNotification } = useNotifications()
  const { updateWalletsFromWebSocket } = useWallet()
  
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  
  // Public event state for live feeds
  const [lastBetPlaced, setLastBetPlaced] = useState<BetPlacedEvent | null>(null)
  const [lastBigWin, setLastBigWin] = useState<BigWinEvent | null>(null)
  const [lastTransactionUpdate, setLastTransactionUpdate] = useState<TransactionUpdateEvent | null>(null)
  
  // Use ref to access latest callback without re-creating socket
  const handleNotificationRef = useRef(handleWebSocketNotification)
  const updateWalletsRef = useRef(updateWalletsFromWebSocket)
  
  useEffect(() => {
    handleNotificationRef.current = handleWebSocketNotification
  }, [handleWebSocketNotification])
  
  useEffect(() => {
    updateWalletsRef.current = updateWalletsFromWebSocket
  }, [updateWalletsFromWebSocket])

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

    // ==================== Connection Events ====================
    
    socketInstance.on('connect', () => {
      console.log('WebSocket connected:', socketInstance.id)
      setIsConnected(true)
      setConnectionError(null)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      setIsConnected(false)
      
      if (reason === 'io server disconnect') {
        // Server forcibly disconnected (e.g., invalid auth, blacklisted token)
        // Don't reconnect automatically - user needs to re-authenticate
        setConnectionError('Session expired. Please log in again.')
      }
    })

    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message)
      setConnectionError(error.message)
      setIsConnected(false)
    })

    // ==================== Authentication Events ====================
    
    // Anonymous user connected
    socketInstance.on('connected', (data: ConnectedEvent) => {
      console.log('WebSocket: Connected as anonymous user', data)
    })

    // Authenticated user confirmed
    socketInstance.on('authenticated', (data: AuthenticatedEvent) => {
      console.log('WebSocket: Authenticated as', data.username)
    })

    // ==================== Initial Data Events (sent after authentication) ====================
    
    // Balance data - sent immediately after authentication AND on any balance change
    // Data format: { totalBalance, totalBonusBalance, wallets[] }
    socketInstance.on('balance', (data: WebSocketBalanceData) => {
      console.log('WebSocket: Balance event received', data)
      updateWalletsRef.current(data)
    })

    // Notifications - array for initial load (last 50), single object for new notifications
    socketInstance.on('notifications', (data: WebSocketNotification | WebSocketNotification[]) => {
      console.log('WebSocket: Notifications event received', Array.isArray(data) ? `${data.length} items` : 'single notification')
      handleNotificationRef.current(data)
    })

    // ==================== Public Events (broadcast to all users) ====================
    
    // Any player places a bet
    socketInstance.on('bet:placed', (data: BetPlacedEvent) => {
      console.log('WebSocket: Bet placed (public)', data)
      setLastBetPlaced(data)
    })

    // Player wins big (configurable threshold, e.g., 100x)
    socketInstance.on('win:big', (data: BigWinEvent) => {
      console.log('WebSocket: Big win (public)', data)
      setLastBigWin(data)
    })

    // ==================== Private Events (authenticated users only) ====================
    
    // Transaction status changed (deposit, withdrawal)
    socketInstance.on('transaction:update', (data: TransactionUpdateEvent) => {
      console.log('WebSocket: Transaction update', data)
      setLastTransactionUpdate(data)
    })

    // ==================== Reconnection Events ====================
    
    socketInstance.io.on('reconnect', (attemptNumber) => {
      console.log('WebSocket: Reconnected after', attemptNumber, 'attempts')
      // After reconnection, authenticated events (balance, notifications)
      // will be sent automatically if token is still valid
    })

    socketInstance.io.on('reconnect_attempt', (attemptNumber) => {
      console.log('WebSocket: Reconnection attempt', attemptNumber)
    })

    socketInstance.io.on('reconnect_failed', () => {
      console.error('WebSocket: Reconnection failed')
      setConnectionError('Failed to reconnect. Please refresh the page.')
    })

    setSocket(socketInstance)

    // Cleanup on unmount or when token changes
    return () => {
      socketInstance.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [isAuthenticated, accessToken])

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        connectionError,
        lastBetPlaced,
        lastBigWin,
        lastTransactionUpdate,
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

// Export types for use in other components
export type { BetPlacedEvent, BigWinEvent, TransactionUpdateEvent }
