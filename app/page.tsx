'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { PromoCarousel } from '@/components/promo-carousel'
import { SearchBar } from '@/components/search-bar'
import { CategoryGameSection } from '@/components/category-game-section'
import { useGameData } from '@/lib/game-data-context'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const { isCollapsed } = useSidebar()
  const { categories } = useGameData()

  // Filter and sort categories
  const activeCategories = categories
    .filter(cat => cat.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)

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

          {/* Search Bar */}
          <SearchBar />

          {/* Game Sections - Dynamically render all categories from backend */}
          <div className="space-y-12 mt-8">
            {activeCategories.map((category) => (
              <CategoryGameSection
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
