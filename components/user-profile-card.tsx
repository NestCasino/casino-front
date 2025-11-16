'use client'

import { Star, Info } from 'lucide-react'
import Image from 'next/image'

export function UserProfileCard() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Username */}
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-[rgb(var(--text-primary))]">
          lashakatamadze
        </h2>
        <button className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--secondary))] transition-colors">
          <Star className="h-5 w-5" />
        </button>
      </div>

      {/* Center: VIP Progress */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[rgb(var(--text-muted))]">Your VIP Progress</span>
          <Info className="h-4 w-4 text-[rgb(var(--text-muted))]" />
        </div>
        <div className="space-y-1">
          <div className="h-2 bg-[rgb(var(--surface))] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))] rounded-full"
              style={{ width: '0%' }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[rgb(var(--text-muted))]">
              <span>None</span>
              <span>→</span>
              <span>Bronze</span>
            </div>
            <span className="text-[rgb(var(--text-secondary))] font-semibold">0.00%</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Access Cards */}
      <div className="flex gap-4">
        <div className="group relative w-32 h-24 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-[rgb(var(--info))] transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <div className="relative h-full flex flex-col items-center justify-center gap-2 p-3">
            <span className="text-2xl">🎰</span>
            <span className="text-sm font-semibold text-white">Casino</span>
            <div className="flex items-center gap-1 text-xs text-[rgb(var(--success))]">
              <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--success))]" />
              <span>53,291</span>
            </div>
          </div>
        </div>

        <div className="group relative w-32 h-24 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-[rgb(var(--success))] transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-blue-600/20" />
          <div className="relative h-full flex flex-col items-center justify-center gap-2 p-3">
            <span className="text-2xl">⚽</span>
            <span className="text-sm font-semibold text-white">Sports</span>
            <div className="flex items-center gap-1 text-xs text-[rgb(var(--success))]">
              <div className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--success))]" />
              <span>30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
