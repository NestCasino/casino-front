'use client'

import { GameCard } from './game-card'
import { useState } from 'react'
import type { Game } from '@/lib/mock-data'
import { ChevronDown } from 'lucide-react'

interface GameGridProps {
  games: Game[]
  initialCount?: number
  incrementCount?: number
}

export function GameGrid({ games, initialCount = 24, incrementCount = 24 }: GameGridProps) {
  const [displayCount, setDisplayCount] = useState(initialCount)
  
  const visibleGames = games.slice(0, displayCount)
  const hasMore = displayCount < games.length

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + incrementCount, games.length))
  }

  return (
    <div className="space-y-8">
      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {visibleGames.map((game) => (
          <GameCard key={game.id} {...game} />
        ))}
      </div>

      {/* Show More Button */}
      {hasMore && (
        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            onClick={handleShowMore}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 cursor-pointer"
          >
            <span>Show More</span>
            <ChevronDown className="h-5 w-5" />
          </button>
          <p className="text-sm text-gray-500">
            Showing {displayCount} of {games.length} games
          </p>
        </div>
      )}
    </div>
  )
}

