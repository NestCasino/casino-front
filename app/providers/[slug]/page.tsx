'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
import { Building2, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import type { Game } from '@/lib/types'

export default function ProviderPage() {
  const params = useParams()
  const slug = params.slug as string
  const { isCollapsed } = useSidebar()
  const { getProviderBySlug, getCategoryBySlug, categories } = useGameData()
  
  const [categoryId, setCategoryId] = useState<number | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [allGames, setAllGames] = useState<Game[]>([])
  
  const provider = getProviderBySlug(slug)
  
  const { games, meta, loading, error } = useGames({
    providerId: provider?.id,
    categoryId,
    search: searchTerm,
    page: currentPage,
    perPage: 24,
  })

  useEffect(() => {
    setCurrentPage(1)
    setAllGames([])
  }, [provider?.id, categoryId, searchTerm])

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

  if (!provider) {
    return (
      <div className="min-h-screen">
        <Header />
        <Sidebar />
        
        <main className={cn(
          "pt-[70px] min-h-screen transition-all duration-300",
          isCollapsed ? "lg:ml-[70px]" : "lg:ml-60"
        )}>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Provider Not Found</h1>
              <p className="text-gray-400">The provider you're looking for doesn't exist.</p>
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
          {/* Provider Header */}
          <div className="flex items-center gap-6 mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#1a1534] to-[#241d42] border-2 border-[#2a2449]">
            {provider.image ? (
              <div className="relative w-24 h-24 rounded-xl bg-white/5 p-4 flex items-center justify-center">
                <Image
                  src={provider.image}
                  alt={provider.title}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <Building2 className="h-12 w-12 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{provider.title}</h1>
              <p className="text-gray-400">
                {meta ? `${meta.total} games available` : 'Loading games...'}
              </p>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-6">
            <button
              onClick={() => setCategoryId(undefined)}
              className={`flex-shrink-0 px-5 py-3 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                categoryId === undefined
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                  : 'bg-[#1a1534] border-2 border-[#2a2449] text-gray-400 hover:bg-[#241d42] hover:border-[#332959] hover:text-gray-300'
              }`}
            >
              All Games
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryId(category.id)}
                className={`flex-shrink-0 px-5 py-3 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
                  categoryId === category.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                    : 'bg-[#1a1534] border-2 border-[#2a2449] text-gray-400 hover:bg-[#241d42] hover:border-[#332959] hover:text-gray-300'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <GameFiltersBar
            search={searchTerm}
            onSearchChange={setSearchTerm}
            onProviderChange={() => {}}
            showProviderFilter={false}
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

