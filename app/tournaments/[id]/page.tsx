'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { GameCard } from '@/components/game-card'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'
import { Trophy, Clock, Coins, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import type { Game } from '@/lib/types'

// Mock tournament data
const tournamentData: Record<string, any> = {
  '1': {
    title: 'TABLE WARS',
    banner: '/slot-characters-multicolor-gradient.jpg',
    prizePool: '1,000 USDT',
    minBet: '$1.00',
    endsIn: '1d 22h 31m 37s',
    strategyRate: 'RATE',
    gradient: 'from-purple-600 to-blue-600'
  },
  '2': {
    title: 'SLOT MANIA',
    subtitle: 'BY BGAMING',
    banner: '/sweet-candy-slot-game.jpg',
    prizePool: '1,000 USDT + 1,000 Free Spins',
    minBet: '$0.60',
    endsIn: '1d 22h 31m 37s',
    strategyRate: 'RATE',
    gradient: 'from-pink-500 to-orange-500'
  },
  '3': {
    title: 'ENDORPHINA WILD WEEK',
    banner: '/zeus-olympus-slot-game.png',
    prizePool: '4,000 USDT',
    minBet: '$0.50',
    endsIn: '4d 14h 44m 10s',
    strategyRate: 'RATE',
    gradient: 'from-red-900 to-orange-700'
  }
}

// Mock leaderboard data
const leaderboardData = [
  { rank: 1, player: 'Lucy83****', bets: '4.06...', multiplier: 59, prize: '🏆' },
  { rank: 2, player: 'Beeeee****', bets: '2.02...', multiplier: 50, prize: '🥈' },
  { rank: 3, player: 'Player_20****', bets: '822.48', multiplier: 30, prize: '🥉' },
  { rank: 4, player: 'Am*', bets: '4.42...', multiplier: 29, prize: '💎' },
  { rank: 5, player: 'Gran*', bets: '715.50', multiplier: 27, prize: '💎' },
  { rank: 6, player: 'Ladykimster1961@yahoo****', bets: '1.47...', multiplier: 25, prize: '💎' },
  { rank: 7, player: 'Player_98****', bets: '75.14', multiplier: 22, prize: '💎' },
  { rank: 8, player: 'Player_99****', bets: '173.29', multiplier: 18, prize: '💎' },
  { rank: 9, player: 'Jc****', bets: '2.58...', multiplier: 17, prize: '💎' },
  { rank: 10, player: 'Player_69****', bets: '29.0...', multiplier: 16, prize: '💎' }
]

// Mock tournament games - TODO: Replace with real tournament games from backend
const tournamentGames: Game[] = [
  {
    id: 1,
    gameId: 'gemhalla',
    gameTitle: 'GEMHALLA',
    slug: 'gemhalla',
    image: '/purple-balls-plinko-game.jpg',
    providerId: null,
    categoryId: null,
    providerSlug: 'bgaming',
    categorySlug: 'slots',
    isMobile: true,
    isDesktop: true,
    isLive: false,
    isTrending: false,
    hasDemo: true,
    isRestricted: false,
  },
  {
    id: 2,
    gameId: 'elvis-frog',
    gameTitle: 'ELVIS FROG TRUEWAYS',
    slug: 'elvis-frog-trueways',
    image: '/slot-characters-multicolor-gradient.jpg',
    providerId: null,
    categoryId: null,
    providerSlug: 'bgaming',
    categorySlug: 'slots',
    isMobile: true,
    isDesktop: true,
    isLive: false,
    isTrending: false,
    hasDemo: true,
    isRestricted: false,
  },
  {
    id: 3,
    gameId: 'wild-tiger',
    gameTitle: 'WILD TIGER',
    slug: 'wild-tiger',
    image: '/purple-rocket-crash-game.jpg',
    providerId: null,
    categoryId: null,
    providerSlug: 'bgaming',
    categorySlug: 'slots',
    isMobile: true,
    isDesktop: true,
    isLive: false,
    isTrending: false,
    hasDemo: true,
    isRestricted: false,
  },
]

export default function TournamentDetailPage() {
  const { isCollapsed } = useSidebar()
  const params = useParams()
  const tournament = tournamentData[params.id as string] || tournamentData['2']

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className={cn(
        "pt-[70px] min-h-screen transition-all duration-300",
        isCollapsed ? "lg:ml-[70px]" : "lg:ml-60"
      )}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Back Button */}
          <Link 
            href="/tournaments"
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors w-fit"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-semibold">Tournaments</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Tournament Banner - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
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
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1.5 bg-purple-600 text-white text-sm font-bold rounded-full">
                    In Progress
                  </span>
                </div>

                {/* Title */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {tournament.title}
                  </h1>
                  {tournament.subtitle && (
                    <p className="text-lg text-white/90">{tournament.subtitle}</p>
                  )}
                </div>

                {/* Countdown Timer */}
                <div className="absolute bottom-6 left-6">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-xs text-gray-300 mb-2">ENDS IN:</div>
                    <div className="flex gap-2">
                      <div className="text-center">
                        <div className="bg-white rounded text-black font-bold text-xl px-3 py-2">1</div>
                        <div className="text-xs text-gray-300 mt-1">DAYS</div>
                      </div>
                      <div className="text-white text-xl py-2">:</div>
                      <div className="text-center">
                        <div className="bg-white rounded text-black font-bold text-xl px-3 py-2">22</div>
                        <div className="text-xs text-gray-300 mt-1">HRS</div>
                      </div>
                      <div className="text-white text-xl py-2">:</div>
                      <div className="text-center">
                        <div className="bg-white rounded text-black font-bold text-xl px-3 py-2">31</div>
                        <div className="text-xs text-gray-300 mt-1">MINS</div>
                      </div>
                      <div className="text-white text-xl py-2">:</div>
                      <div className="text-center">
                        <div className="bg-white rounded text-black font-bold text-xl px-3 py-2">37</div>
                        <div className="text-xs text-gray-300 mt-1">SEC</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Info Cards */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Trophy className="h-5 w-5 text-purple-400" />
                    <span className="text-xs uppercase">Prize Pool</span>
                  </div>
                  <div className="text-white font-bold">{tournament.prizePool}</div>
                </div>

                <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Coins className="h-5 w-5 text-green-400" />
                    <span className="text-xs uppercase">Min Bet</span>
                  </div>
                  <div className="text-green-400 font-bold flex items-center gap-1">
                    {tournament.minBet} <span className="text-xs">💎</span>
                  </div>
                </div>

                <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className="text-xs uppercase">Ends In</span>
                  </div>
                  <div className="text-white font-bold">{tournament.endsIn}</div>
                </div>

                <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                    <span className="text-xs uppercase">Strategy</span>
                  </div>
                  <div className="text-white font-bold">{tournament.strategyRate}</div>
                </div>
              </div>

              {/* Enroll Button */}
              <div className="bg-[#1a1534] border border-green-500/30 rounded-xl p-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎮</span>
                  <span className="text-white">Enroll in this tournament to participate and secure your prize!</span>
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all whitespace-nowrap">
                  Enroll
                </button>
              </div>
            </div>

            {/* Leaderboard Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-2xl overflow-hidden sticky top-24">
                <div className="bg-[#0f0420] px-6 py-4 border-b border-[#2d1b4e]">
                  <h2 className="text-xl font-bold text-white">Leaderboard</h2>
                </div>
                
                <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
                  {/* Header */}
                  <div className="grid grid-cols-[40px_1fr_80px_60px] gap-2 px-4 py-3 text-xs text-gray-400 uppercase sticky top-0 bg-[#1a1534] border-b border-[#2d1b4e]">
                    <div>#</div>
                    <div>Player</div>
                    <div className="text-right">Bets</div>
                    <div className="text-right">ML</div>
                  </div>

                  {/* Leaderboard Entries */}
                  {leaderboardData.map((entry) => (
                    <div
                      key={entry.rank}
                      className={cn(
                        "grid grid-cols-[40px_1fr_80px_60px] gap-2 px-4 py-3 hover:bg-[#241842] transition-colors border-b border-[#2d1b4e]/50",
                        entry.rank <= 3 && "bg-gradient-to-r from-amber-900/20 to-transparent"
                      )}
                    >
                      <div className="flex items-center text-2xl">
                        {entry.prize}
                      </div>
                      <div className="text-white text-sm truncate">{entry.player}</div>
                      <div className="text-white text-sm text-right flex items-center justify-end gap-1">
                        {entry.bets}
                        <span className="text-xs">💎</span>
                      </div>
                      <div className="text-white text-sm text-right font-semibold">{entry.multiplier}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tournament Games Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎮</span>
                <h2 className="text-2xl font-bold text-white">Tournament Games</h2>
              </div>
              <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors">
                View all
                <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded-full">
                  15
                </span>
              </button>
            </div>

            <div className="relative">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {tournamentGames.map((game) => (
                  <div key={game.id} className="flex-shrink-0 w-[200px]">
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Terms and Conditions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">TERMS AND CONDITIONS</h2>
            <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-2xl p-8 space-y-4 text-gray-300">
              <div>
                <span className="font-semibold text-white">1.</span> The BGaming Slot Mania tournaments start every Friday at 08:00 UTC and last for 7 days.
              </div>
              <div>
                <span className="font-semibold text-white">2.</span> Participation is required to take part in the Slot Mania tournament.
              </div>
              <div>
                <span className="font-semibold text-white">3.</span> Only bets of $0.6 or more qualify for the tournament. Minimum qualifying bets are 0.00000354 BTC, 0.00009553 ETH, 0.0006978 BCH, 0.00378201 LTC, 0.48420288 ADA, 1.68021339 DOG, 1.19103271 TRX, 0.14191443 XRP, 0.6 USDT, 0.6 USDC, 0.00039088 BNB, and 0.00181258 SOL.
              </div>
              <div>
                <span className="font-semibold text-white">4.</span> Only real money gameplay on games from the Slot Mania BGaming category count towards the tournament.
              </div>
              <div>
                <span className="font-semibold text-white">5.</span> The position on the leaderboard in the Slot Mania tournaments is based on the win multiplier (i.e., if you place a bet of $1 and win $10, that is a 10x multiplier).
              </div>
              <div>
                <span className="font-semibold text-white">6.</span> The bet amount used to calculate the win multiplier includes the base amount and the cost of activating special features, such as bonus buy. For example, if the base bet is $1 and the bonus buy feature increases the total bet to $100, the win multiplier is calculated based on the total amount of $100. This means that the win amount is divided by the total amount to determine the multiplier.
              </div>
              <div>
                <span className="font-semibold text-white">7.</span> The leaderboard is updated in real-time.
              </div>
            </div>
          </section>

        </div>
        <Footer />
      </main>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1534;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2d1b4e;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3d2b5e;
        }
      `}</style>
    </div>
  )
}

