'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/user-context'
import { useWallet } from '@/lib/wallet-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  generateMockCasinoHistory, 
  generateMockSportsHistory, 
  generateMockBonusHistory,
  MockCasinoHistory,
  MockSportsHistory,
  MockBonusHistory
} from '@/lib/settings-mock-data'
import { TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, AlertCircle, Trophy } from 'lucide-react'

interface HistorySectionProps {
  user: User
}

export function HistorySection({ user }: HistorySectionProps) {
  const { transactions, refreshTransactions } = useWallet()
  const [casinoHistory, setCasinoHistory] = useState<MockCasinoHistory[]>([])
  const [sportsHistory, setSportsHistory] = useState<MockSportsHistory[]>([])
  const [bonusHistory, setBonusHistory] = useState<MockBonusHistory[]>([])
  
  useEffect(() => {
    refreshTransactions()
    setCasinoHistory(generateMockCasinoHistory())
    setSportsHistory(generateMockSportsHistory())
    setBonusHistory(generateMockBonusHistory())
  }, [])
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'won':
      case 'win':
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-[rgb(var(--success))]" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
      case 'lost':
      case 'loss':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-[rgb(var(--error))]" />
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-[rgb(var(--text-muted))]" />
      default:
        return null
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'won':
      case 'win':
      case 'active':
        return 'text-[rgb(var(--success))]'
      case 'pending':
        return 'text-yellow-500'
      case 'failed':
      case 'lost':
      case 'loss':
      case 'cancelled':
        return 'text-[rgb(var(--error))]'
      case 'expired':
        return 'text-[rgb(var(--text-muted))]'
      default:
        return 'text-[rgb(var(--text-primary))]'
    }
  }
  
  return (
    <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
      <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">History</h2>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-4 gap-2 bg-[#3d2b5e] p-1 rounded-xl mb-6">
          <TabsTrigger value="transactions" className="rounded-lg data-[state=active]:bg-[rgb(var(--primary))] data-[state=active]:text-white">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="casino" className="rounded-lg data-[state=active]:bg-[rgb(var(--primary))] data-[state=active]:text-white">
            Casino
          </TabsTrigger>
          <TabsTrigger value="sports" className="rounded-lg data-[state=active]:bg-[rgb(var(--primary))] data-[state=active]:text-white">
            Sports
          </TabsTrigger>
          <TabsTrigger value="bonus" className="rounded-lg data-[state=active]:bg-[rgb(var(--primary))] data-[state=active]:text-white">
            Bonuses
          </TabsTrigger>
        </TabsList>
        
        {/* Transactions History */}
        <TabsContent value="transactions" className="mt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[rgb(var(--text-muted))]">
                Date from / to:
              </p>
              <div className="flex gap-2">
                <select className="px-3 py-2 bg-[#3d2b5e] border border-[#5d4b7e] rounded-lg text-sm text-[rgb(var(--text-primary))]">
                  <option value="all">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdraw">Withdraw</option>
                  <option value="bet">Bet</option>
                  <option value="win">Win</option>
                </select>
                <select className="px-3 py-2 bg-[#3d2b5e] border border-[#5d4b7e] rounded-lg text-sm text-[rgb(var(--text-primary))]">
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            
            {transactions.length === 0 ? (
              <div className="py-12 text-center">
                <Trophy className="h-16 w-16 text-[rgb(var(--text-muted))] mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-2">There is no data yet!</p>
                <p className="text-sm text-[rgb(var(--text-muted))]">
                  You don't have any successful transactions yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#5d4b7e]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Type</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Currency</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-[#3d2b5e] hover:bg-[#3d2b5e] transition-colors">
                        <td className="py-3 px-4 text-sm text-[rgb(var(--text-primary))]">
                          {formatDate(tx.timestamp)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#3d2b5e] rounded-lg text-sm capitalize">
                            {tx.type === 'deposit' && <TrendingUp className="h-4 w-4 text-[rgb(var(--success))]" />}
                            {tx.type === 'withdraw' && <TrendingDown className="h-4 w-4 text-[rgb(var(--error))]" />}
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-semibold text-[rgb(var(--text-primary))]">
                          {tx.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-[rgb(var(--text-primary))]">
                          {tx.currency}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-2 text-sm font-semibold capitalize ${getStatusColor(tx.status)}`}>
                            {getStatusIcon(tx.status)}
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Casino History */}
        <TabsContent value="casino" className="mt-0">
          <div className="space-y-4">
            <div className="p-3 bg-[#3d2b5e] rounded-lg border border-[#5d4b7e] flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <p className="text-xs text-[rgb(var(--text-muted))]">
                This is demo data for preview purposes only.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5d4b7e]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Game</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Bet</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Win</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {casinoHistory.map((game) => (
                    <tr key={game.id} className="border-b border-[#3d2b5e] hover:bg-[#3d2b5e] transition-colors">
                      <td className="py-3 px-4 text-sm text-[rgb(var(--text-primary))]">
                        {formatDate(game.date)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-[rgb(var(--text-primary))]">
                        {game.game}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-[rgb(var(--text-primary))]">
                        {game.betAmount.toFixed(2)} {game.currency}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-semibold text-[rgb(var(--success))]">
                        {game.winAmount > 0 ? `${game.winAmount.toFixed(2)} ${game.currency}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-2 text-sm font-semibold capitalize ${getStatusColor(game.status)}`}>
                          {getStatusIcon(game.status)}
                          {game.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        {/* Sports History */}
        <TabsContent value="sports" className="mt-0">
          <div className="space-y-4">
            <div className="p-3 bg-[#3d2b5e] rounded-lg border border-[#5d4b7e] flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <p className="text-xs text-[rgb(var(--text-muted))]">
                This is demo data for preview purposes only.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5d4b7e]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Event</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Bet Type</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Odds</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Stake</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Return</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sportsHistory.map((bet) => (
                    <tr key={bet.id} className="border-b border-[#3d2b5e] hover:bg-[#3d2b5e] transition-colors">
                      <td className="py-3 px-4 text-sm text-[rgb(var(--text-primary))]">
                        {formatDate(bet.date)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-[rgb(var(--text-primary))]">
                        {bet.event}
                      </td>
                      <td className="py-3 px-4 text-sm text-[rgb(var(--text-primary))]">
                        {bet.betType}
                      </td>
                      <td className="py-3 px-4 text-center text-sm font-semibold text-[rgb(var(--primary))]">
                        {bet.odds.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-[rgb(var(--text-primary))]">
                        {bet.stake.toFixed(2)} {bet.currency}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-semibold text-[rgb(var(--success))]">
                        {bet.return > 0 ? `${bet.return.toFixed(2)} ${bet.currency}` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-2 text-sm font-semibold capitalize ${getStatusColor(bet.status)}`}>
                          {getStatusIcon(bet.status)}
                          {bet.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        {/* Bonus History */}
        <TabsContent value="bonus" className="mt-0">
          <div className="space-y-4">
            <div className="p-3 bg-[#3d2b5e] rounded-lg border border-[#5d4b7e] flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <p className="text-xs text-[rgb(var(--text-muted))]">
                This is demo data for preview purposes only.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5d4b7e]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Bonus Type</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[rgb(var(--text-secondary))]">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {bonusHistory.map((bonus) => (
                    <tr key={bonus.id} className="border-b border-[#3d2b5e] hover:bg-[#3d2b5e] transition-colors">
                      <td className="py-3 px-4 text-sm text-[rgb(var(--text-primary))]">
                        {formatDate(bonus.date)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-[rgb(var(--text-primary))]">
                        {bonus.bonusType}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-semibold text-[rgb(var(--text-primary))]">
                        {bonus.amount.toFixed(2)} {bonus.currency}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-2 text-sm font-semibold capitalize ${getStatusColor(bonus.status)}`}>
                          {getStatusIcon(bonus.status)}
                          {bonus.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[rgb(var(--text-primary))]">
                        {formatDate(bonus.expiry)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}








