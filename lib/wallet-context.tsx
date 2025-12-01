'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Wallet, WalletSettings, Transaction, mapBackendWalletToFrontend, mapBackendTransactionToFrontend } from './wallet-types'
import { api } from './api-client'
import { useAuth } from './auth-context'

interface WalletContextType {
  wallets: Wallet[]
  activeWallet: Wallet | null
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
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [activeWallet, setActiveWalletState] = useState<Wallet | null>(null)
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
      return
    }

    setIsLoadingWallets(true)
    setError(null)

    try {
      const response = await api.wallets.getWallets()
      
      if (response.success && response.data) {
        const mappedWallets = response.data
          .map(mapBackendWalletToFrontend)
          .filter((w): w is Wallet => w !== null)
        
        setWallets(mappedWallets)
        
        // Set active wallet: restore from localStorage or use first/default wallet
        const savedActiveWalletId = localStorage.getItem('casino-active-wallet')
        if (savedActiveWalletId) {
          const savedWallet = mappedWallets.find(w => w.id === savedActiveWalletId)
          if (savedWallet) {
            setActiveWalletState(savedWallet)
            return
          }
        }
        
        // Fallback: use default wallet or first wallet
        const defaultWallet = mappedWallets.find(w => w.isDefault) || mappedWallets[0]
        setActiveWalletState(defaultWallet || null)
      } else {
        setError(response.error?.message || 'Failed to load wallets')
      }
    } catch (err: any) {
      console.error('Failed to fetch wallets:', err)
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

