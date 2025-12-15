'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { GameFiltersBar } from '@/components/filters/game-filters-bar'
import { GameGrid } from '@/components/game-grid'
import { ScrollToTop } from '@/components/scroll-to-top'
import { useGames } from '@/hooks/use-games'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { Video, ChevronDown } from 'lucide-react'
import type { Game } from '@/lib/types'

export default function LiveCasinoPage() {
  const { isCollapsed } = useSidebar()
  
  const [providerId, setProviderId] = useState<number | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [allGames, setAllGames] = useState<Game[]>([])
  
  const { games, meta, loading, error } = useGames({
    isLive: true,
    providerId,
    search: searchTerm,
    page: currentPage,
    perPage: 24,
  })

  useEffect(() => {
    setCurrentPage(1)
    setAllGames([])
  }, [providerId, searchTerm])

  useEffect(() => {
    if (games && games.length > 0) {
      setAllGames(prev => {
        if (currentPage === 1) {
          return games
        }
        // Deduplicate games based on id, slug, or gameId
        const existingIds = new Set(prev.map(g => g.id || g.slug || g.gameId))
        const newGames = games.filter(g => !existingIds.has(g.id || g.slug || g.gameId))
        return [...prev, ...newGames]
      })
    } else if (currentPage === 1 && games) {
      setAllGames(games)
    }
  }, [games, currentPage])

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className={cn(
        "pt-[70px] min-h-screen transition-all duration-300",
        isCollapsed ? "lg:ml-[70px]" : "lg:ml-60"
      )}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Live Casino</h1>
              <p className="text-gray-400 text-sm mt-1">
                {meta ? `${meta.total} live dealer games` : 'Loading...'}
              </p>
            </div>
          </div>

          <GameFiltersBar 
            providerId={providerId}
            search={searchTerm}
            onProviderChange={setProviderId}
            onSearchChange={setSearchTerm}
          />

          <GameGrid games={allGames} loading={loading && currentPage === 1} error={error} showLoadMore={false} />

          {meta && currentPage < meta.totalPages && !loading && (
            <div className="flex flex-col items-center gap-3 pt-8">
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Show More</span>
                <ChevronDown className="h-5 w-5" />
              </button>
              <p className="text-sm text-gray-500">
                Showing {allGames.length} of {meta.total} games
              </p>
            </div>
          )}

          {loading && currentPage > 1 && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          )}
        </div>

        <Footer />
      </main>

      <ScrollToTop />
    </div>
  )
}
