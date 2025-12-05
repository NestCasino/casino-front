'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { Wallet, WalletSettings, Transaction, mapBackendWalletToFrontend, mapBackendTransactionToFrontend, getCurrencyByCode, Currency } from './wallet-types'
import { api } from './api-client'
import { useAuth } from './auth-context'

// WebSocket balance data structure (from backend WebSocket)
export interface WebSocketBalanceData {
  totalBalance: number
  totalBonusBalance: number
  wallets: Array<{
    id: string
    currencyCode: string
    walletType: 'crypto' | 'fiat'
    balance: string
    bonusBalance: string
    isDefault: boolean
  }>
}

interface WalletContextType {
  wallets: Wallet[]
  activeWallet: Wallet | null
  totalBalance: number
  totalBonusBalance: number
  settings: WalletSettings
  transactions: Transaction[]
  isWalletModalOpen: boolean
  isLoadingWallets: boolean
  isLoadingTransactions: boolean
  error: string | null
  setActiveWallet: (walletId: string) => void
  updateSettings: (settings: Partial<WalletSettings>) => void
  openWalletModal: () => void
  closeWalletModal: () => void
  toggleWalletModal: () => void
  getWalletByCurrency: (currencyCode: string) => Wallet | undefined
  refreshWallets: () => Promise<void>
  refreshTransactions: () => Promise<void>
  updateWalletsFromWebSocket: (data: WebSocketBalanceData) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Helper function to map WebSocket wallet data to frontend wallet format
function mapWebSocketWalletToFrontend(wsWallet: WebSocketBalanceData['wallets'][0]): Wallet | null {
  const currency = getCurrencyByCode(wsWallet.currencyCode)
  
  if (!currency) {
    console.warn(`Unknown currency code from WebSocket: ${wsWallet.currencyCode}`)
    return null
  }

  return {
    id: wsWallet.id,
    currency,
    balance: Number(wsWallet.balance),
    lockedBalance: Number(wsWallet.bonusBalance),
    isDefault: wsWallet.isDefault,
    createdAt: new Date().toISOString(), // WebSocket doesn't provide this
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [activeWallet, setActiveWalletState] = useState<Wallet | null>(null)
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const [totalBonusBalance, setTotalBonusBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isLoadingWallets, setIsLoadingWallets] = useState(false)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<WalletSettings>({
    hideZeroBalances: false,
    displayCryptoInFiat: false,
    preferredFiatCurrency: 'USD',
  })

  // Fetch wallets from API
  const fetchWallets = async () => {
    if (!isAuthenticated) {
      setWallets([])
      setActiveWalletState(null)
      setTotalBalance(0)
      setTotalBonusBalance(0)
      return
    }

    setIsLoadingWallets(true)
    setError(null)

    try {
      // Fetch both wallets and total balance
      const [walletsResponse, balanceResponse] = await Promise.all([
        api.wallets.getWallets(),
        api.wallets.getTotalBalance()
      ])
      
      console.log('[WalletContext] Wallets Response:', walletsResponse)
      console.log('[WalletContext] Balance Response:', balanceResponse)
      
      if (walletsResponse.success && walletsResponse.data) {
        const mappedWallets = walletsResponse.data
          .map(mapBackendWalletToFrontend)
          .filter((w): w is Wallet => w !== null)
        
        console.log('[WalletContext] Mapped Wallets:', mappedWallets)
        setWallets(mappedWallets)
        
        // Update total balance from API response
        if (balanceResponse.success && balanceResponse.data) {
          console.log('[WalletContext] Setting total balance:', balanceResponse.data.totalBalance)
          setTotalBalance(balanceResponse.data.totalBalance || 0)
          setTotalBonusBalance(balanceResponse.data.totalBonusBalance || 0)
        }
        
        // Set active wallet: restore from localStorage or use first/default wallet
        const savedActiveWalletId = localStorage.getItem('casino-active-wallet')
        console.log('[WalletContext] Saved active wallet ID:', savedActiveWalletId)
        if (savedActiveWalletId) {
          const savedWallet = mappedWallets.find(w => w.id === savedActiveWalletId)
          if (savedWallet) {
            console.log('[WalletContext] Setting saved wallet as active:', savedWallet)
            setActiveWalletState(savedWallet)
            return
          }
        }
        
        // Fallback: use default wallet or first wallet
        const defaultWallet = mappedWallets.find(w => w.isDefault) || mappedWallets[0]
        console.log('[WalletContext] Setting default/first wallet as active:', defaultWallet)
        setActiveWalletState(defaultWallet || null)
      } else {
        console.error('[WalletContext] Failed to load wallets:', walletsResponse.error)
        setError(walletsResponse.error?.message || 'Failed to load wallets')
      }
    } catch (err: any) {
      console.error('[WalletContext] Failed to fetch wallets:', err)
      setError(err.message || 'Failed to load wallets')
    } finally {
      setIsLoadingWallets(false)
    }
  }

  // Fetch transactions from API
  const fetchTransactions = async () => {
    if (!isAuthenticated) {
      setTransactions([])
      return
    }

    setIsLoadingTransactions(true)

    try {
      const response = await api.wallets.getTransactions()
      
      if (response.success && response.data) {
        const mappedTransactions = response.data.map(mapBackendTransactionToFrontend)
        setTransactions(mappedTransactions)
      }
    } catch (err: any) {
      console.error('Failed to fetch transactions:', err)
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('casino-wallet-settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to load settings', e)
      }
    }
  }, [])

  // Fetch wallets when authentication state changes
  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        fetchWallets()
      } else {
        // Clear wallet data when logged out
        setWallets([])
        setActiveWalletState(null)
        setTransactions([])
        setError(null)
      }
    }
  }, [isAuthenticated, isAuthLoading])

  // Save active wallet to localStorage
  useEffect(() => {
    if (activeWallet) {
      localStorage.setItem('casino-active-wallet', activeWallet.id)
    }
  }, [activeWallet])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('casino-wallet-settings', JSON.stringify(settings))
  }, [settings])

  const setActiveWallet = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    if (wallet) {
      setActiveWalletState(wallet)
    }
  }

  const updateSettings = (newSettings: Partial<WalletSettings>) => {
    setSettings({ ...settings, ...newSettings })
  }

  const refreshWallets = async () => {
    await fetchWallets()
  }

  const refreshTransactions = async () => {
    await fetchTransactions()
  }

  // Function to update wallets from WebSocket balance event
  const updateWalletsFromWebSocket = useCallback((data: WebSocketBalanceData) => {
    console.log('WebSocket: Balance update received', data)
    
    // Update total balances
    setTotalBalance(data.totalBalance)
    setTotalBonusBalance(data.totalBonusBalance)
    
    // Map WebSocket wallet data to frontend format
    const mappedWallets = data.wallets
      .map(mapWebSocketWalletToFrontend)
      .filter((w): w is Wallet => w !== null)
    
    setWallets(mappedWallets)
    setIsLoadingWallets(false)
    setError(null)
    
    // Update active wallet if it exists in the new data
    setActiveWalletState(prev => {
      if (prev) {
        const updatedWallet = mappedWallets.find(w => w.id === prev.id)
        if (updatedWallet) {
          return updatedWallet
        }
      }
      // If no active wallet or previous active wallet not found, use default or first
      const savedActiveWalletId = localStorage.getItem('casino-active-wallet')
      if (savedActiveWalletId) {
        const savedWallet = mappedWallets.find(w => w.id === savedActiveWalletId)
        if (savedWallet) return savedWallet
      }
      return mappedWallets.find(w => w.isDefault) || mappedWallets[0] || null
    })
  }, [])

  const openWalletModal = () => setIsWalletModalOpen(true)
  const closeWalletModal = () => setIsWalletModalOpen(false)
  const toggleWalletModal = () => setIsWalletModalOpen(!isWalletModalOpen)

  const getWalletByCurrency = (currencyCode: string) => {
    return wallets.find((w) => w.currency.code === currencyCode)
  }

  return (
    <WalletContext.Provider
      value={{
        wallets,
        activeWallet,
        totalBalance,
        totalBonusBalance,
        settings,
        transactions,
        isWalletModalOpen,
        isLoadingWallets,
        isLoadingTransactions,
        error,
        setActiveWallet,
        updateSettings,
        openWalletModal,
        closeWalletModal,
        toggleWalletModal,
        getWalletByCurrency,
        refreshWallets,
        refreshTransactions,
        updateWalletsFromWebSocket,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

