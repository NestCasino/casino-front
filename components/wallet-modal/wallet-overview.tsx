'use client'

import { useState } from 'react'
import { Plus, Eye, EyeOff, TrendingUp, TrendingDown, Shield, AlertCircle } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'
import { formatBalance, AVAILABLE_CURRENCIES } from '@/lib/wallet-types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export function WalletOverview() {
  const { wallets, activeWallet, setActiveWallet, addWallet, settings } = useWallet()
  const [showAddCurrency, setShowAddCurrency] = useState(false)
  const [showBalance, setShowBalance] = useState(true)

  const handleAddCurrency = (currencyCode: string) => {
    addWallet(currencyCode)
    setShowAddCurrency(false)
  }

  const totalBalanceUSD = wallets.reduce((sum, wallet) => {
    // Mock conversion rate - in real app, use actual exchange rates
    return sum + wallet.balance
  }, 0)

  const availableCurrencies = AVAILABLE_CURRENCIES.filter(
    (currency) => !wallets.some((w) => w.currency.code === currency.code)
  )

  const filteredWallets = settings.hideZeroBalances 
    ? wallets.filter((w) => w.balance > 0)
    : wallets

  return (
    <div className="space-y-6">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm opacity-90">Total Balance</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {showBalance ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="text-3xl font-bold mb-2">
          {showBalance ? `$${totalBalanceUSD.toFixed(2)}` : '****'}
        </div>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <TrendingUp className="h-4 w-4" />
          <span>+0.00% (24h)</span>
        </div>
      </div>

      {/* Security Notice */}
      {!settings.hideZeroBalances && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-[rgb(var(--text-primary))] mb-1">
              Improve your account security with Two-Factor Authentication
            </h4>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              Enable 2FA
            </Button>
          </div>
        </div>
      )}

      {/* Active Wallet */}
      {activeWallet && (
        <div className="bg-[rgb(var(--bg-base))] rounded-xl p-6 border border-[rgb(var(--surface))]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">
                  {activeWallet.currency.code}
                </h3>
                {activeWallet.currency.network && (
                  <p className="text-sm text-[rgb(var(--text-muted))]">
                    {activeWallet.currency.network}
                  </p>
                )}
              </div>
            </div>
            {activeWallet.isDefault && (
              <span className="px-2 py-1 bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] text-xs rounded-full">
                Default
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[rgb(var(--text-muted))]">Available Balance</span>
              <span className="text-xl font-bold text-[rgb(var(--text-primary))]">
                {formatBalance(activeWallet.balance, activeWallet.currency.code)}
              </span>
            </div>
            {activeWallet.lockedBalance > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-[rgb(var(--text-muted))]">Locked Balance</span>
                <span className="text-sm font-semibold text-[rgb(var(--warning))]">
                  {formatBalance(activeWallet.lockedBalance, activeWallet.currency.code)}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button className="flex-1 bg-[rgb(var(--success))] hover:bg-[rgb(var(--success))]/90">
              <TrendingDown className="h-4 w-4 mr-2" />
              Deposit
            </Button>
            <Button className="flex-1" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>
      )}

      {/* All Wallets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">All Wallets</h3>
          <Button
            onClick={() => setShowAddCurrency(true)}
            variant="ghost"
            size="sm"
            className="text-[rgb(var(--primary))] hover:text-[rgb(var(--primary))]/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Currency
          </Button>
        </div>

        <div className="grid gap-3">
          {filteredWallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => setActiveWallet(wallet.id)}
              className={cn(
                "p-4 rounded-lg border transition-all cursor-pointer text-left",
                activeWallet?.id === wallet.id
                  ? "bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))]"
                  : "bg-[rgb(var(--bg-base))] border-[rgb(var(--surface))] hover:border-[rgb(var(--primary))]/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-semibold text-[rgb(var(--text-primary))]">
                      {wallet.currency.code}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-[rgb(var(--text-primary))]">
                    {formatBalance(wallet.balance, wallet.currency.code)}
                  </div>
                  {settings.displayCryptoInFiat && wallet.currency.type === 'crypto' && (
                    <div className="text-xs text-[rgb(var(--text-muted))]">
                      ≈ ${wallet.balance.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredWallets.length === 0 && (
          <div className="text-center py-8 text-[rgb(var(--text-muted))]">
            <p>No wallets with balance</p>
          </div>
        )}
      </div>

      {/* Add Currency Modal */}
      <Dialog open={showAddCurrency} onOpenChange={setShowAddCurrency}>
        <DialogContent className="bg-[#1a1534] border-purple-800/30">
          <DialogHeader>
            <DialogTitle className="text-white">Select a currency to add</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
            {availableCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleAddCurrency(currency.code)}
                className="p-4 bg-[#0f0a1f] hover:bg-purple-800/20 rounded-lg border border-purple-800/30 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg font-semibold text-[rgb(var(--text-primary))]">
                    {currency.code}
                  </span>
                  {currency.network && (
                    <span className="text-xs text-[rgb(var(--text-muted))] text-center">
                      {currency.network}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {availableCurrencies.length === 0 && (
            <div className="text-center py-8 text-[rgb(var(--text-muted))]">
              <p>All available currencies have been added</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

