// Mock data for casino frontend (non-game data only)
// Note: Game data has been moved to API integration
// Use the useGames hook and API client instead of mock data

export interface Promotion {
  id: string
  title: string
  description: string
  imageUrl: string
  endDate: string
  prizePool?: string
  category: 'casino' | 'sport' | 'community' | 'poker' | 'esports'
}

export interface LiveBet {
  id: string
  game: string
  gameIcon: string
  user: string
  time: string
  betAmount: number
  currency: string
  multiplier: number
  payout: number
  isHidden?: boolean
}

export interface SportEvent {
  id: string
  league: string
  teamA: string
  teamB: string
  teamALogo: string
  teamBLogo: string
  time: string
  isLive: boolean
  odds: {
    home: number
    draw?: number
    away: number
  }
  marketCount: number
}

// Mock promotions data
export const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Daily Races',
    description: 'Play in our $100,000 Daily Race',
    imageUrl: '/racing-tires-blue-gradient.jpg',
    endDate: '2025-11-20T09:00:00',
    prizePool: '$100,000',
    category: 'casino'
  },
  {
    id: '2',
    title: 'Just Slots\' Multiplier Mania',
    description: '$30,000 Prize Pool!',
    imageUrl: '/slot-characters-multicolor-gradient.jpg',
    endDate: '2025-11-21T09:00:00',
    prizePool: '$30,000',
    category: 'casino'
  },
  {
    id: '3',
    title: 'Mega Lucky Drops',
    description: '$50,000 in Prize Drops!',
    imageUrl: '/roulette-casino-red-gradient.jpg',
    endDate: '2025-11-17T03:59:00',
    prizePool: '$50,000',
    category: 'casino'
  },
  {
    id: '4',
    title: 'VIP Boost!',
    description: '1.2x boost on VIP Progress!',
    imageUrl: '/star-badge-boost-purple.jpg',
    endDate: '2025-11-16T15:00:00',
    category: 'community'
  },
  {
    id: '5',
    title: 'Valentina Shevchenko - Prize Pool',
    description: 'Championship round finish 25k Prize Pool.',
    imageUrl: '/crash-game-rocket-purple.jpg',
    endDate: '2025-11-16T11:00:00',
    prizePool: '$25,000',
    category: 'sport'
  },
  {
    id: '6',
    title: 'Royal Club Of Originals',
    description: 'Enter the $3,000 Limbo Competition and win big',
    imageUrl: '/gates-olympus-zeus-slot.jpg',
    endDate: '2025-11-17T17:00:00',
    prizePool: '$3,000',
    category: 'casino'
  },
  {
    id: '7',
    title: 'Nest\'s Weekly Raffle',
    description: '$75,000 Weekly Raffle',
    imageUrl: '/wanted-dead-wild-western-slot.jpg',
    endDate: '2025-12-31T16:59:00',
    prizePool: '$75,000',
    category: 'community'
  },
  {
    id: '8',
    title: 'The Level Up',
    description: '$40,000 Prize Pool',
    imageUrl: '/book-of-dead-egypt-slot.jpg',
    endDate: '2025-11-19T09:00:00',
    prizePool: '$40,000',
    category: 'casino'
  },
]

// Mock live bets data
export const mockLiveBets: LiveBet[] = [
  { id: '1', game: 'Mines', gameIcon: '💣', user: 'player123', time: '10:57 AM', betAmount: 21032.95, currency: 'RUB', multiplier: 7.96, payout: 25880.17 },
  { id: '2', game: 'Plinko', gameIcon: '🎯', user: 'Hidden', time: '10:56 AM', betAmount: 5000, currency: 'RUB', multiplier: 0, payout: -5000, isHidden: true },
  { id: '3', game: 'Dice', gameIcon: '🎲', user: 'gambler99', time: '10:55 AM', betAmount: 15000, currency: 'RUB', multiplier: 1.98, payout: 14700 },
  { id: '4', game: 'Crash', gameIcon: '🚀', user: 'rocketman', time: '10:54 AM', betAmount: 8500, currency: 'RUB', multiplier: 3.45, payout: 20825 },
  { id: '5', game: 'Keno', gameIcon: '🎱', user: 'luckystar', time: '10:53 AM', betAmount: 12000, currency: 'RUB', multiplier: 0, payout: -12000 },
  { id: '6', game: 'Mines', gameIcon: '💣', user: 'Hidden', time: '10:52 AM', betAmount: 30000, currency: 'RUB', multiplier: 12.5, payout: 345000, isHidden: true },
  { id: '7', game: 'Plinko', gameIcon: '🎯', user: 'plinkoking', time: '10:51 AM', betAmount: 7500, currency: 'RUB', multiplier: 2.1, payout: 8250 },
  { id: '8', game: 'Dice', gameIcon: '🎲', user: 'rollmaster', time: '10:50 AM', betAmount: 18000, currency: 'RUB', multiplier: 50.0, payout: 882000 },
]

// Mock sports events
export const mockSportEvents: SportEvent[] = [
  {
    id: '1',
    league: 'Premier League',
    teamA: 'Manchester United',
    teamB: 'Liverpool',
    teamALogo: '/placeholder.svg?height=40&width=40',
    teamBLogo: '/placeholder.svg?height=40&width=40',
    time: 'Today 15:30',
    isLive: false,
    odds: { home: 2.10, draw: 3.45, away: 2.80 },
    marketCount: 42
  },
  {
    id: '2',
    league: 'NBA',
    teamA: 'Lakers',
    teamB: 'Warriors',
    teamALogo: '/placeholder.svg?height=40&width=40',
    teamBLogo: '/placeholder.svg?height=40&width=40',
    time: 'LIVE',
    isLive: true,
    odds: { home: 1.85, away: 1.95 },
    marketCount: 28
  },
  {
    id: '3',
    league: 'La Liga',
    teamA: 'Real Madrid',
    teamB: 'Barcelona',
    teamALogo: '/placeholder.svg?height=40&width=40',
    teamBLogo: '/placeholder.svg?height=40&width=40',
    time: 'Nov 16, 18:00',
    isLive: false,
    odds: { home: 2.40, draw: 3.20, away: 2.60 },
    marketCount: 56
  },
]
