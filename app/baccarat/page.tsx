'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { SearchBar } from '@/components/search-bar'
import { GameGrid } from '@/components/game-grid'
import { mockGames } from '@/lib/mock-data'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { filterBaccaratGames } from '@/lib/game-filters'
import { Diamond } from 'lucide-react'

export default function BaccaratPage() {
  const { isCollapsed } = useSidebar()
  const baccaratGames = filterBaccaratGames(mockGames)

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
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
              <Diamond className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Baccarat</h1>
              <p className="text-gray-400 text-sm mt-1">Experience {baccaratGames.length} classic baccarat tables</p>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Game Grid */}
          <div className="mt-8">
            <GameGrid games={baccaratGames} initialCount={12} incrementCount={12} />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}

