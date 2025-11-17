'use client'

import { useState } from 'react'
import { ShoppingCart, AlertCircle } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'
import { AVAILABLE_CURRENCIES, formatBalance } from '@/lib/wallet-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

const cryptoCurrencies = AVAILABLE_CURRENCIES.filter((c) => c.type === 'crypto')

export function WalletBuyCrypto() {
  const { wallets, updateWalletBalance, getWalletByCurrency, addWallet } = useWallet()
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoCurrencies[0])
  const [buyAmount, setBuyAmount] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState('USD')

  // Mock exchange rate
  const exchangeRate = 1.02 // Add 2% markup
  const cryptoAmount = buyAmount ? (parseFloat(buyAmount) / exchangeRate).toFixed(selectedCrypto.decimals) : '0'

  const handleBuy = () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      })
      return
    }

    // Get or create wallet for the selected crypto
    let wallet = getWalletByCurrency(selectedCrypto.code)
    if (!wallet) {
      addWallet(selectedCrypto.code)
      wallet = getWalletByCurrency(selectedCrypto.code)
    }

    if (wallet) {
      // Mock buy - add crypto to wallet
      const amount = parseFloat(cryptoAmount)
      updateWalletBalance(wallet.id, wallet.balance + amount)
      
      toast({
        title: 'Purchase Successful',
        description: `Bought ${formatBalance(amount, selectedCrypto.code)}`,
      })
      
      setBuyAmount('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-300">
          <p className="font-semibold mb-1">Buy Crypto Instantly</p>
          <p>
            Purchase cryptocurrency using your preferred payment method. 
            Funds will be available in your wallet immediately.
          </p>
        </div>
      </div>

      {/* Select Cryptocurrency */}
      <div className="space-y-2">
        <Label>Select Cryptocurrency</Label>
        <div className="grid grid-cols-3 gap-2">
          {cryptoCurrencies.slice(0, 6).map((crypto) => (
            <button
              key={crypto.code}
              onClick={() => setSelectedCrypto(crypto)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedCrypto.code === crypto.code
                  ? 'bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))]'
                  : 'bg-[rgb(var(--bg-base))] border-[rgb(var(--surface))] hover:border-[rgb(var(--primary))]/50'
              }`}
            >
              <div className="text-2xl mb-1">{crypto.icon}</div>
              <div className="text-xs font-semibold text-[rgb(var(--text-primary))]">
                {crypto.code}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Currency */}
      <div className="space-y-2">
        <Label>Pay With</Label>
        <div className="grid grid-cols-4 gap-2">
          {['USD', 'EUR', 'GBP', 'CAD'].map((currency) => (
            <button
              key={currency}
              onClick={() => setPaymentCurrency(currency)}
              className={`p-3 rounded-lg border transition-all text-sm font-semibold cursor-pointer ${
                paymentCurrency === currency
                  ? 'bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))] text-[rgb(var(--text-primary))]'
                  : 'bg-[rgb(var(--bg-base))] border-[rgb(var(--surface))] text-[rgb(var(--text-muted))] hover:border-[rgb(var(--primary))]/50'
              }`}
            >
              {currency}
            </button>
          ))}
        </div>
      </div>

      {/* Amount to Spend */}
      <div className="space-y-2">
        <Label>Amount to Spend</Label>
        <div className="relative">
          <Input
            type="number"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
            placeholder="Enter amount"
            className="pr-16"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[rgb(var(--text-muted))]">
            {paymentCurrency}
          </span>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {[50, 100, 250, 500, 1000].map((amount) => (
          <button
            key={amount}
            onClick={() => setBuyAmount(amount.toString())}
            className="px-3 py-2 bg-[rgb(var(--bg-base))] border border-[rgb(var(--surface))] rounded-lg hover:border-[rgb(var(--primary))]/50 transition-colors text-sm font-semibold cursor-pointer"
          >
            {amount}
          </button>
        ))}
      </div>

      {/* Purchase Summary */}
      <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 space-y-3 border border-[rgb(var(--surface))]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[rgb(var(--text-muted))]">You Pay</span>
          <span className="font-semibold text-[rgb(var(--text-primary))]">
            {buyAmount ? `${paymentCurrency} ${parseFloat(buyAmount).toFixed(2)}` : '-'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[rgb(var(--text-muted))]">Exchange Rate</span>
          <span className="font-semibold text-[rgb(var(--text-primary))]">
            1 {selectedCrypto.code} ≈ {exchangeRate.toFixed(2)} {paymentCurrency}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[rgb(var(--text-muted))]">Network Fee</span>
          <span className="font-semibold text-[rgb(var(--text-primary))]">
            Included
          </span>
        </div>
        <div className="pt-3 border-t border-[rgb(var(--surface))]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[rgb(var(--text-muted))]">You Receive</span>
            <span className="font-bold text-lg text-[rgb(var(--success))]">
              {cryptoAmount} {selectedCrypto.code}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-2">
        <Label>Payment Method</Label>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 rounded-lg border bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))] cursor-pointer">
            <div className="text-3xl mb-2">💳</div>
            <div className="text-sm font-semibold text-[rgb(var(--text-primary))]">
              Credit/Debit Card
            </div>
          </button>
          <button className="p-4 rounded-lg border bg-[rgb(var(--bg-base))] border-[rgb(var(--surface))] hover:border-[rgb(var(--primary))]/50 cursor-pointer">
            <div className="text-3xl mb-2">🏦</div>
            <div className="text-sm font-semibold text-[rgb(var(--text-primary))]">
              Bank Transfer
            </div>
          </button>
        </div>
      </div>

      {/* Buy Button */}
      <Button onClick={handleBuy} className="w-full" size="lg">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Buy {selectedCrypto.code}
      </Button>

      {/* Disclaimer */}
      <p className="text-xs text-[rgb(var(--text-muted))] text-center">
        By purchasing cryptocurrency, you agree to our Terms of Service and acknowledge the risks involved in crypto trading.
      </p>
    </div>
  )
}

