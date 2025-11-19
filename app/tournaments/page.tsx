'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { Trophy, Clock, Coins } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Tournament {
  id: string
  title: string
  subtitle?: string
  banner: string
  status: 'active' | 'upcoming' | 'finished'
  prizePool: string
  minBet: string
  endsIn: string
  gradient: string
}

// Mock tournaments data
const mockTournaments: Tournament[] = [
  {
    id: '1',
    title: 'TABLE WARS',
    banner: '/slot-characters-multicolor-gradient.jpg',
    status: 'active',
    prizePool: '1,000 USDT',
    minBet: '$1.00',
    endsIn: '1d 02h 45m 10s',
    gradient: 'from-purple-600 to-blue-600'
  },
  {
    id: '2',
    title: 'SLOT MANIA',
    subtitle: 'BY BGAMING',
    banner: '/sweet-candy-slot-game.jpg',
    status: 'active',
    prizePool: '1,000 USDT + 1,000 Free Spins',
    minBet: '$0.60',
    endsIn: '1d 22h 35m 10s',
    gradient: 'from-pink-500 to-orange-500'
  },
  {
    id: '3',
    title: 'ENDORPHINA WILD WEEK',
    banner: '/zeus-olympus-slot-game.png',
    status: 'active',
    prizePool: '4,000 USDT',
    minBet: '$0.50',
    endsIn: '4d 14h 44m 10s',
    gradient: 'from-red-900 to-orange-700'
  },
  {
    id: '4',
    title: 'ROOKIE SLOT WARS',
    banner: '/purple-grid-mines-game.jpg',
    status: 'active',
    prizePool: '500 USDT',
    minBet: '$0.20',
    endsIn: '2d 08h 15m 30s',
    gradient: 'from-purple-700 to-pink-600'
  },
  {
    id: '5',
    title: 'VIP TOURNAMENT',
    banner: '/blackjack-casino-dealer.jpg',
    status: 'active',
    prizePool: '10,000 USDT',
    minBet: '$5.00',
    endsIn: '6d 12h 22m 45s',
    gradient: 'from-blue-600 to-cyan-500'
  },
  {
    id: '6',
    title: 'MEGA SLOTS BATTLE',
    banner: '/egypt-book-of-dead-slot.jpg',
    status: 'upcoming',
    prizePool: '2,500 USDT',
    minBet: '$1.00',
    endsIn: 'Starts in 12h',
    gradient: 'from-amber-600 to-yellow-500'
  }
]

export default function TournamentsPage() {
  const { isCollapsed } = useSidebar()
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'finished'>('active')

  const filteredTournaments = mockTournaments.filter(t => t.status === activeTab)

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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-amber-500" />
              <h1 className="text-3xl font-bold text-white">Tournaments</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('active')}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold text-sm transition-colors",
                  activeTab === 'active'
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#1a1534] text-gray-400 hover:bg-[#241842]'
                )}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold text-sm transition-colors",
                  activeTab === 'upcoming'
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#1a1534] text-gray-400 hover:bg-[#241842]'
                )}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('finished')}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold text-sm transition-colors",
                  activeTab === 'finished'
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#1a1534] text-gray-400 hover:bg-[#241842]'
                )}
              >
                Finished
              </button>
            </div>
          </div>

          {/* Tournaments Grid */}
          {filteredTournaments.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No {activeTab} tournaments
              </h3>
              <p className="text-gray-500">Check back later for new tournaments!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-[#1a1534] border border-[#2d1b4e] rounded-2xl overflow-hidden hover:border-purple-500 transition-all group"
                >
                  {/* Tournament Banner */}
                  <div className="relative h-48 overflow-hidden">
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-r opacity-90",
                      tournament.gradient
                    )} />
                    <Image
                      src={tournament.banner}
                      alt={tournament.title}
                      fill
                      className="object-cover mix-blend-overlay"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                        In Progress
                      </span>
                    </div>

                    {/* Title */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {tournament.title}
                      </h3>
                      {tournament.subtitle && (
                        <p className="text-sm text-white/80">{tournament.subtitle}</p>
                      )}
                    </div>
                  </div>

                  {/* Tournament Info */}
                  <div className="p-4 space-y-3">
                    {/* Prize Pool */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Trophy className="h-4 w-4" />
                        <span className="text-sm">Prize Pool</span>
                      </div>
                      <span className="text-white font-semibold">{tournament.prizePool}</span>
                    </div>

                    {/* Min Bet */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Coins className="h-4 w-4" />
                        <span className="text-sm">Min Bet</span>
                      </div>
                      <span className="text-green-400 font-semibold flex items-center gap-1">
                        {tournament.minBet}
                        <span className="text-xs">💎</span>
                      </span>
                    </div>

                    {/* Ends In */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Ends in</span>
                      </div>
                      <span className="text-red-400 font-semibold">{tournament.endsIn}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all">
                        Enroll
                      </button>
                      <Link href={`/tournaments/${tournament.id}`} className="flex-1">
                        <button className="w-full py-2.5 bg-[#0f0420] hover:bg-[#1a0b33] text-white font-bold rounded-lg transition-all border border-[#2d1b4e]">
                          View Leaderboard
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
        <Footer />
      </main>
    </div>
  )
}

