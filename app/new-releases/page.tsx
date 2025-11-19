'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { SearchBar } from '@/components/search-bar'
import { GameGrid } from '@/components/game-grid'
import { mockGames } from '@/lib/mock-data'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { filterNewReleasesGames } from '@/lib/game-filters'
import { Sparkles } from 'lucide-react'

export default function NewReleasesPage() {
  const { isCollapsed } = useSidebar()
  const newReleases = filterNewReleasesGames(mockGames)

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
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">New Releases</h1>
              <p className="text-gray-400 text-sm mt-1">Check out our latest game additions - {newReleases.length} new games</p>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Game Grid */}
          <div className="mt-8">
            <GameGrid games={newReleases} />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}

