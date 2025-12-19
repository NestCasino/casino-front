'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { GameFiltersBar } from '@/components/filters/game-filters-bar'
import { GameGrid } from '@/components/game-grid'
import { ScrollToTop } from '@/components/scroll-to-top'
import { useGames } from '@/hooks/use-games'
import { useGameData } from '@/lib/game-data-context'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { Zap, TableProperties, Gamepad2, Ticket, Film, LayoutGrid, Cherry, ChevronDown } from 'lucide-react'
import { useParams } from 'next/navigation'
import type { Game } from '@/lib/types'

// Icon and color mapping for categories
const getCategoryIcon = (slug: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    slots: <Cherry className="h-6 w-6 text-white" />,
    instant: <Zap className="h-6 w-6 text-white" />,
    table: <TableProperties className="h-6 w-6 text-white" />,
    arcade: <Gamepad2 className="h-6 w-6 text-white" />,
    lottery: <Ticket className="h-6 w-6 text-white" />,
    game_show: <Film className="h-6 w-6 text-white" />,
    other: <LayoutGrid className="h-6 w-6 text-white" />,
  }
  return iconMap[slug] || <LayoutGrid className="h-6 w-6 text-white" />
}

const getCategoryGradient = (slug: string): string => {
  const gradientMap: Record<string, string> = {
    slots: 'from-red-500 to-pink-600',
    instant: 'from-yellow-500 to-orange-600',
    table: 'from-green-500 to-emerald-600',
    arcade: 'from-purple-500 to-indigo-600',
    lottery: 'from-blue-500 to-cyan-600',
    game_show: 'from-pink-500 to-rose-600',
    other: 'from-gray-500 to-slate-600',
  }
  return gradientMap[slug] || 'from-purple-500 to-indigo-600'
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { isCollapsed } = useSidebar()
  const { getCategoryBySlug } = useGameData()
  
  const [providerId, setProviderId] = useState<number | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [allGames, setAllGames] = useState<Game[]>([])
  
  const category = getCategoryBySlug(slug)
  
  const { games, meta, loading, error } = useGames({
    categoryId: category?.id ? Number(category.id) : undefined,
    providerId,
    search: searchTerm,
    page: currentPage,
    perPage: 24,
  })

  useEffect(() => {
    setCurrentPage(1)
    setAllGames([])
  }, [category?.id, providerId, searchTerm])

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

  // Show loading state while category is being fetched
  if (!category && !loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <Sidebar />
        
        <main className={cn(
          "pt-[70px] min-h-screen transition-all duration-300",
          isCollapsed ? "lg:ml-[70px]" : "lg:ml-60"
        )}>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-white mb-4">Category Not Found</h1>
              <p className="text-gray-400">The category you're looking for doesn't exist.</p>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    )
  }

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
            <div className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br",
              getCategoryGradient(slug)
            )}>
              {getCategoryIcon(slug)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{category?.title || 'Loading...'}</h1>
              <p className="text-gray-400 text-sm mt-1">
                {meta ? `${meta.total} exciting games` : 'Loading...'}
              </p>
            </div>
          </div>

          {/* Filters */}
          <GameFiltersBar 
            providerId={providerId}
            search={searchTerm}
            onProviderChange={setProviderId}
            onSearchChange={setSearchTerm}
          />

          {/* Game Grid */}
          <GameGrid 
            games={allGames} 
            loading={loading && currentPage === 1} 
            error={error}
            showLoadMore={false}
          />

          {/* Load More Button */}
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

          {/* Loading More Indicator */}
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













