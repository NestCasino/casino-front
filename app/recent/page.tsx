'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { GameCard } from '@/components/game-card'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

// Mock recent games data
const recentGames = [
  {
    id: 'sweet-bonanza',
    name: 'Sweet Bonanza',
    provider: 'Pragmatic Play',
    thumbnail: '/sweet-candy-slot-game.jpg',
    playerCount: 8932,
    category: ['slots'],
    lastPlayed: '2 hours ago'
  },
  {
    id: 'gates-olympus',
    name: 'Gates of Olympus',
    provider: 'Pragmatic Play',
    thumbnail: '/zeus-olympus-slot-game.png',
    playerCount: 7654,
    category: ['slots'],
    lastPlayed: '5 hours ago'
  },
  {
    id: 'crash',
    name: 'CRASH',
    provider: 'Nest Originals',
    thumbnail: '/purple-rocket-crash-game.jpg',
    playerCount: 5234,
    category: ['originals'],
    lastPlayed: 'Yesterday'
  },
  {
    id: 'plinko',
    name: 'PLINKO',
    provider: 'Nest Originals',
    thumbnail: '/purple-balls-plinko-game.jpg',
    playerCount: 3421,
    category: ['originals'],
    lastPlayed: '2 days ago'
  },
  {
    id: 'mines',
    name: 'MINES',
    provider: 'Nest Originals',
    thumbnail: '/purple-grid-mines-game.jpg',
    playerCount: 1823,
    category: ['originals'],
    lastPlayed: '3 days ago'
  },
  {
    id: 'blackjack',
    name: 'Blackjack',
    provider: 'Evolution Gaming',
    thumbnail: '/blackjack-casino-dealer.jpg',
    playerCount: 2156,
    category: ['live-casino'],
    lastPlayed: '1 week ago'
  }
]

export default function RecentPage() {
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
            <Clock className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">Recent</h1>
          </div>

          {/* Info Text */}
          <p className="text-gray-400 text-sm mb-6">
            The last games you've played will be displayed here
          </p>

          {/* Games Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {recentGames.map((game) => (
              <div key={game.id} className="relative group">
                <GameCard
                  id={game.id}
                  name={game.name}
                  provider={game.provider}
                  thumbnail={game.thumbnail}
                  playerCount={game.playerCount}
                />
                {/* Last Played Badge */}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {game.lastPlayed}
                </div>
              </div>
            ))}
          </div>

          {/* Games Count */}
          <div className="text-center text-gray-400 text-sm">
            Showing {recentGames.length} of {recentGames.length} games
          </div>

        </div>
        <Footer />
      </main>
    </div>
  )
}

