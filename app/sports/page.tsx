'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { FeaturedSportBanner } from '@/components/featured-sport-banner'
import { SportCategoryTabs } from '@/components/sport-category-tabs'
import { SportEventCard } from '@/components/sport-event-card'
import { BetSlip } from '@/components/bet-slip'
import { mockSportEvents } from '@/lib/mock-data'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'

export default function SportsPage() {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      <BetSlip />
      
      <main className={cn(
        "pt-[70px] min-h-screen transition-all duration-300",
        isCollapsed ? "lg:ml-[70px]" : "lg:ml-60"
      )}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Featured Event Banner */}
          <FeaturedSportBanner />

          {/* Sport Category Tabs */}
          <SportCategoryTabs />

          {/* Event Listings */}
          <div className="space-y-4 mb-12">
            <h2 className="text-xl font-semibold text-[rgb(var(--text-primary))] mb-4">
              Live & Upcoming Matches
            </h2>
            {mockSportEvents.map((event) => (
              <SportEventCard key={event.id} {...event} />
            ))}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
