'use client'

import { X, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface BetSlipItem {
  id: string
  match: string
  selection: string
  odds: number
  stake: number
}

// Helper functions extracted for easier unit testing
export function calculateTotalStake(bets: BetSlipItem[]): number {
  return bets.reduce((sum, bet) => sum + bet.stake, 0)
}

export function calculateTotalReturn(bets: BetSlipItem[]): number {
  return bets.reduce((sum, bet) => sum + bet.stake * bet.odds, 0)
}

export function BetSlip() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [bets, setBets] = useState<BetSlipItem[]>([
    {
      id: '1',
      match: 'Man United vs Liverpool',
      selection: 'Man United to win',
      odds: 2.10,
      stake: 100
    }
  ])

  const totalStake = calculateTotalStake(bets)
  const totalReturn = calculateTotalReturn(bets)

  const removeBet = (id: string) => {
    setBets(bets.filter(bet => bet.id !== id))
  }

  const updateStake = (id: string, stake: number) => {
    setBets(bets.map(bet => bet.id === id ? { ...bet, stake } : bet))
  }

  return (
    <div className="fixed right-4 top-24 w-80 bg-[rgb(var(--bg-elevated))] rounded-2xl shadow-elevated border border-[rgb(var(--surface))] z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--surface))]">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Bet Slip</h3>
          {bets.length > 0 && (
            <div className="w-5 h-5 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center text-xs text-white font-bold">
              {bets.length}
            </div>
          )}
        </div>
        <button
          onClick={() => setBets([])}
          className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--error))] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Bet Items */}
      {bets.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-[rgb(var(--text-muted))]">Your bet slip is empty</p>
        </div>
      ) : (
        <>
          <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
            {bets.map((bet) => (
              <div key={bet.id} className="bg-[rgb(var(--surface))] rounded-xl p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-[rgb(var(--text-muted))] mb-1">{bet.match}</p>
                    <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">{bet.selection}</p>
                    <p className="text-xs text-[rgb(var(--secondary))] font-bold mt-1">Odds: {bet.odds.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeBet(bet.id)}
                    className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--error))] transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <label className="text-xs text-[rgb(var(--text-muted))] mb-1 block">Stake</label>
                  <input
                    type="number"
                    value={bet.stake}
                    onChange={(e) => updateStake(bet.id, Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[rgb(var(--bg-base))] border border-[rgb(var(--surface-hover))] rounded-lg text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="p-4 bg-[rgb(var(--surface))] space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[rgb(var(--text-muted))]">Total Stake</span>
              <span className="font-semibold text-[rgb(var(--text-primary))]">RUB {totalStake.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[rgb(var(--text-muted))]">Potential Return</span>
              <span className="font-bold text-[rgb(var(--success))]">RUB {totalReturn.toFixed(2)}</span>
            </div>
            <button className="w-full py-3 bg-[rgb(var(--success))] hover:brightness-110 rounded-xl font-semibold text-white transition-all">
              Place {bets.length === 1 ? 'Bet' : 'Bets'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
