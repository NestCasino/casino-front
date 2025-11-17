'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Gift, Trophy, CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'
import { formatBalance } from '@/lib/wallet-types'
import { cn } from '@/lib/utils'

// Mock transactions for display
const mockTransactions = [
  {
    id: 'tx-1',
    type: 'deposit',
    amount: 100,
    currency: 'USD',
    status: 'completed',
    timestamp: '2025-11-17T10:30:00',
    description: 'Card Deposit',
  },
  {
    id: 'tx-2',
    type: 'win',
    amount: 250.50,
    currency: 'USD',
    status: 'completed',
    timestamp: '2025-11-17T09:15:00',
    description: 'Sweet Bonanza - Win',
  },
  {
    id: 'tx-3',
    type: 'bet',
    amount: 50,
    currency: 'USD',
    status: 'completed',
    timestamp: '2025-11-17T09:10:00',
    description: 'Sweet Bonanza - Bet',
  },
  {
    id: 'tx-4',
    type: 'withdraw',
    amount: 200,
    currency: 'BTC',
    status: 'pending',
    timestamp: '2025-11-17T08:45:00',
    description: 'Crypto Withdrawal',
    txHash: 'bc1qm9mfun9uzusdphln8quqrkssk7w0qdplzrll',
  },
  {
    id: 'tx-5',
    type: 'deposit',
    amount: 0.005,
    currency: 'BTC',
    status: 'completed',
    timestamp: '2025-11-16T22:30:00',
    description: 'Crypto Deposit',
    confirmations: 3,
  },
  {
    id: 'tx-6',
    type: 'bonus',
    amount: 50,
    currency: 'USD',
    status: 'completed',
    timestamp: '2025-11-16T20:00:00',
    description: 'Welcome Bonus',
  },
]

const typeConfig = {
  deposit: {
    icon: TrendingDown,
    label: 'Deposit',
    color: 'text-[rgb(var(--success))]',
    bg: 'bg-[rgb(var(--success))]/10',
  },
  withdraw: {
    icon: TrendingUp,
    label: 'Withdrawal',
    color: 'text-[rgb(var(--error))]',
    bg: 'bg-[rgb(var(--error))]/10',
  },
  bet: {
    icon: Trophy,
    label: 'Bet',
    color: 'text-[rgb(var(--warning))]',
    bg: 'bg-[rgb(var(--warning))]/10',
  },
  win: {
    icon: Trophy,
    label: 'Win',
    color: 'text-[rgb(var(--success))]',
    bg: 'bg-[rgb(var(--success))]/10',
  },
  bonus: {
    icon: Gift,
    label: 'Bonus',
    color: 'text-[rgb(var(--info))]',
    bg: 'bg-[rgb(var(--info))]/10',
  },
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'text-[rgb(var(--success))]',
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    color: 'text-[rgb(var(--warning))]',
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    color: 'text-[rgb(var(--error))]',
  },
  cancelled: {
    icon: XCircle,
    label: 'Cancelled',
    color: 'text-[rgb(var(--text-muted))]',
  },
}

export function WalletTransactions() {
  const { transactions, activeWallet } = useWallet()
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw' | 'bet' | 'win'>('all')

  // Use mock transactions if no real transactions
  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions

  const filteredTransactions = filter === 'all'
    ? displayTransactions
    : displayTransactions.filter((tx) => tx.type === filter)

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'deposit', 'withdraw', 'bet', 'win'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all cursor-pointer",
              filter === filterType
                ? "bg-[rgb(var(--primary))] text-white"
                : "bg-[rgb(var(--bg-base))] text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface))]"
            )}
          >
            {filterType === 'all' ? 'All' : typeConfig[filterType].label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {filteredTransactions.length > 0 ? (
        <div className="space-y-2">
          {filteredTransactions.map((transaction) => {
            const config = typeConfig[transaction.type as keyof typeof typeConfig]
            const status = statusConfig[transaction.status as keyof typeof statusConfig]
            const Icon = config.icon
            const StatusIcon = status.icon
            const isPositive = transaction.type === 'deposit' || transaction.type === 'win' || transaction.type === 'bonus'

            return (
              <div
                key={transaction.id}
                className="p-4 bg-[rgb(var(--bg-base))] rounded-lg border border-[rgb(var(--surface))] hover:border-[rgb(var(--primary))]/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Icon */}
                    <div className={cn("p-2 rounded-lg", config.bg)}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-[rgb(var(--text-primary))]">
                          {config.label}
                        </h4>
                        <div className="flex items-center gap-1">
                          <StatusIcon className={cn("h-3 w-3", status.color)} />
                          <span className={cn("text-xs font-medium", status.color)}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-[rgb(var(--text-muted))] mb-1">
                        {transaction.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-muted))]">
                        <span>{formatDate(transaction.timestamp)}</span>
                        <span>•</span>
                        <span>{formatTime(transaction.timestamp)}</span>
                      </div>

                      {/* Transaction Hash for crypto */}
                      {transaction.txHash && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-xs text-[rgb(var(--text-muted))]">
                            TxHash: {transaction.txHash.slice(0, 10)}...{transaction.txHash.slice(-6)}
                          </span>
                          <button className="p-1 hover:bg-[rgb(var(--surface))] rounded transition-colors">
                            <ExternalLink className="h-3 w-3 text-[rgb(var(--text-muted))]" />
                          </button>
                        </div>
                      )}

                      {/* Confirmations for crypto deposits */}
                      {transaction.confirmations !== undefined && (
                        <div className="mt-2">
                          <span className="text-xs text-[rgb(var(--text-muted))]">
                            {transaction.confirmations} confirmations
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className={cn(
                      "text-lg font-bold",
                      isPositive ? "text-[rgb(var(--success))]" : "text-[rgb(var(--error))]"
                    )}>
                      {isPositive ? '+' : '-'}
                      {formatBalance(transaction.amount, transaction.currency)}
                    </div>
                    <div className="text-xs text-[rgb(var(--text-muted))]">
                      {transaction.currency}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-2">
            No Transactions Yet
          </h3>
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Your transaction history will appear here
          </p>
        </div>
      )}
    </div>
  )
}

