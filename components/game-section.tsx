'use client'

import { GameCard } from './game-card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Game } from '@/lib/types'
import { GameCardSkeleton } from './loading/game-card-skeleton'

interface GameSectionProps {
  title: string
  icon: string
  games: Game[] | null
  loading?: boolean
  viewAllHref?: string
  maxGames?: number
}

export function GameSection({ 
  title, 
  icon, 
  games, 
  loading = false,
  viewAllHref,
  maxGames = 6
}: GameSectionProps) {
  // Filter out games without valid identifiers (id, slug, or gameId)
  const validGames = games?.filter((game) => game?.slug || game?.gameId) || []
  
  // Show only first n games in section
  const displayedGames = validGames.slice(0, maxGames)

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        
        {viewAllHref && !loading && displayedGames.length > 0 && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
          >
            <span className="text-sm font-semibold">View All</span>
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* Games Horizontal Scroll */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {Array.from({ length: maxGames }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedGames.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {displayedGames.map((game, index) => (
            <div key={game.id || game.slug || game.gameId || `game-${index}`} className="flex-shrink-0 w-[200px]">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-8">
          No games available in this category
        </div>
      )}
    </section>
  )
}
