import { mockGames } from '@/lib/mock-data'
import {
  filterOriginalsGames,
  filterSlotsGames,
  filterTrendingGames,
  filterLiveCasinoGames,
  filterBurstGames,
} from '@/lib/game-filters'

describe('Game filtering helpers used by CasinoPage and HomePage', () => {
  it('correctly categorizes originals games', () => {
    const originals = filterOriginalsGames(mockGames)
    expect(originals.length).toBeGreaterThan(0)
    expect(originals.every((game) => game.category.includes('originals'))).toBe(
      true,
    )
  })

  it('correctly categorizes slots games', () => {
    const slots = filterSlotsGames(mockGames)
    expect(slots.length).toBeGreaterThan(0)
    expect(slots.every((game) => game.category.includes('slots'))).toBe(true)
  })

  it('correctly categorizes trending games', () => {
    const trending = filterTrendingGames(mockGames)
    expect(trending.length).toBeGreaterThan(0)
    expect(trending.every((game) => game.category.includes('trending'))).toBe(
      true,
    )
  })

  it('correctly categorizes live casino games', () => {
    const liveCasino = filterLiveCasinoGames(mockGames)
    expect(liveCasino.length).toBeGreaterThan(0)
    expect(
      liveCasino.every((game) => game.category.includes('live-casino')),
    ).toBe(true)
  })

  it('correctly categorizes burst games (used on CasinoPage)', () => {
    const burst = filterBurstGames(mockGames)
    expect(burst.length).toBeGreaterThan(0)
    expect(burst.every((game) => game.category.includes('burst'))).toBe(true)
  })
})