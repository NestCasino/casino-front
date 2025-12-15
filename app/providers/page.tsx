'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { ProviderCard } from '@/components/provider-card'
import { useGameData } from '@/lib/game-data-context'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { Building2 } from 'lucide-react'

export default function ProvidersPage() {
  const { isCollapsed } = useSidebar()
  const { providers, loading } = useGameData()

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
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Game Providers</h1>
              <p className="text-gray-400 text-sm mt-1">
                {loading ? 'Loading...' : `Browse games from ${providers.length} providers`}
              </p>
            </div>
          </div>

          {/* Providers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[180px] rounded-2xl bg-[#1a1534] border-2 border-[#2a2449] animate-pulse"
                />
              ))}
            </div>
          ) : providers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No providers available</p>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  )
}

