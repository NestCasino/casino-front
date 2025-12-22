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
    id?: string | number // ID might be missing or number
    _id?: string | number // Alternative ID field
    currencyCode?: string
    currency?: string
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
  setDefaultWallet: (walletId: string) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Helper function to map WebSocket wallet data to frontend wallet format
// (Kept for reference but mostly handled inline now for robustness)
function mapWebSocketWalletToFrontend(wsWallet: any): Wallet | null {
  // Support both currencyCode and currency fields
  const code = wsWallet.currencyCode || wsWallet.currency
  if (!code) return null

  const currency = getCurrencyByCode(code)
  if (!currency) return null

  // Handle ID: support 'id' or '_id'
  const rawId = wsWallet.id || wsWallet._id
  if (!rawId) return null // Silently fail if no ID (handled better in bulk update)

  return {
    id: String(rawId),
    currency,
    balance: Number(wsWallet.balance),
    lockedBalance: Number(wsWallet.bonusBalance),
    isDefault: wsWallet.isDefault,
    createdAt: new Date().toISOString(),
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
  const fetchWallets = async (retryCount = 0) => {
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
      // First try to fetch wallets
      const walletsResponse = await api.wallets.getWallets()
      
      console.log('[WalletContext] Wallets Response:', walletsResponse)
      
      if (walletsResponse.success && walletsResponse.data) {
        const mappedWallets = walletsResponse.data
          .map(mapBackendWalletToFrontend)
          .filter((w): w is Wallet => w !== null)
        
        
        console.log('[WalletContext] Mapped Wallets:', mappedWallets)
        
        // Deduplicate wallets based on ID (robustness against API or type issues)
        const uniqueWalletsMap = new Map<string, Wallet>()
        mappedWallets.forEach(w => {
            uniqueWalletsMap.set(w.id, w)
        })
        const uniqueWallets = Array.from(uniqueWalletsMap.values())

        setWallets(uniqueWallets)
        
        // Only if we successfully got wallets, try to set active wallet
        const savedActiveWalletId = localStorage.getItem('casino-active-wallet')
        if (savedActiveWalletId) {
          const savedWallet = mappedWallets.find(w => w.id === savedActiveWalletId)
          if (savedWallet) {
            setActiveWalletState(savedWallet)
          } else {
             // Fallback if saved wallet not found
             const defaultWallet = mappedWallets.find(w => w.isDefault) || mappedWallets[0]
             setActiveWalletState(defaultWallet || null)
          }
        } else {
          // Fallback if no saved wallet
          const defaultWallet = mappedWallets.find(w => w.isDefault) || mappedWallets[0]
          setActiveWalletState(defaultWallet || null)
        }

        // Try to fetch balance separately so it doesn't block wallets
        try {
            const balanceResponse = await api.wallets.getTotalBalance()
            if (balanceResponse.success && balanceResponse.data) {
                setTotalBalance(balanceResponse.data.totalBalance || 0)
                setTotalBonusBalance(balanceResponse.data.totalBonusBalance || 0)
            }
        } catch (balanceErr) {
            console.warn('[WalletContext] Failed to fetch balance, but wallets loaded:', balanceErr)
        }

      } else {
        throw new Error(walletsResponse.error?.message || 'Failed to load wallets')
      }
    } catch (err: any) {
      console.error(`[WalletContext] Failed to fetch wallets (attempt ${retryCount + 1}):`, err)
      
      // Retry logic for transient errors (up to 3 times)
      if (retryCount < 2) {
        console.log(`[WalletContext] Retrying fetch in ${1000 * (retryCount + 1)}ms...`)
        setTimeout(() => {
            fetchWallets(retryCount + 1)
        }, 1000 * (retryCount + 1))
        return // Don't clear loading state yet
      }

      setError(err.message || 'Failed to load wallets')
    } finally {
      // Only set loading to false if we are not retrying (recursion handles previous calls)
      // When we return early for retry, we don't hit this finally for THAT call, 
      // but the `setTimeout` closure call will have its own finally.
      // Actually, since I used `return` inside the retry block, this finally block will run for the initial call!
      // Wait, `return` in try/catch DOES trigger finally.
      
      // Correct approach: if we are retrying, we want to keep loading true.
      if (retryCount >= 2) {
          setIsLoadingWallets(false)
      }
      // If we are NOT retrying (success path falls through to here), we set loading false.
      // But we need to know if we are successful.
      // A cleaner way: move the retry `setTimeout` logic; if we set timeout, we don't want to setIsLoadingWallets(false) yet.
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

  const setDefaultWalletApi = async (walletId: string) => {
    try {
      setError(null)
      
      // Call API to set default wallet
      const response = await api.wallets.setDefaultWallet(walletId)
      
      if (response.success && response.data) {
        // Update local state optimistically
        setWallets(prevWallets => 
          prevWallets.map(w => ({
            ...w,
            isDefault: w.id === walletId
          }))
        )
        
        // Set as active wallet
        const wallet = wallets.find(w => w.id === walletId)
        if (wallet) {
          setActiveWalletState({ ...wallet, isDefault: true })
        }
        
        // Refresh wallets to get server state
        await refreshWallets()
      } else {
        setError(response.error?.message || 'Failed to set default wallet')
      }
    } catch (err: any) {
      console.error('Failed to set default wallet:', err)
      setError(err.message || 'Failed to set default wallet')
    }
  }

  // Function to update wallets from WebSocket balance event
  const updateWalletsFromWebSocket = useCallback((data: WebSocketBalanceData) => {
    // Update total balances
    setTotalBalance(data.totalBalance)
    setTotalBonusBalance(data.totalBonusBalance)
    
    setWallets(currentWallets => {
        // Create a map from current wallets for easy access
        const walletMap = new Map(currentWallets.map(w => [w.id, w]))
        
        data.wallets.forEach(wsWallet => {
            // Support both currencyCode and currency fields
            const code = wsWallet.currencyCode || wsWallet.currency
            if (!code) return

            // 1. Try to find match by ID (if WS provides it)
            // 2. OR Try to find match by Currency Code
            const wsId = wsWallet.id || wsWallet._id
            
            let match: Wallet | undefined
            
            if (wsId) {
                match = walletMap.get(String(wsId))
            }
            
            if (!match) {
                // Fallback: search by currency code
                match = Array.from(walletMap.values()).find(w => w.currency.code === code)
            }

            if (match) {
                 // Update existing wallet
                 // We preserve the existing ID and Currency object, just update balances
                 const updated: Wallet = {
                     ...match,
                     balance: Number(wsWallet.balance),
                     lockedBalance: Number(wsWallet.bonusBalance),
                     // Update defaults/active if provided
                     isDefault: wsWallet.isDefault !== undefined ? wsWallet.isDefault : match.isDefault
                 }
                 walletMap.set(match.id, updated)
            } else {
                 // No match found. Create new wallet ONLY if we have a valid ID.
                 if (wsId) {
                     const currency = getCurrencyByCode(code)
                     if (currency) {
                         const newWallet: Wallet = {
                             id: String(wsId),
                             currency,
                             balance: Number(wsWallet.balance),
                             lockedBalance: Number(wsWallet.bonusBalance),
                             isDefault: wsWallet.isDefault || false,
                             createdAt: new Date().toISOString()
                         }
                         walletMap.set(newWallet.id, newWallet)
                     }
                 }
                 // If no ID and no match, we skip it (avoids duplication/undefined IDs)
            }
        })
        
        return Array.from(walletMap.values())
    })

    setIsLoadingWallets(false)
    setError(null)
    
    // Update active wallet logic
    // We trust that 'wallets' state update will eventually trigger a re-render
    // But we should update the 'activeWallet' state reference if it was modified
    setActiveWalletState(prevActive => {
        if (!prevActive) return null
        
        // Find if our active wallet was in the update payload (by ID or Currency)
        const updatedInData = data.wallets.find(w => {
            const code = w.currencyCode || w.currency
            const wsId = w.id || w._id
            return (wsId && String(wsId) === prevActive.id) || (code === prevActive.currency.code)
        })

        if (updatedInData) {
            // Construct the updated active wallet using the new balance
            return {
                ...prevActive,
                balance: Number(updatedInData.balance),
                lockedBalance: Number(updatedInData.bonusBalance),
                isDefault: updatedInData.isDefault !== undefined ? updatedInData.isDefault : prevActive.isDefault
            }
        }
        return prevActive
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
        setDefaultWallet: setDefaultWalletApi,
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

