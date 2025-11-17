import type { Game } from '@/lib/mock-data'

export function filterOriginalsGames(games: Game[]): Game[] {
  return games.filter((game) => game.category.includes('originals'))
}

export function filterSlotsGames(games: Game[]): Game[] {
  return games.filter((game) => game.category.includes('slots'))
}

export function filterTrendingGames(games: Game[]): Game[] {
  return games.filter((game) => game.category.includes('trending'))
}

export function filterLiveCasinoGames(games: Game[]): Game[] {
  return games.filter((game) => game.category.includes('live-casino'))
}

export function filterBurstGames(games: Game[]): Game[] {
  return games.filter((game) => game.category.includes('burst'))
}