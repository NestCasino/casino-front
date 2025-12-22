'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Settings } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'
import { useUser } from '@/lib/user-context'
import { formatBalance } from '@/lib/wallet-types'
import { cn } from '@/lib/utils'

export function WalletSelector() {
  const { wallets, activeWallet, setActiveWallet, settings, openWalletModal, totalBalance } = useWallet()
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debug logging
  useEffect(() => {
    console.log('[WalletSelector] Wallets:', wallets)
    console.log('[WalletSelector] Active Wallet:', activeWallet)
    console.log('[WalletSelector] Total Balance:', totalBalance)
    console.log('[WalletSelector] User:', user)
  }, [wallets, activeWallet, totalBalance, user])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const filteredWallets = wallets.filter((wallet) => {
    if (settings.hideZeroBalances && wallet.balance === 0) return false
    if (searchQuery) {
      return wallet.currency.code.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  const handleWalletSelect = (walletId: string) => {
    setActiveWallet(walletId)
    setIsOpen(false)
    setSearchQuery('')
  }

  // Use user data as the source of truth (same as profile menu)
  // Use active wallet as source of truth, fallback to user data (though activeWallet should be present)
  const displayCurrency = activeWallet?.currency.code || user?.currency || 'USD'
  const displayBalance = activeWallet?.balance ?? user?.balance ?? 0

  return (
    <div ref={dropdownRef} className="relative">
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[rgb(var(--bg-elevated))] px-5 py-2.5 rounded-xl hover:bg-[rgb(var(--surface))] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-[rgb(var(--text-muted))]">{displayCurrency}</span>
          <span className="text-base font-semibold">
            {formatBalance(displayBalance, displayCurrency)}
          </span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-[rgb(var(--text-muted))] transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-[320px] bg-[#1a1534] rounded-xl border border-purple-800/30 shadow-2xl z-50 overflow-hidden">
          {/* Search Bar */}
          <div className="p-3 border-b border-purple-800/30 bg-[#1a1534]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Currencies"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f0a1f] text-white placeholder:text-gray-500 pl-10 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Wallets List */}
          <div className="max-h-[400px] overflow-y-auto bg-[#1a1534]">
            {filteredWallets.length > 0 ? (
              filteredWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet.id)}
                  className={cn(
                    "w-full px-4 py-3 flex items-center justify-between hover:bg-purple-800/20 transition-colors cursor-pointer",
                    activeWallet?.id === wallet.id && "bg-purple-800/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                        {wallet.currency.code}
                      </span>
                      {wallet.currency.network && (
                        <span className="text-xs text-[rgb(var(--text-muted))]">
                          {wallet.currency.network}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                    {formatBalance(wallet.balance, wallet.currency.code)}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-[rgb(var(--text-muted))]">
                <p className="text-sm">No wallets found</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-purple-800/30 bg-[#1a1534] flex items-center justify-between">
            <button
              onClick={() => {
                openWalletModal()
                setIsOpen(false)
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Wallet Settings
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

