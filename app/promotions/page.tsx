'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { PromotionCard } from '@/components/promotion-card'
import { PromotionCategoryTabs } from '@/components/promotion-category-tabs'
import { mockPromotions } from '@/lib/mock-data'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'

export default function PromotionsPage() {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className={cn(
        "lg:ml-60 pt-[70px] min-h-screen transition-all duration-300",
        isCollapsed ? "lg:ml-[70px]" : ""
      )}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="relative mb-8">
            <h1 className="text-4xl font-bold text-[rgb(var(--text-primary))]">Promotions</h1>
            {/* Decorative watermark */}
            <div className="absolute top-0 right-0 text-9xl font-bold text-[rgb(var(--primary))]/5 select-none pointer-events-none">
              Nest
            </div>
          </div>

          {/* Category Tabs */}
          <PromotionCategoryTabs />

          {/* Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {mockPromotions.map((promotion) => (
              <PromotionCard key={promotion.id} {...promotion} />
            ))}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
