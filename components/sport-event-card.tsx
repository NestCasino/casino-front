'use client'

import Image from 'next/image'
import type { SportEvent } from '@/lib/mock-data'

interface SportEventCardProps extends SportEvent {}

export function SportEventCard({
  league,
  teamA,
  teamB,
  teamALogo,
  teamBLogo,
  time,
  isLive,
  odds,
  marketCount
}: SportEventCardProps) {
  return (
    <div className="bg-[rgb(var(--bg-elevated))] rounded-xl p-4 hover:border hover:border-[rgb(var(--primary))] transition-all cursor-pointer shadow-card">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Match Info */}
        <div className="flex-1 space-y-3">
          {/* League */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[rgb(var(--text-muted))]">{league}</span>
            {isLive && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[rgb(var(--error))] animate-pulse" />
                <span className="text-xs font-semibold text-[rgb(var(--error))]">LIVE</span>
              </div>
            )}
          </div>

          {/* Teams */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={teamALogo || "/placeholder.svg"}
                  alt={teamA}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">{teamA}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={teamBLogo || "/placeholder.svg"}
                  alt={teamB}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-semibold text-[rgb(var(--text-primary))]">{teamB}</span>
            </div>
          </div>

          {/* Time */}
          <div className="text-xs text-[rgb(var(--text-muted))]">
            {isLive ? 'Match in Progress' : time}
          </div>
        </div>

        {/* Right: Odds */}
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            <button className="min-w-[60px] px-3 py-2 bg-[rgb(var(--surface))] hover:bg-[rgb(var(--primary))] rounded-lg transition-all text-center">
              <div className="text-[10px] text-[rgb(var(--text-muted))] mb-0.5">1</div>
              <div className="text-sm font-semibold text-[rgb(var(--text-primary))]">{odds.home.toFixed(2)}</div>
            </button>
            {odds.draw && (
              <button className="min-w-[60px] px-3 py-2 bg-[rgb(var(--surface))] hover:bg-[rgb(var(--primary))] rounded-lg transition-all text-center">
                <div className="text-[10px] text-[rgb(var(--text-muted))] mb-0.5">X</div>
                <div className="text-sm font-semibold text-[rgb(var(--text-primary))]">{odds.draw.toFixed(2)}</div>
              </button>
            )}
            <button className="min-w-[60px] px-3 py-2 bg-[rgb(var(--surface))] hover:bg-[rgb(var(--primary))] rounded-lg transition-all text-center">
              <div className="text-[10px] text-[rgb(var(--text-muted))] mb-0.5">2</div>
              <div className="text-sm font-semibold text-[rgb(var(--text-primary))]">{odds.away.toFixed(2)}</div>
            </button>
          </div>
          {marketCount > 0 && (
            <span className="text-xs text-[rgb(var(--primary))] hover:underline cursor-pointer">
              +{marketCount} more markets
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
