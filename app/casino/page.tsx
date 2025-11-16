'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { PromoCarousel } from '@/components/promo-carousel'
import { ProviderFilter } from '@/components/provider-filter'
import { LiveBetsTable } from '@/components/live-bets-table'
import { SearchBar } from '@/components/search-bar'
import { CategoryTabs } from '@/components/category-tabs'
import { GameSection } from '@/components/game-section'
import { mockGames } from '@/lib/mock-data'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'

export default function CasinoPage() {
  const { isCollapsed } = useSidebar()

  // Filter games by category
  const originalsGames = mockGames.filter(game => game.category.includes('originals'))
  const slotsGames = mockGames.filter(game => game.category.includes('slots'))
  const trendingGames = mockGames.filter(game => game.category.includes('trending'))
  const liveCasinoGames = mockGames.filter(game => game.category.includes('live-casino'))
  const burstGames = mockGames.filter(game => game.category.includes('burst'))

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className={cn(
        "pt-[70px] min-h-screen transition-all duration-300",
        isCollapsed ? "lg:ml-[70px]" : "lg:ml-60"
      )}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Promotional Carousel */}
          <PromoCarousel />

          {/* Provider Filter Bar */}
          <ProviderFilter />

          {/* Live Bets Section */}
          <LiveBetsTable />

          {/* Search Bar */}
          <SearchBar />

          {/* Category Tabs */}
          <CategoryTabs />

          {/* Game Sections */}
          <div className="space-y-12">
            <GameSection
              title="Nest Originals"
              icon="🔥"
              games={originalsGames}
            />

            <GameSection
              title="Burst Games"
              icon="💥"
              games={burstGames}
            />

            <GameSection
              title="Trending Slots"
              icon="📈"
              games={trendingGames}
            />

            <GameSection
              title="All Slots"
              icon="🎰"
              games={slotsGames}
            />

            <GameSection
              title="Live Casino"
              icon="🎥"
              games={liveCasinoGames}
            />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
