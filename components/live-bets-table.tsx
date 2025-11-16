'use client'

import { useState } from 'react'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'
import { mockLiveBets, type LiveBet } from '@/lib/mock-data'

export function LiveBetsTable() {
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'high' | 'race'>('all')
  const [ghostMode, setGhostMode] = useState(false)
  const [perPage, setPerPage] = useState(10)

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier === 0) return 'text-[rgb(var(--error))]'
    if (multiplier < 2) return 'text-[rgb(var(--text-muted))]'
    if (multiplier >= 10) return 'text-[rgb(var(--success))]'
    return 'text-[rgb(var(--secondary))]'
  }

  const getPayoutColor = (payout: number) => {
    return payout > 0 ? 'text-[rgb(var(--success))]' : 'text-[rgb(var(--error))]'
  }

  return (
    <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl overflow-hidden shadow-card mb-8">
      {/* Tab Bar */}
      <div className="flex items-center justify-between border-b border-[rgb(var(--surface))] px-6 py-4">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('my')}
            className={`pb-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'my'
                ? 'border-[rgb(var(--primary))] text-white'
                : 'border-transparent text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-secondary))]'
            }`}
          >
            My Bets
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'border-[rgb(var(--primary))] text-white'
                : 'border-transparent text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-secondary))]'
            }`}
          >
            All Bets
          </button>
          <button
            onClick={() => setActiveTab('high')}
            className={`pb-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'high'
                ? 'border-[rgb(var(--primary))] text-white'
                : 'border-transparent text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-secondary))]'
            }`}
          >
            High Rollers
          </button>
          <button
            onClick={() => setActiveTab('race')}
            className={`pb-2 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'race'
                ? 'border-[rgb(var(--primary))] text-white'
                : 'border-transparent text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-secondary))]'
            }`}
          >
            Race Leaderboard
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setGhostMode(!ghostMode)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[rgb(var(--surface))] hover:bg-[rgb(var(--surface-hover))] rounded-lg text-sm text-[rgb(var(--text-secondary))] transition-colors cursor-pointer"
          >
            {ghostMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>Ghost Mode {ghostMode ? 'On' : 'Off'}</span>
          </button>
          <div className="relative">
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="appearance-none bg-[rgb(var(--surface))] hover:bg-[rgb(var(--surface-hover))] px-3 py-1.5 pr-8 rounded-lg text-sm text-[rgb(var(--text-secondary))] cursor-pointer transition-colors"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--text-muted))] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgb(var(--surface))]">
              <th className="px-6 py-3 text-left text-xs font-semibold text-[rgb(var(--text-muted))] uppercase">Game</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[rgb(var(--text-muted))] uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[rgb(var(--text-muted))] uppercase">Time</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[rgb(var(--text-muted))] uppercase">Bet Amount</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[rgb(var(--text-muted))] uppercase">Multiplier</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-[rgb(var(--text-muted))] uppercase">Payout</th>
            </tr>
          </thead>
          <tbody>
            {mockLiveBets.slice(0, perPage).map((bet, index) => (
              <tr
                key={bet.id}
                className={`border-b border-[rgb(var(--bg-elevated))] hover:bg-[rgb(var(--surface))] transition-colors ${
                  index % 2 === 0 ? 'bg-[rgb(var(--bg-elevated))]' : 'bg-[rgb(var(--bg-base))]'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{bet.gameIcon}</span>
                    <span className="text-sm font-medium text-[rgb(var(--text-primary))]">{bet.game}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[rgb(var(--text-secondary))]">
                    {bet.isHidden || ghostMode ? '👤 Hidden' : bet.user}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[rgb(var(--text-muted))] font-mono">{bet.time}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-[rgb(var(--text-primary))] font-mono">
                    {bet.currency} {bet.betAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-semibold font-mono ${getMultiplierColor(bet.multiplier)}`}>
                    {bet.multiplier.toFixed(2)}x
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-sm font-semibold font-mono ${getPayoutColor(bet.payout)}`}>
                    {bet.payout > 0 ? '+' : ''}{bet.currency} {bet.payout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
