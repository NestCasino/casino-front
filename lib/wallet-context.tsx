'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Wallet, WalletSettings, Transaction, Currency, getCurrencyByCode } from './wallet-types'

interface WalletContextType {
  wallets: Wallet[]
  activeWallet: Wallet | null
  settings: WalletSettings
  transactions: Transaction[]
  isWalletModalOpen: boolean
  addWallet: (currencyCode: string) => void
  removeWallet: (walletId: string) => void
  setActiveWallet: (walletId: string) => void
  updateWalletBalance: (walletId: string, amount: number) => void
  updateSettings: (settings: Partial<WalletSettings>) => void
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void
  openWalletModal: () => void
  closeWalletModal: () => void
  toggleWalletModal: () => void
  getWalletByCurrency: (currencyCode: string) => Wallet | undefined
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Mock initial wallets
const initialWallets: Wallet[] = [
  {
    id: 'wallet-1',
    currency: getCurrencyByCode('USD')!,
    balance: 1250.50,
    lockedBalance: 0,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wallet-2',
    currency: getCurrencyByCode('EUR')!,
    balance: 850.75,
    lockedBalance: 0,
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wallet-3',
    currency: getCurrencyByCode('BTC')!,
    balance: 0.0245,
    lockedBalance: 0,
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wallet-4',
    currency: getCurrencyByCode('USDT')!,
    balance: 500.00,
    lockedBalance: 0,
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
]

// Mock initial transactions
const initialTransactions: Transaction[] = []

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>(initialWallets)
  const [activeWallet, setActiveWalletState] = useState<Wallet | null>(initialWallets[0])
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [settings, setSettings] = useState<WalletSettings>({
    hideZeroBalances: false,
    displayCryptoInFiat: false,
    preferredFiatCurrency: 'USD',
  })

  // Load from localStorage on mount
  useEffect(() => {
    const savedWallets = localStorage.getItem('casino-wallets')
    const savedSettings = localStorage.getItem('casino-wallet-settings')
    const savedActiveWalletId = localStorage.getItem('casino-active-wallet')
    const walletVersion = localStorage.getItem('casino-wallet-version')
    const CURRENT_VERSION = '1.0'
    
    // Force reload if version changed or no wallets
    if (!savedWallets || walletVersion !== CURRENT_VERSION) {
      setWallets(initialWallets)
      setActiveWalletState(initialWallets[0])
      localStorage.setItem('casino-wallet-version', CURRENT_VERSION)
    } else {
      try {
        const parsed = JSON.parse(savedWallets)
        // Update wallets with latest currency data
        const updatedWallets = parsed.map((wallet: Wallet) => {
          const latestCurrency = getCurrencyByCode(wallet.currency.code)
          return {
            ...wallet,
            currency: latestCurrency || wallet.currency
          }
        })
        setWallets(updatedWallets)
        
        if (savedActiveWalletId) {
          const active = updatedWallets.find((w: Wallet) => w.id === savedActiveWalletId)
          if (active) setActiveWalletState(active)
        }
      } catch (e) {
        console.error('Failed to load wallets', e)
        setWallets(initialWallets)
        setActiveWalletState(initialWallets[0])
      }
    }
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error('Failed to load settings', e)
      }
    }
  }, [])

  // Save to localStorage whenever wallets change
  useEffect(() => {
    localStorage.setItem('casino-wallets', JSON.stringify(wallets))
  }, [wallets])

  // Save active wallet
  useEffect(() => {
    if (activeWallet) {
      localStorage.setItem('casino-active-wallet', activeWallet.id)
    }
  }, [activeWallet])

  // Save settings
  useEffect(() => {
    localStorage.setItem('casino-wallet-settings', JSON.stringify(settings))
  }, [settings])

  const addWallet = (currencyCode: string) => {
    const currency = getCurrencyByCode(currencyCode)
    if (!currency) return

    // Check if wallet already exists
    const exists = wallets.find((w) => w.currency.code === currencyCode)
    if (exists) {
      setActiveWalletState(exists)
      return
    }

    const newWallet: Wallet = {
      id: `wallet-${Date.now()}`,
      currency,
      balance: 0,
      lockedBalance: 0,
      isDefault: wallets.length === 0,
      createdAt: new Date().toISOString(),
    }

    setWallets([...wallets, newWallet])
    setActiveWalletState(newWallet)
  }

  const removeWallet = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    if (!wallet) return

    // Don't allow removing the last wallet
    if (wallets.length === 1) return

    // Don't allow removing wallet with balance
    if (wallet.balance > 0 || wallet.lockedBalance > 0) {
      alert('Cannot remove wallet with balance. Please withdraw funds first.')
      return
    }

    const updatedWallets = wallets.filter((w) => w.id !== walletId)
    setWallets(updatedWallets)

    // If active wallet was removed, set a new active wallet
    if (activeWallet?.id === walletId) {
      setActiveWalletState(updatedWallets[0])
    }
  }

  const setActiveWallet = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    if (wallet) {
      setActiveWalletState(wallet)
    }
  }

  const updateWalletBalance = (walletId: string, amount: number) => {
    setWallets(
      wallets.map((w) => (w.id === walletId ? { ...w, balance: amount } : w))
    )

    // Update active wallet if it's the one being updated
    if (activeWallet?.id === walletId) {
      setActiveWalletState({ ...activeWallet, balance: amount })
    }
  }

  const updateSettings = (newSettings: Partial<WalletSettings>) => {
    setSettings({ ...settings, ...newSettings })
  }

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
    setTransactions([newTransaction, ...transactions])
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
        addWallet,
        removeWallet,
        setActiveWallet,
        updateWalletBalance,
        updateSettings,
        addTransaction,
        openWalletModal,
        closeWalletModal,
        toggleWalletModal,
        getWalletByCurrency,
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

