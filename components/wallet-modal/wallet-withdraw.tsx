'use client'

import { useState } from 'react'
import { AlertTriangle, ChevronDown } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'
import { formatBalance } from '@/lib/wallet-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

// Mock withdrawal fees
const getWithdrawalFee = (currencyCode: string) => {
  const fees: Record<string, number> = {
    BTC: 0.0005,
    ETH: 0.005,
    USDT: 1,
    USDC: 1,
    LTC: 0.001,
    BCH: 0.001,
    DOGE: 1,
    XRP: 0.2,
    TRX: 1,
    SOL: 0.01,
    USD: 2.5,
    EUR: 2,
    CAD: 3,
    RUB: 50,
    JPY: 250,
    GBP: 2,
  }
  return fees[currencyCode] || 0
}

export function WalletWithdraw() {
  const { activeWallet, wallets, setActiveWallet } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState(activeWallet)
  const [showWalletSelect, setShowWalletSelect] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawAddress, setWithdrawAddress] = useState('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  if (!selectedWallet) return null

  const isCrypto = selectedWallet.currency.type === 'crypto'
  const withdrawalFee = getWithdrawalFee(selectedWallet.currency.code)
  const minWithdrawal = isCrypto ? withdrawalFee * 2 : 10
  const maxWithdrawal = selectedWallet.balance
  const amountAfterFee = withdrawAmount ? parseFloat(withdrawAmount) - withdrawalFee : 0

  const handleWalletChange = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    if (wallet) {
      setSelectedWallet(wallet)
      setActiveWallet(walletId)
    }
    setShowWalletSelect(false)
  }

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount)
    
    if (!withdrawAmount || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid withdrawal amount',
        variant: 'destructive',
      })
      return
    }

    if (amount < minWithdrawal) {
      toast({
        title: 'Amount Too Low',
        description: `Minimum withdrawal is ${formatBalance(minWithdrawal, selectedWallet.currency.code)}`,
        variant: 'destructive',
      })
      return
    }

    if (amount > maxWithdrawal) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough balance for this withdrawal',
        variant: 'destructive',
      })
      return
    }

    if (isCrypto && !withdrawAddress) {
      toast({
        title: 'Address Required',
        description: 'Please enter a withdrawal address',
        variant: 'destructive',
      })
      return
    }

    // Mock withdrawal - in real app, process withdrawal
    updateWalletBalance(selectedWallet.id, selectedWallet.balance - amount)
    
    toast({
      title: 'Withdrawal Initiated',
      description: `Withdrawing ${formatBalance(amountAfterFee, selectedWallet.currency.code)} from your wallet`,
    })
    
    setWithdrawAmount('')
    setWithdrawAddress('')
  }

  const fiatPaymentMethods = [
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', minWithdrawal: 50, maxWithdrawal: 50000 },
    { id: 'card', name: 'Card Withdrawal', icon: '💳', minWithdrawal: 10, maxWithdrawal: 10000 },
  ]

  return (
    <div className="space-y-6">
      {/* Coming Soon Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-[rgb(var(--text-primary))] mb-1">
              Demo Mode - Withdrawal System Coming Soon
            </h4>
            <p className="text-xs text-[rgb(var(--text-muted))]">
              This is a UI demonstration. Real withdrawal functionality requires backend integration and KYC verification.
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
              {wallets.filter((w) => w.balance > 0).map((wallet) => (
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

      {selectedWallet.balance === 0 ? (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
          <p className="text-[rgb(var(--text-muted))]">
            Your {selectedWallet.currency.code} wallet is empty. Please deposit funds first.
          </p>
        </div>
      ) : (
        <>
          {isCrypto ? (
            /* Crypto Withdrawal */
            <>
              {/* Warning */}
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-300">
                  <p className="font-semibold mb-1">Important Notice</p>
                  <p>
                    Only withdraw {selectedWallet.currency.code} to a {selectedWallet.currency.network} address.
                    Withdrawing to other networks will result in permanent loss of funds.
                  </p>
                </div>
              </div>

              {/* Withdrawal Address */}
              <div className="space-y-2">
                <Label>Withdrawal Address</Label>
              <Input
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                placeholder={`Enter ${selectedWallet.currency.code} address`}
                className="font-mono text-sm bg-[#0f0a1f] border-purple-800/30"
              />
              </div>

              {/* Withdrawal Amount */}
              <div className="space-y-2">
                <Label>Withdrawal Amount</Label>
                <div className="relative">
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="pr-24 bg-[#0f0a1f] border-purple-800/30"
                  />
                  <button
                    onClick={() => setWithdrawAmount((maxWithdrawal - withdrawalFee).toString())}
                    className="absolute right-14 top-1/2 -translate-y-1/2 text-xs font-semibold text-[rgb(var(--primary))] hover:text-[rgb(var(--primary))]/80 cursor-pointer"
                  >
                    MAX
                  </button>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[rgb(var(--text-muted))]">
                    {selectedWallet.currency.code}
                  </span>
                </div>
              </div>

              {/* Withdrawal Summary */}
              <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 space-y-2 border border-[rgb(var(--surface))]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[rgb(var(--text-muted))]">Withdrawal Amount</span>
                  <span className="font-semibold text-[rgb(var(--text-primary))]">
                    {withdrawAmount ? formatBalance(parseFloat(withdrawAmount), selectedWallet.currency.code) : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[rgb(var(--text-muted))]">Network Fee</span>
                  <span className="font-semibold text-[rgb(var(--error))]">
                    -{formatBalance(withdrawalFee, selectedWallet.currency.code)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[rgb(var(--surface))]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[rgb(var(--text-muted))]">You Will Receive</span>
                    <span className="font-bold text-lg text-[rgb(var(--success))]">
                      {withdrawAmount && amountAfterFee > 0 
                        ? formatBalance(amountAfterFee, selectedWallet.currency.code) 
                        : '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-[rgb(var(--text-muted))]">Min Withdrawal</span>
                  <span className="font-semibold text-[rgb(var(--text-primary))]">
                    {formatBalance(minWithdrawal, selectedWallet.currency.code)}
                  </span>
                </div>
              </div>

              {/* Withdraw Button */}
              <Button onClick={handleWithdraw} className="w-full" size="lg">
                Withdraw {withdrawAmount && formatBalance(parseFloat(withdrawAmount), selectedWallet.currency.code)}
              </Button>
            </>
          ) : (
            /* Fiat Withdrawal */
            <>
              {/* Payment Methods */}
              <div className="space-y-2">
                <Label>Withdrawal Method</Label>
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
                  {/* Withdrawal Amount */}
                  <div className="space-y-2">
                    <Label>Withdrawal Amount</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="pr-24 bg-[#0f0a1f] border-purple-800/30"
                      />
                      <button
                        onClick={() => setWithdrawAmount(maxWithdrawal.toString())}
                        className="absolute right-14 top-1/2 -translate-y-1/2 text-xs font-semibold text-[rgb(var(--primary))] hover:text-[rgb(var(--primary))]/80 cursor-pointer"
                      >
                        MAX
                      </button>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[rgb(var(--text-muted))]">
                        {selectedWallet.currency.code}
                      </span>
                    </div>
                  </div>

                  {/* Withdrawal Summary */}
                  <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 space-y-2 border border-[rgb(var(--surface))]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[rgb(var(--text-muted))]">Withdrawal Amount</span>
                      <span className="font-semibold text-[rgb(var(--text-primary))]">
                        {withdrawAmount ? formatBalance(parseFloat(withdrawAmount), selectedWallet.currency.code) : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[rgb(var(--text-muted))]">Processing Fee</span>
                      <span className="font-semibold text-[rgb(var(--error))]">
                        -{formatBalance(withdrawalFee, selectedWallet.currency.code)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[rgb(var(--surface))]">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[rgb(var(--text-muted))]">You Will Receive</span>
                        <span className="font-bold text-lg text-[rgb(var(--success))]">
                          {withdrawAmount && amountAfterFee > 0 
                            ? formatBalance(amountAfterFee, selectedWallet.currency.code) 
                            : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2">
                      <span className="text-[rgb(var(--text-muted))]">Processing Time</span>
                      <span className="font-semibold text-[rgb(var(--text-primary))]">
                        1-3 business days
                      </span>
                    </div>
                  </div>

                  {/* Withdraw Button */}
                  <Button onClick={handleWithdraw} className="w-full" size="lg">
                    Withdraw {withdrawAmount && formatBalance(parseFloat(withdrawAmount), selectedWallet.currency.code)}
                  </Button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

