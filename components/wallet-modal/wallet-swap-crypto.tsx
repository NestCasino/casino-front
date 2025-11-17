'use client'

import { useState } from 'react'
import { ArrowDownUp, Info } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'
import { formatBalance, getCurrencyByCode } from '@/lib/wallet-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

export function WalletSwapCrypto() {
  const { wallets, updateWalletBalance } = useWallet()
  const cryptoWallets = wallets.filter((w) => w.currency.type === 'crypto' && w.balance > 0)
  
  const [fromWallet, setFromWallet] = useState(cryptoWallets[0] || null)
  const [toWallet, setToWallet] = useState(cryptoWallets[1] || null)
  const [fromAmount, setFromAmount] = useState('')

  // Mock exchange rate
  const exchangeRate = 1.0
  const toAmount = fromAmount ? (parseFloat(fromAmount) * exchangeRate).toFixed(toWallet?.currency.decimals || 2) : '0'
  const fee = 0.005 // 0.5% swap fee

  const handleSwap = () => {
    if (!fromWallet || !toWallet) {
      toast({
        title: 'Invalid Selection',
        description: 'Please select both currencies',
        variant: 'destructive',
      })
      return
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      })
      return
    }

    const amount = parseFloat(fromAmount)
    if (amount > fromWallet.balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough balance',
        variant: 'destructive',
      })
      return
    }

    // Perform swap
    updateWalletBalance(fromWallet.id, fromWallet.balance - amount)
    updateWalletBalance(toWallet.id, toWallet.balance + parseFloat(toAmount))
    
    toast({
      title: 'Swap Successful',
      description: `Swapped ${formatBalance(amount, fromWallet.currency.code)} to ${formatBalance(parseFloat(toAmount), toWallet.currency.code)}`,
    })
    
    setFromAmount('')
  }

  const handleSwitchCurrencies = () => {
    const temp = fromWallet
    setFromWallet(toWallet)
    setToWallet(temp)
    setFromAmount('')
  }

  if (cryptoWallets.length < 2) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔄</div>
        <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-2">
          Swap Not Available
        </h3>
        <p className="text-sm text-[rgb(var(--text-muted))] mb-4">
          You need at least 2 cryptocurrency wallets with balance to swap.
        </p>
        <p className="text-xs text-[rgb(var(--text-muted))]">
          Add more crypto wallets from the Overview tab.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-300">
          <p className="font-semibold mb-1">Instant Crypto Swap</p>
          <p>
            Swap between your cryptocurrency wallets instantly with competitive rates.
            No external exchanges needed.
          </p>
        </div>
      </div>

      {/* From */}
      <div className="space-y-2">
        <Label>From</Label>
        <div className="space-y-2">
          <select
            value={fromWallet?.id || ''}
            onChange={(e) => {
              const wallet = cryptoWallets.find((w) => w.id === e.target.value)
              if (wallet) setFromWallet(wallet)
            }}
            className="w-full p-4 bg-[rgb(var(--bg-base))] border border-[rgb(var(--surface))] rounded-lg text-[rgb(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
          >
            {cryptoWallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.currency.code} - {formatBalance(wallet.balance, wallet.currency.code)}
              </option>
            ))}
          </select>
          
          {fromWallet && (
            <div className="relative">
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="text-xl pr-24"
              />
              <button
                onClick={() => setFromAmount(fromWallet.balance.toString())}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-xs font-semibold text-[rgb(var(--primary))] hover:text-[rgb(var(--primary))]/80 cursor-pointer"
              >
                MAX
              </button>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[rgb(var(--text-muted))]">
                {fromWallet.currency.code}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Switch Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSwitchCurrencies}
          className="p-3 bg-[rgb(var(--bg-base))] border-2 border-[rgb(var(--surface))] rounded-full hover:border-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/10 transition-all cursor-pointer"
        >
          <ArrowDownUp className="h-5 w-5 text-[rgb(var(--text-muted))]" />
        </button>
      </div>

      {/* To */}
      <div className="space-y-2">
        <Label>To</Label>
        <div className="space-y-2">
          <select
            value={toWallet?.id || ''}
            onChange={(e) => {
              const wallet = wallets.find((w) => w.id === e.target.value)
              if (wallet) setToWallet(wallet)
            }}
            className="w-full p-4 bg-[rgb(var(--bg-base))] border border-[rgb(var(--surface))] rounded-lg text-[rgb(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]"
          >
            {wallets
              .filter((w) => w.currency.type === 'crypto' && w.id !== fromWallet?.id)
              .map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.currency.code} - {formatBalance(wallet.balance, wallet.currency.code)}
                </option>
              ))}
          </select>
          
          {toWallet && (
            <div className="relative">
              <Input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.00"
                className="text-xl pr-16 bg-[rgb(var(--surface))]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[rgb(var(--text-muted))]">
                {toWallet.currency.code}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Swap Details */}
      {fromWallet && toWallet && fromAmount && (
        <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 space-y-2 border border-[rgb(var(--surface))]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Exchange Rate</span>
            <span className="font-semibold text-[rgb(var(--text-primary))]">
              1 {fromWallet.currency.code} ≈ {exchangeRate} {toWallet.currency.code}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Swap Fee ({(fee * 100).toFixed(1)}%)</span>
            <span className="font-semibold text-[rgb(var(--error))]">
              {formatBalance(parseFloat(fromAmount) * fee, fromWallet.currency.code)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[rgb(var(--text-muted))]">Slippage Tolerance</span>
            <span className="font-semibold text-[rgb(var(--text-primary))]">
              0.5%
            </span>
          </div>
          <div className="pt-2 border-t border-[rgb(var(--surface))]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[rgb(var(--text-muted))]">Estimated Output</span>
              <span className="font-bold text-lg text-[rgb(var(--success))]">
                {toAmount} {toWallet.currency.code}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Swap Button */}
      <Button onClick={handleSwap} className="w-full" size="lg">
        <ArrowDownUp className="h-4 w-4 mr-2" />
        Swap Now
      </Button>

      {/* Disclaimer */}
      <p className="text-xs text-[rgb(var(--text-muted))] text-center">
        Exchange rates are indicative and may vary. Actual rates are determined at the time of swap execution.
      </p>
    </div>
  )
}

