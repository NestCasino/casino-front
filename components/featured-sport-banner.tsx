'use client'

import Image from 'next/image'

export function FeaturedSportBanner() {
  return (
    <div className="relative h-[280px] rounded-3xl overflow-hidden mb-8 shadow-elevated">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/60 via-purple-600/60 to-pink-600/60" />
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/placeholder.svg?height=280&width=1400"
          alt="Featured Match"
          fill
          className="object-cover opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-between px-12">
        {/* Left: Match Details */}
        <div className="space-y-4 z-10">
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
            Premier League
          </div>
          
          <div className="flex items-center gap-8">
            {/* Team A */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  alt="Manchester United"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-xl font-bold text-white">Manchester United</span>
            </div>

            {/* VS */}
            <div className="text-3xl font-bold text-white/80">VS</div>

            {/* Team B */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                <Image
                  src="/placeholder.svg?height=80&width=80"
                  alt="Liverpool"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <span className="text-xl font-bold text-white">Liverpool</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold">LIVE NOW</span>
            </div>
            <span className="text-sm">Old Trafford Stadium</span>
          </div>
        </div>

        {/* Right: Quick Odds */}
        <div className="space-y-3 z-10">
          <div className="text-sm text-white/80 font-semibold mb-2">Quick Bet</div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all">
              <div className="text-xs text-white/80 mb-1">Home</div>
              <div className="text-xl font-bold text-white">2.10</div>
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all">
              <div className="text-xs text-white/80 mb-1">Draw</div>
              <div className="text-xl font-bold text-white">3.45</div>
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all">
              <div className="text-xs text-white/80 mb-1">Away</div>
              <div className="text-xl font-bold text-white">2.80</div>
            </button>
          </div>
          <button className="w-full px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 rounded-xl font-semibold text-white transition-all">
            Place Bet
          </button>
        </div>
      </div>
    </div>
  )
}
