'use client'

import { GameCard } from './game-card'
import { useState } from 'react'
import type { Game } from '@/lib/types'
import { ChevronDown } from 'lucide-react'
import { GameGridSkeleton } from './loading/game-grid-skeleton'
import { NoGames } from './empty-states/no-games'

interface GameGridProps {
  games: Game[] | null
  loading?: boolean
  error?: string | null
  initialCount?: number
  incrementCount?: number
  showLoadMore?: boolean
}

export function GameGrid({ 
  games, 
  loading = false, 
  error = null,
  initialCount = 24, 
  incrementCount = 24,
  showLoadMore = true
}: GameGridProps) {
  const [displayCount, setDisplayCount] = useState(initialCount)
  
  // Loading state
  if (loading) {
    return <GameGridSkeleton count={initialCount} />
  }

  // Error state
  if (error) {
    return (
      <NoGames 
        message="Failed to load games"
        description={error}
        showSearchIcon={false}
      />
    )
  }

  // Empty state
  if (!games || games.length === 0) {
    return <NoGames />
  }
  
  // WORKAROUND: Backend returns games with id: null
  // Use slug or gameId as fallback for React keys and filtering
  const validGames = games.filter((game) => {
    // Accept games if they have a valid slug or gameId (even if id is null)
    return game?.slug || game?.gameId
  })
  
  // Show specific message if all games were filtered out
  if (validGames.length === 0 && games.length > 0) {
    return (
      <NoGames 
        message="Games data issue"
        description={`Received ${games.length} games but none had valid identifiers (id, slug, or gameId).`}
        showSearchIcon={false}
      />
    )
  }
  
  if (validGames.length === 0) {
    return <NoGames />
  }
  
  // If showLoadMore is false, show all games (parent handles pagination)
  // Otherwise, use internal displayCount for slicing
  const visibleGames = showLoadMore ? validGames.slice(0, displayCount) : validGames
  const hasMore = showLoadMore && displayCount < validGames.length

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + incrementCount, validGames.length))
  }

  return (
    <div className="space-y-8">
      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {visibleGames.map((game, index) => (
          <GameCard 
            key={game.id || game.slug || game.gameId || `game-${index}`} 
            game={game} 
          />
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
            Showing {displayCount} of {validGames.length} games
          </p>
        </div>
      )}
    </div>
  )
}

