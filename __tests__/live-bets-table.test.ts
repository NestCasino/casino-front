import { mockLiveBets } from '@/lib/mock-data'
import {
  filterLiveBets,
  getVisibleLiveBets,
  type LiveBetsTab,
} from '@/components/live-bets-table'

describe('LiveBetsTable filtering and pagination', () => {
  const tabs: LiveBetsTab[] = ['all', 'my', 'high', 'race']

  it('returns all bets for the "all" tab', () => {
    const result = filterLiveBets(mockLiveBets, 'all')
    expect(result).toHaveLength(mockLiveBets.length)
  })

  it('filters out hidden bets for the "my" tab', () => {
    const result = filterLiveBets(mockLiveBets, 'my')
    expect(result.every((bet) => !bet.isHidden)).toBe(true)
  })

  it('returns only high-roller bets for the "high" tab', () => {
    const result = filterLiveBets(mockLiveBets, 'high')
    expect(result.length).toBeGreaterThan(0)
    expect(
      result.every(
        (bet) => bet.betAmount >= 20000 || bet.payout >= 100000,
      ),
    ).toBe(true)
  })

  it('returns only race leaderboard bets for the "race" tab', () => {
    const result = filterLiveBets(mockLiveBets, 'race')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((bet) => bet.multiplier >= 10)).toBe(true)
  })

  it('applies perPage limit on top of filtering', () => {
    const perPage = 3
    tabs.forEach((tab) => {
      const visible = getVisibleLiveBets(mockLiveBets, tab, perPage)
      expect(visible.length).toBeLessThanOrEqual(perPage)
    })
  })
})