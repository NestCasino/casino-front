'use client'

import { useState } from 'react'
import { Copy, QrCode, RefreshCw, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'
import { formatBalance, AVAILABLE_CURRENCIES, getCurrencyByCode } from '@/lib/wallet-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

// Mock deposit addresses
const generateDepositAddress = (currencyCode: string) => {
  const mockAddresses: Record<string, string> = {
    BTC: 'bc1qm9mfun9uzusdphln8quqrkssk7w0qdplzrll',
    ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
    USDT: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
    USDC: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
    LTC: 'ltc1qm9mfun9uzusdphln8quqrkssk7w0qdplzrll',
    BCH: 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
    DOGE: 'D7Y55MzkpJzSQHLKARvSRqruQ74SQWzRUE',
    XRP: 'rN7n7otQDd6FczFgLdzmVQ4VFMhKnGjKPQ',
    TRX: 'TYDNGYHAuZZA5d6FczFgLdzmVQ4VFMhKnG',
    SOL: '7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi',
  }
  return mockAddresses[currencyCode] || 'N/A'
}

// Mock payment methods for fiat
const fiatPaymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', minDeposit: 10, maxDeposit: 10000 },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', minDeposit: 50, maxDeposit: 50000 },
  { id: 'mifinity', name: 'MiFinity', icon: '💰', minDeposit: 10, maxDeposit: 5000 },
  { id: 'jetonbank', name: 'JetonBank', icon: '💵', minDeposit: 10, maxDeposit: 5000 },
]

export function WalletDeposit() {
  const { activeWallet, wallets, setActiveWallet } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState(activeWallet)
  const [showWalletSelect, setShowWalletSelect] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [depositAmount, setDepositAmount] = useState('')
  const [copied, setCopied] = useState(false)

  if (!selectedWallet) return null

  const isCrypto = selectedWallet.currency.type === 'crypto'
  const depositAddress = generateDepositAddress(selectedWallet.currency.code)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress)
    setCopied(true)
    toast({
      title: 'Copied!',
      description: 'Deposit address copied to clipboard',
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWalletChange = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    if (wallet) {
      setSelectedWallet(wallet)
      setActiveWallet(walletId)
    }
    setShowWalletSelect(false)
  }

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid deposit amount',
        variant: 'destructive',
      })
      return
    }

    // Mock deposit - in real app, process payment
    const amount = parseFloat(depositAmount)
    updateWalletBalance(selectedWallet.id, selectedWallet.balance + amount)
    
    toast({
      title: 'Deposit Initiated',
      description: `Depositing ${formatBalance(amount, selectedWallet.currency.code)} to your wallet`,
    })
    
    setDepositAmount('')
  }

  return (
    <div className="space-y-6">
      {/* Coming Soon Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-[rgb(var(--text-primary))] mb-1">
              Demo Mode - Payment Integration Coming Soon
            </h4>
            <p className="text-xs text-[rgb(var(--text-muted))]">
              This is a UI demonstration. Real deposit functionality requires payment provider integration.
            </p>
          </div>
        </div>
      </div>

      {/* Currency Selector */}
      <div className="space-y-2">
        <Label>Currency</Label>
        <div className="relative">
          <button
            onClick={() => setShowWalletSelect(!showWalletSelect)}
            className="w-full flex items-center justify-between p-4 bg-[#0f0a1f] border border-purple-800/30 rounded-lg hover:border-purple-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedWallet.currency.icon}</span>
              <div className="text-left">
                <div className="font-semibold text-[rgb(var(--text-primary))]">
                  {selectedWallet.currency.code}
                </div>
                <div className="text-sm text-[rgb(var(--text-muted))]">
                  {selectedWallet.currency.name}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                {formatBalance(selectedWallet.balance, selectedWallet.currency.code)}
              </span>
              <ChevronDown className={cn(
                "h-4 w-4 text-[rgb(var(--text-muted))] transition-transform",
                showWalletSelect && "rotate-180"
              )} />
            </div>
          </button>

          {showWalletSelect && (
            <div className="absolute top-full mt-2 w-full bg-[#1a1534] border border-purple-800/30 rounded-lg shadow-2xl z-10 max-h-[200px] overflow-y-auto">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletChange(wallet.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-purple-800/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{wallet.currency.icon}</span>
                    <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                      {wallet.currency.code}
                    </span>
                  </div>
                  <span className="text-sm text-[rgb(var(--text-muted))]">
                    {formatBalance(wallet.balance, wallet.currency.code)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isCrypto ? (
        /* Crypto Deposit */
        <>
          {/* Network Info */}
          {selectedWallet.currency.network && (
            <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 border border-[rgb(var(--surface))]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[rgb(var(--text-muted))]">Network</span>
                <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                  {selectedWallet.currency.network}
                </span>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-300">
              <p className="font-semibold mb-1">Important Notice</p>
              <p>
                Only deposit {selectedWallet.currency.code} via the {selectedWallet.currency.network} network.
                Deposits of other assets or from other networks will be lost.
              </p>
            </div>
          </div>

          {/* Deposit Address */}
          <div className="space-y-2">
            <Label>Deposit Address</Label>
            <div className="relative">
              <Input
                value={depositAddress}
                readOnly
                className="pr-20 font-mono text-sm bg-[rgb(var(--bg-base))]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  onClick={handleCopyAddress}
                  className="p-2 hover:bg-[rgb(var(--surface))] rounded transition-colors"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-[rgb(var(--success))]" />
                  ) : (
                    <Copy className="h-4 w-4 text-[rgb(var(--text-muted))]" />
                  )}
                </button>
                <button className="p-2 hover:bg-[rgb(var(--surface))] rounded transition-colors">
                  <QrCode className="h-4 w-4 text-[rgb(var(--text-muted))]" />
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
              <QrCode className="h-32 w-32 text-gray-300" />
            </div>
          </div>

          {/* Confirmation Info */}
          <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 space-y-2 border border-[rgb(var(--surface))]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[rgb(var(--text-muted))]">Minimum Deposit</span>
              <span className="font-semibold text-[rgb(var(--text-primary))]">
                {selectedWallet.currency.code === 'BTC' ? '0.0001 BTC' : '0.01 ' + selectedWallet.currency.code}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[rgb(var(--text-muted))]">Confirmations Required</span>
              <span className="font-semibold text-[rgb(var(--text-primary))]">
                {selectedWallet.currency.code === 'BTC' ? '1' : '10'} Confirmations
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[rgb(var(--text-muted))]">Expected Arrival</span>
              <span className="font-semibold text-[rgb(var(--text-primary))]">
                10-30 minutes
              </span>
            </div>
          </div>
        </>
      ) : (
        /* Fiat Deposit */
        <>
          {/* Payment Methods */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              {fiatPaymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={cn(
                    "p-4 rounded-lg border transition-all cursor-pointer",
                    selectedPaymentMethod === method.id
                      ? "bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))]"
                      : "bg-[rgb(var(--bg-base))] border-[rgb(var(--surface))] hover:border-[rgb(var(--primary))]/50"
                  )}
                >
                  <div className="text-3xl mb-2">{method.icon}</div>
                  <div className="text-sm font-semibold text-[rgb(var(--text-primary))]">
                    {method.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedPaymentMethod && (
            <>
              {/* Deposit Amount */}
              <div className="space-y-2">
                <Label>Deposit Amount</Label>
                <div className="relative">
              <Input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount"
                className="pr-16 bg-[#0f0a1f] border-purple-800/30"
              />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[rgb(var(--text-muted))]">
                    {selectedWallet.currency.code}
                  </span>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {[50, 100, 200, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount.toString())}
                    className="px-3 py-2 bg-[rgb(var(--bg-base))] border border-[rgb(var(--surface))] rounded-lg hover:border-[rgb(var(--primary))]/50 transition-colors text-sm font-semibold cursor-pointer"
                  >
                    {amount}
                  </button>
                ))}
              </div>

              {/* Limits */}
              <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 space-y-2 border border-[rgb(var(--surface))]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[rgb(var(--text-muted))]">Minimum Deposit</span>
                  <span className="font-semibold text-[rgb(var(--text-primary))]">
                    {formatBalance(
                      fiatPaymentMethods.find((m) => m.id === selectedPaymentMethod)?.minDeposit || 0,
                      selectedWallet.currency.code
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[rgb(var(--text-muted))]">Maximum Deposit</span>
                  <span className="font-semibold text-[rgb(var(--text-primary))]">
                    {formatBalance(
                      fiatPaymentMethods.find((m) => m.id === selectedPaymentMethod)?.maxDeposit || 0,
                      selectedWallet.currency.code
                    )}
                  </span>
                </div>
              </div>

              {/* Deposit Button */}
              <Button onClick={handleDeposit} className="w-full" size="lg">
                Deposit {depositAmount && formatBalance(parseFloat(depositAmount), selectedWallet.currency.code)}
              </Button>
            </>
          )}
        </>
      )}
    </div>
  )
}

