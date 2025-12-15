'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { GameCard } from '@/components/game-card'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'
import type { Game } from '@/lib/types'

// Mock recent games data - TODO: Replace with real recent games from backend
const recentGames: Array<Game & { lastPlayed: string }> = [
  {
    id: 1,
    gameId: 'sweet-bonanza',
    gameTitle: 'Sweet Bonanza',
    slug: 'sweet-bonanza',
    image: '/sweet-candy-slot-game.jpg',
    providerId: null,
    categoryId: null,
    providerSlug: 'pragmatic-play',
    categorySlug: 'slots',
    isMobile: true,
    isDesktop: true,
    isLive: false,
    isTrending: false,
    hasDemo: true,
    isRestricted: false,
    lastPlayed: '2 hours ago'
  },
  {
    id: 2,
    gameId: 'gates-olympus',
    gameTitle: 'Gates of Olympus',
    slug: 'gates-of-olympus',
    image: '/zeus-olympus-slot-game.png',
    providerId: null,
    categoryId: null,
    providerSlug: 'pragmatic-play',
    categorySlug: 'slots',
    isMobile: true,
    isDesktop: true,
    isLive: false,
    isTrending: false,
    hasDemo: true,
    isRestricted: false,
    lastPlayed: '5 hours ago'
  },
  {
    id: 3,
    gameId: 'crash',
    gameTitle: 'CRASH',
    slug: 'crash',
    image: '/purple-rocket-crash-game.jpg',
    providerId: null,
    categoryId: null,
    providerSlug: null,
    categorySlug: 'instant',
    isMobile: true,
    isDesktop: true,
    isLive: false,
    isTrending: false,
    hasDemo: true,
    isRestricted: false,
    lastPlayed: 'Yesterday'
  },
  {
    id: 4,
    gameId: 'plinko',
    gameTitle: 'PLINKO',
    slug: 'plinko',
    image: '/purple-balls-plinko-game.jpg',
    providerId: null,
    categoryId: null,
    providerSlug: null,
    categorySlug: 'arcade',
    isMobile: true,
    isDesktop: true,
    isLive: false,
    isTrending: false,
    hasDemo: true,
    isRestricted: false,
    lastPlayed: '2 days ago'
  },
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
                <GameCard game={game} />
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

      <ScrollToTop />
    </div>
  )
}

