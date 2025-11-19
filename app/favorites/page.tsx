'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { GameCard } from '@/components/game-card'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'

// Mock favorite games data
const favoriteGames = [
  {
    id: 'dice',
    name: 'DICE',
    provider: 'Nest Originals',
    thumbnail: '/purple-neon-dice-game.jpg',
    playerCount: 2604,
    category: ['originals']
  },
  {
    id: 'space-dice',
    name: 'Space DICE',
    provider: 'Nest Originals',
    thumbnail: '/purple-neon-dice-game.jpg',
    playerCount: 1823,
    category: ['originals']
  },
  {
    id: 'aztec-magic',
    name: 'Aztec Magic Bonanza',
    provider: 'BGaming',
    thumbnail: '/egypt-book-of-dead-slot.jpg',
    playerCount: 4521,
    category: ['slots']
  },
  {
    id: 'jokers',
    name: 'Jokers Jewels',
    provider: 'Pragmatic Play',
    thumbnail: '/slot-characters-multicolor-gradient.jpg',
    playerCount: 3287,
    category: ['slots']
  }
]

export default function FavoritesPage() {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className={cn(
        "pt-[70px] min-h-screen transition-all duration-300",
        isCollapsed ? "lg:ml-[70px]" : "lg:ml-60"
      )}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-white">Favorites</h1>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {favoriteGames.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                name={game.name}
                provider={game.provider}
                thumbnail={game.thumbnail}
                playerCount={game.playerCount}
              />
            ))}
          </div>

          {/* Games Count */}
          <div className="text-center text-gray-400 text-sm">
            Showing {favoriteGames.length} of {favoriteGames.length} games
          </div>

        </div>
        <Footer />
      </main>
    </div>
  )
}

