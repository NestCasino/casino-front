import { calculateTotalStake, calculateTotalReturn } from '@/components/bet-slip'

interface BetSlipItem {
  id: string
  match: string
  selection: string
  odds: number
  stake: number
}

describe('BetSlip calculations', () => {
  const baseBet: BetSlipItem = {
    id: '1',
    match: 'Man United vs Liverpool',
    selection: 'Man United to win',
    odds: 2.1,
    stake: 100,
  }

  it('calculates totals when items are added', () => {
    const bets: BetSlipItem[] = [
      baseBet,
      { ...baseBet, id: '2', stake: 50, odds: 1.5 },
    ]

    expect(calculateTotalStake(bets)).toBe(150)
    expect(calculateTotalReturn(bets)).toBeCloseTo(100 * 2.1 + 50 * 1.5)
  })

  it('calculates totals when items are removed', () => {
    const bets: BetSlipItem[] = [
      baseBet,
      { ...baseBet, id: '2', stake: 50, odds: 1.5 },
    ]

    const remaining = bets.filter((bet) => bet.id === '1')

    expect(calculateTotalStake(remaining)).toBe(100)
    expect(calculateTotalReturn(remaining)).toBeCloseTo(100 * 2.1)
  })

  it('recalculates totals when an item is updated', () => {
    const bets: BetSlipItem[] = [baseBet]

    const updated = bets.map((bet) =>
      bet.id === '1' ? { ...bet, stake: 200, odds: 3.0 } : bet
    )

    expect(calculateTotalStake(updated)).toBe(200)
    expect(calculateTotalReturn(updated)).toBeCloseTo(200 * 3.0)
  })
})