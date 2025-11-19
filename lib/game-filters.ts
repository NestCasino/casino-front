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

export function filterNewReleasesGames(games: Game[]): Game[] {
  return games.filter((game) => game.category.includes('new-releases'))
}

export function filterGameShowsGames(games: Game[]): Game[] {
  return games.filter((game) => game.category.includes('game-shows'))
}

export function filterRouletteGames(games: Game[]): Game[] {
  return games.filter((game) => game.category.includes('roulette'))
}

export function filterBlackjackGames(games: Game[]): Game[] {
  return games.filter((game) => game.category.includes('blackjack'))
}

export function filterBaccaratGames(games: Game[]): Game[] {
  return games.filter((game) => game.category.includes('baccarat'))
}

export function filterAllGames(games: Game[]): Game[] {
  return games
}