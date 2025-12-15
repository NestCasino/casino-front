'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { ScrollToTop } from '@/components/scroll-to-top'
import { GameCard } from '@/components/game-card'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'
import type { Game } from '@/lib/types'

// Mock favorite games data - TODO: Replace with real favorites from backend
const favoriteGames: Game[] = [
  {
    id: 1,
    gameId: 'dice',
    gameTitle: 'DICE',
    slug: 'dice',
    image: '/purple-neon-dice-game.jpg',
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
  },
  {
    id: 2,
    gameId: 'space-dice',
    gameTitle: 'Space DICE',
    slug: 'space-dice',
    image: '/purple-neon-dice-game.jpg',
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
  },
  {
    id: 3,
    gameId: 'aztec-magic',
    gameTitle: 'Aztec Magic Bonanza',
    slug: 'aztec-magic-bonanza',
    image: '/egypt-book-of-dead-slot.jpg',
    providerId: null,
    categoryId: null,
    providerSlug: 'bgaming',
    categorySlug: 'slots',
    isMobile: true,
    isDesktop: true,
    isLive: false,
    isTrending: false,
    hasDemo: true,
    isRestricted: false,
  },
  {
    id: 4,
    gameId: 'jokers',
    gameTitle: 'Jokers Jewels',
    slug: 'jokers-jewels',
    image: '/slot-characters-multicolor-gradient.jpg',
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
                game={game}
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

      <ScrollToTop />
    </div>
  )
}

