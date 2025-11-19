// Mock data for casino frontend

export interface Game {
  id: string
  name: string
  provider: string
  thumbnail: string
  playerCount: number
  category: string[]
}

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

// Mock games data
export const mockGames: Game[] = [
  { id: '1', name: 'DICE', provider: 'Nest Originals', thumbnail: '/purple-neon-dice-game.jpg', playerCount: 2604, category: ['originals', 'burst'] },
  { id: '2', name: 'MINES', provider: 'Nest Originals', thumbnail: '/purple-grid-mines-game.jpg', playerCount: 1823, category: ['originals'] },
  { id: '3', name: 'PLINKO', provider: 'Nest Originals', thumbnail: '/purple-balls-plinko-game.jpg', playerCount: 3421, category: ['originals'] },
  { id: '4', name: 'CRASH', provider: 'Nest Originals', thumbnail: '/purple-rocket-crash-game.jpg', playerCount: 5234, category: ['originals', 'burst'] },
  { id: '5', name: 'Sweet Bonanza', provider: 'Pragmatic Play', thumbnail: '/sweet-candy-slot-game.jpg', playerCount: 8932, category: ['slots', 'trending'] },
  { id: '6', name: 'Gates of Olympus', provider: 'Pragmatic Play', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 7654, category: ['slots', 'trending'] },
  { id: '7', name: 'Blackjack Live', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 4521, category: ['live-casino', 'blackjack'] },
  { id: '8', name: 'Roulette Live', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 3876, category: ['live-casino', 'roulette'] },
  { id: '9', name: 'KENO', provider: 'Nest Originals', thumbnail: '/purple-keno-lottery-numbers.jpg', playerCount: 1234, category: ['originals'] },
  { id: '10', name: 'The Dog House', provider: 'Pragmatic Play', thumbnail: '/lucky-paws-slot.png', playerCount: 5678, category: ['slots'] },
  { id: '11', name: 'Book of Dead', provider: 'Play\'n GO', thumbnail: '/egypt-book-of-dead-slot.jpg', playerCount: 6543, category: ['slots', 'trending'] },
  { id: '12', name: 'Wanted Dead or Wild', provider: 'Hacksaw Gaming', thumbnail: '/western-wanted-slot.jpg', playerCount: 4321, category: ['slots'] },
  
  // Additional Nest Originals
  { id: '13', name: 'LIMBO', provider: 'Nest Originals', thumbnail: '/purple-rocket-crash-game.jpg', playerCount: 2987, category: ['originals'] },
  { id: '14', name: 'WHEEL', provider: 'Nest Originals', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 3456, category: ['originals'] },
  { id: '15', name: 'HILO', provider: 'Nest Originals', thumbnail: '/purple-neon-dice-game.jpg', playerCount: 1876, category: ['originals'] },
  { id: '16', name: 'TOWER', provider: 'Nest Originals', thumbnail: '/purple-grid-mines-game.jpg', playerCount: 2145, category: ['originals'] },
  
  // Additional Slots - Pragmatic Play
  { id: '17', name: 'Starlight Princess', provider: 'Pragmatic Play', thumbnail: '/sweet-candy-slot-game.jpg', playerCount: 9234, category: ['slots', 'trending'] },
  { id: '18', name: 'Wild West Gold', provider: 'Pragmatic Play', thumbnail: '/western-wanted-slot.jpg', playerCount: 6789, category: ['slots'] },
  { id: '19', name: 'Big Bass Bonanza', provider: 'Pragmatic Play', thumbnail: '/lucky-paws-slot.png', playerCount: 7891, category: ['slots', 'trending'] },
  { id: '20', name: 'Sugar Rush', provider: 'Pragmatic Play', thumbnail: '/sweet-candy-slot-game.jpg', playerCount: 8456, category: ['slots'] },
  { id: '21', name: 'Zeus vs Hades', provider: 'Pragmatic Play', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 7234, category: ['slots'] },
  
  // Additional Slots - Play'n GO
  { id: '22', name: 'Reactoonz', provider: 'Play\'n GO', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6876, category: ['slots', 'trending'] },
  { id: '23', name: 'Moon Princess', provider: 'Play\'n GO', thumbnail: '/sweet-candy-slot-game.jpg', playerCount: 7543, category: ['slots'] },
  { id: '24', name: 'Fire Joker', provider: 'Play\'n GO', thumbnail: '/roulette-casino-red-gradient.jpg', playerCount: 5432, category: ['slots'] },
  { id: '25', name: 'Rise of Olympus', provider: 'Play\'n GO', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 6987, category: ['slots'] },
  
  // Additional Slots - Hacksaw Gaming
  { id: '26', name: 'Chaos Crew', provider: 'Hacksaw Gaming', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 5678, category: ['slots'] },
  { id: '27', name: 'Le Bandit', provider: 'Hacksaw Gaming', thumbnail: '/western-wanted-slot.jpg', playerCount: 4987, category: ['slots'] },
  { id: '28', name: 'Stacko', provider: 'Hacksaw Gaming', thumbnail: '/purple-grid-mines-game.jpg', playerCount: 4234, category: ['slots'] },
  
  // Additional Slots - NetEnt
  { id: '29', name: 'Starburst', provider: 'NetEnt', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 8765, category: ['slots', 'trending'] },
  { id: '30', name: 'Gonzo\'s Quest', provider: 'NetEnt', thumbnail: '/egypt-book-of-dead-slot.jpg', playerCount: 7654, category: ['slots', 'trending'] },
  { id: '31', name: 'Dead or Alive 2', provider: 'NetEnt', thumbnail: '/western-wanted-slot.jpg', playerCount: 6543, category: ['slots'] },
  { id: '32', name: 'Twin Spin', provider: 'NetEnt', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 5987, category: ['slots'] },
  
  // Additional Slots - NoLimit City
  { id: '33', name: 'Tombstone', provider: 'NoLimit City', thumbnail: '/western-wanted-slot.jpg', playerCount: 7234, category: ['slots', 'trending'] },
  { id: '34', name: 'San Quentin', provider: 'NoLimit City', thumbnail: '/western-wanted-slot.jpg', playerCount: 6876, category: ['slots'] },
  { id: '35', name: 'Mental', provider: 'NoLimit City', thumbnail: '/crash-game-rocket-purple.jpg', playerCount: 5987, category: ['slots'] },
  
  // Additional Live Casino Games
  { id: '36', name: 'Lightning Roulette', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 4987, category: ['live-casino', 'roulette', 'game-shows'] },
  { id: '37', name: 'Crazy Time', provider: 'Evolution', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 8765, category: ['live-casino', 'trending', 'game-shows'] },
  { id: '38', name: 'Mega Ball', provider: 'Evolution', thumbnail: '/purple-balls-plinko-game.jpg', playerCount: 5432, category: ['live-casino', 'game-shows'] },
  { id: '39', name: 'Dream Catcher', provider: 'Evolution', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 4321, category: ['live-casino', 'game-shows'] },
  { id: '40', name: 'Baccarat Live', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3987, category: ['live-casino', 'baccarat'] },
  { id: '41', name: 'Speed Blackjack', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 4654, category: ['live-casino', 'blackjack'] },
  { id: '42', name: 'Infinite Blackjack', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 5123, category: ['live-casino', 'blackjack'] },
  { id: '43', name: 'Auto Roulette', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 3654, category: ['live-casino', 'roulette'] },
  { id: '44', name: 'Immersive Roulette', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 4234, category: ['live-casino', 'roulette'] },
  { id: '45', name: 'Monopoly Live', provider: 'Evolution', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6789, category: ['live-casino', 'trending', 'game-shows'] },
  
  // Additional Blackjack Games
  { id: '46', name: 'VIP Blackjack', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 2987, category: ['live-casino', 'blackjack'] },
  { id: '47', name: 'Power Blackjack', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3456, category: ['live-casino', 'blackjack'] },
  { id: '48', name: 'Free Bet Blackjack', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 2654, category: ['live-casino', 'blackjack'] },
  { id: '49', name: 'Blackjack Party', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3789, category: ['live-casino', 'blackjack'] },
  { id: '50', name: 'Lightning Blackjack', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 4123, category: ['live-casino', 'blackjack'] },
  
  // Additional Roulette Games
  { id: '51', name: 'Speed Roulette', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 3789, category: ['live-casino', 'roulette'] },
  { id: '52', name: 'American Roulette', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 2987, category: ['live-casino', 'roulette'] },
  { id: '53', name: 'French Roulette', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 2456, category: ['live-casino', 'roulette'] },
  { id: '54', name: 'Double Ball Roulette', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 3123, category: ['live-casino', 'roulette'] },
  { id: '55', name: 'XXXtreme Lightning Roulette', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 4567, category: ['live-casino', 'roulette', 'game-shows'] },
  
  // Additional Baccarat Games
  { id: '56', name: 'Speed Baccarat', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3456, category: ['live-casino', 'baccarat'] },
  { id: '57', name: 'No Commission Baccarat', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 2789, category: ['live-casino', 'baccarat'] },
  { id: '58', name: 'Lightning Baccarat', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 4234, category: ['live-casino', 'baccarat'] },
  { id: '59', name: 'Baccarat Squeeze', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3567, category: ['live-casino', 'baccarat'] },
  { id: '60', name: 'VIP Baccarat', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 2876, category: ['live-casino', 'baccarat'] },
  
  // Additional Game Shows
  { id: '61', name: 'Deal or No Deal', provider: 'Evolution', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 5678, category: ['live-casino', 'game-shows'] },
  { id: '62', name: 'Funky Time', provider: 'Evolution', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 4987, category: ['live-casino', 'game-shows'] },
  { id: '63', name: 'Cash or Crash', provider: 'Evolution', thumbnail: '/crash-game-rocket-purple.jpg', playerCount: 4321, category: ['live-casino', 'game-shows'] },
  { id: '64', name: 'Gonzo\'s Treasure Hunt', provider: 'Evolution', thumbnail: '/egypt-book-of-dead-slot.jpg', playerCount: 3987, category: ['live-casino', 'game-shows'] },
  { id: '65', name: 'Football Studio', provider: 'Evolution', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 3456, category: ['live-casino', 'game-shows'] },
  
  // New Release Games
  { id: '66', name: 'Big Bass Amazon Xtreme', provider: 'Pragmatic Play', thumbnail: '/lucky-paws-slot.png', playerCount: 8234, category: ['slots', 'new-releases', 'trending'] },
  { id: '67', name: 'Starlight Christmas', provider: 'Pragmatic Play', thumbnail: '/sweet-candy-slot-game.jpg', playerCount: 7543, category: ['slots', 'new-releases'] },
  { id: '68', name: 'Wild Depths', provider: 'NetEnt', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6789, category: ['slots', 'new-releases'] },
  { id: '69', name: 'Punk Toilet', provider: 'Hacksaw Gaming', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 9876, category: ['slots', 'new-releases', 'trending'] },
  { id: '70', name: 'Wanted Dead or a Wild 2', provider: 'Hacksaw Gaming', thumbnail: '/western-wanted-slot.jpg', playerCount: 7234, category: ['slots', 'new-releases'] },
  { id: '71', name: '3 Dancing Monkeys', provider: 'Pragmatic Play', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6543, category: ['slots', 'new-releases'] },
  { id: '72', name: 'Book of Golden Sands', provider: 'Pragmatic Play', thumbnail: '/egypt-book-of-dead-slot.jpg', playerCount: 7891, category: ['slots', 'new-releases'] },
  { id: '73', name: 'Dragon Hatch 2', provider: 'PG Soft', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 8456, category: ['slots', 'new-releases'] },
  { id: '74', name: 'Candy Blitz Bombs', provider: 'Pragmatic Play', thumbnail: '/sweet-candy-slot-game.jpg', playerCount: 9123, category: ['slots', 'new-releases', 'trending'] },
  { id: '75', name: 'Mystic Wheel', provider: 'Red Tiger', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 5678, category: ['slots', 'new-releases'] },
  
  // Additional Burst/Crash Games
  { id: '76', name: 'JetX', provider: 'SmartSoft Gaming', thumbnail: '/crash-game-rocket-purple.jpg', playerCount: 4567, category: ['burst'] },
  { id: '77', name: 'Spaceman', provider: 'Pragmatic Play', thumbnail: '/crash-game-rocket-purple.jpg', playerCount: 5234, category: ['burst'] },
  { id: '78', name: 'Aviator', provider: 'Spribe', thumbnail: '/crash-game-rocket-purple.jpg', playerCount: 9876, category: ['burst', 'trending'] },
  { id: '79', name: 'Balloon', provider: 'Turbo Games', thumbnail: '/purple-balls-plinko-game.jpg', playerCount: 3456, category: ['burst'] },
  { id: '80', name: 'Lucky Jet', provider: 'Gaming Corps', thumbnail: '/crash-game-rocket-purple.jpg', playerCount: 4123, category: ['burst'] },
  
  // More Slots - Wave 2
  { id: '81', name: 'Wolf Gold', provider: 'Pragmatic Play', thumbnail: '/western-wanted-slot.jpg', playerCount: 7543, category: ['slots'] },
  { id: '82', name: 'Jammin\' Jars', provider: 'Push Gaming', thumbnail: '/sweet-candy-slot-game.jpg', playerCount: 8234, category: ['slots', 'trending'] },
  { id: '83', name: 'Money Train 3', provider: 'Relax Gaming', thumbnail: '/western-wanted-slot.jpg', playerCount: 9123, category: ['slots', 'trending', 'new-releases'] },
  { id: '84', name: 'Mega Moolah', provider: 'Microgaming', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 12345, category: ['slots', 'trending'] },
  { id: '85', name: 'Bonanza', provider: 'Big Time Gaming', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 8765, category: ['slots'] },
  { id: '86', name: 'Extra Chilli', provider: 'Big Time Gaming', thumbnail: '/sweet-candy-slot-game.jpg', playerCount: 6543, category: ['slots'] },
  { id: '87', name: 'Immortal Romance', provider: 'Microgaming', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 7234, category: ['slots'] },
  { id: '88', name: 'Legacy of Dead', provider: 'Play\'n GO', thumbnail: '/egypt-book-of-dead-slot.jpg', playerCount: 6789, category: ['slots'] },
  { id: '89', name: 'Rage of the Seas', provider: 'NetEnt', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 5432, category: ['slots'] },
  { id: '90', name: 'Divine Fortune', provider: 'NetEnt', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 7891, category: ['slots'] },
  { id: '91', name: 'Razor Shark', provider: 'Push Gaming', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 8456, category: ['slots', 'trending'] },
  { id: '92', name: 'Juicy Fruits', provider: 'Pragmatic Play', thumbnail: '/sweet-candy-slot-game.jpg', playerCount: 5678, category: ['slots'] },
  { id: '93', name: 'Great Rhino Megaways', provider: 'Pragmatic Play', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6234, category: ['slots'] },
  { id: '94', name: 'Fat Rabbit', provider: 'Push Gaming', thumbnail: '/lucky-paws-slot.png', playerCount: 5891, category: ['slots'] },
  { id: '95', name: 'Vikings Go Berzerk', provider: 'Yggdrasil', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6543, category: ['slots'] },
  { id: '96', name: 'Eastern Emeralds', provider: 'Quickspin', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 4987, category: ['slots'] },
  { id: '97', name: 'Wild Swarm', provider: 'Push Gaming', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 5234, category: ['slots'] },
  { id: '98', name: 'Valley of the Gods', provider: 'Yggdrasil', thumbnail: '/egypt-book-of-dead-slot.jpg', playerCount: 6123, category: ['slots'] },
  { id: '99', name: 'Buffalo Blitz', provider: 'Playtech', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 7654, category: ['slots'] },
  { id: '100', name: 'Age of the Gods', provider: 'Playtech', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 8234, category: ['slots'] },
  
  // More Slots - Wave 3
  { id: '101', name: 'Sakura Fortune', provider: 'Quickspin', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 5432, category: ['slots'] },
  { id: '102', name: 'Crystal Queen', provider: 'Quickspin', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 4765, category: ['slots'] },
  { id: '103', name: 'Book of Shadows', provider: 'Nolimit City', thumbnail: '/egypt-book-of-dead-slot.jpg', playerCount: 6234, category: ['slots', 'new-releases'] },
  { id: '104', name: 'Piggy Riches', provider: 'NetEnt', thumbnail: '/lucky-paws-slot.png', playerCount: 5678, category: ['slots'] },
  { id: '105', name: 'Jack and the Beanstalk', provider: 'NetEnt', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6123, category: ['slots'] },
  { id: '106', name: 'Vikings', provider: 'NetEnt', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 7234, category: ['slots'] },
  { id: '107', name: 'Dragon\'s Fire', provider: 'Red Tiger', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 5891, category: ['slots'] },
  { id: '108', name: 'Piggy Pirates', provider: 'Red Tiger', thumbnail: '/lucky-paws-slot.png', playerCount: 4987, category: ['slots'] },
  { id: '109', name: 'Mystery Reels', provider: 'Red Tiger', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 5234, category: ['slots'] },
  { id: '110', name: 'Wild O\'Clock', provider: 'Red Tiger', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 4567, category: ['slots'] },
  { id: '111', name: 'Temple of Treasure', provider: 'Blueprint', thumbnail: '/egypt-book-of-dead-slot.jpg', playerCount: 5123, category: ['slots'] },
  { id: '112', name: 'Diamond Mine', provider: 'Blueprint', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6234, category: ['slots'] },
  { id: '113', name: 'Buffalo Rising', provider: 'Blueprint', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 5678, category: ['slots'] },
  { id: '114', name: 'Fishin\' Frenzy', provider: 'Blueprint', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 7234, category: ['slots'] },
  { id: '115', name: 'King Kong Cash', provider: 'Blueprint', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6789, category: ['slots'] },
  
  // More Slots - Wave 4
  { id: '116', name: 'Rainbow Riches', provider: 'Barcrest', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 8234, category: ['slots'] },
  { id: '117', name: 'Cleopatra', provider: 'IGT', thumbnail: '/egypt-book-of-dead-slot.jpg', playerCount: 9123, category: ['slots'] },
  { id: '118', name: 'Da Vinci Diamonds', provider: 'IGT', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 7654, category: ['slots'] },
  { id: '119', name: 'Wheel of Fortune', provider: 'IGT', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 8765, category: ['slots'] },
  { id: '120', name: 'Zeus', provider: 'WMS', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 7234, category: ['slots'] },
  { id: '121', name: 'Spartacus', provider: 'WMS', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6543, category: ['slots'] },
  { id: '122', name: 'Raging Rhino', provider: 'WMS', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 7891, category: ['slots'] },
  { id: '123', name: 'Golden Goddess', provider: 'IGT', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6234, category: ['slots'] },
  { id: '124', name: 'Siberian Storm', provider: 'IGT', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 5432, category: ['slots'] },
  { id: '125', name: 'Prowling Panther', provider: 'IGT', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 4987, category: ['slots'] },
  
  // Additional New Releases
  { id: '126', name: 'Gates of Gatot Kaca', provider: 'Pragmatic Play', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 9234, category: ['slots', 'new-releases', 'trending'] },
  { id: '127', name: 'Fruit Party 2', provider: 'Pragmatic Play', thumbnail: '/sweet-candy-slot-game.jpg', playerCount: 8765, category: ['slots', 'new-releases'] },
  { id: '128', name: 'The Dog House Multihold', provider: 'Pragmatic Play', thumbnail: '/lucky-paws-slot.png', playerCount: 7543, category: ['slots', 'new-releases'] },
  { id: '129', name: 'Floating Dragon', provider: 'Pragmatic Play', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 8234, category: ['slots', 'new-releases'] },
  { id: '130', name: 'Wild West Duels', provider: 'Pragmatic Play', thumbnail: '/western-wanted-slot.jpg', playerCount: 6789, category: ['slots', 'new-releases'] },
  { id: '131', name: 'Forge of Olympus', provider: 'Pragmatic Play', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 9876, category: ['slots', 'new-releases', 'trending'] },
  { id: '132', name: 'Wisdom of Athena', provider: 'Pragmatic Play', thumbnail: '/zeus-olympus-slot-game.png', playerCount: 7234, category: ['slots', 'new-releases'] },
  { id: '133', name: 'Aztec Gems Deluxe', provider: 'Pragmatic Play', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6543, category: ['slots', 'new-releases'] },
  { id: '134', name: 'Mustang Gold', provider: 'Pragmatic Play', thumbnail: '/western-wanted-slot.jpg', playerCount: 7891, category: ['slots', 'new-releases'] },
  { id: '135', name: 'Pirate Gold Deluxe', provider: 'Pragmatic Play', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 6234, category: ['slots', 'new-releases'] },
  
  // Additional Live Casino & Table Games
  { id: '136', name: 'Double Ball Roulette', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 3456, category: ['live-casino', 'roulette'] },
  { id: '137', name: 'Salon Prive Roulette', provider: 'Evolution', thumbnail: '/roulette-casino-wheel.jpg', playerCount: 2987, category: ['live-casino', 'roulette'] },
  { id: '138', name: 'Dragon Tiger', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 4123, category: ['live-casino'] },
  { id: '139', name: 'Side Bet City', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3678, category: ['live-casino'] },
  { id: '140', name: 'Super Sic Bo', provider: 'Evolution', thumbnail: '/slot-characters-multicolor-gradient.jpg', playerCount: 3234, category: ['live-casino', 'game-shows'] },
  { id: '141', name: 'Texas Hold\'em Bonus Poker', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 4567, category: ['live-casino'] },
  { id: '142', name: 'Caribbean Stud Poker', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3891, category: ['live-casino'] },
  { id: '143', name: 'Ultimate Texas Hold\'em', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 4234, category: ['live-casino'] },
  { id: '144', name: 'Three Card Poker', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3567, category: ['live-casino'] },
  { id: '145', name: 'Casino Hold\'em', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3123, category: ['live-casino'] },
  { id: '146', name: '2 Hand Casino Hold\'em', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 2876, category: ['live-casino'] },
  { id: '147', name: 'Peek Baccarat', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3456, category: ['live-casino', 'baccarat'] },
  { id: '148', name: 'Dragon Bonus Baccarat', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3789, category: ['live-casino', 'baccarat'] },
  { id: '149', name: 'Prosperity Tree Baccarat', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 3234, category: ['live-casino', 'baccarat'] },
  { id: '150', name: 'Golden Wealth Baccarat', provider: 'Evolution', thumbnail: '/blackjack-casino-dealer.jpg', playerCount: 2987, category: ['live-casino', 'baccarat'] },
]

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
