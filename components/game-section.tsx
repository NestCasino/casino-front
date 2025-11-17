'use client'

import { GameCard } from './game-card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import type { Game } from '@/lib/mock-data'

interface GameSectionProps {
  title: string
  icon?: React.ReactNode
  games: Game[]
}

export function GameSection({ title, icon, games }: GameSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 440
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <h2 className="text-xl font-semibold text-[rgb(var(--text-primary))]">
            {title}
          </h2>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg hover:bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))] hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg hover:bg-[rgb(var(--surface))] text-[rgb(var(--text-muted))] hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Games Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game) => (
          <GameCard key={game.id} {...game} />
        ))}
      </div>
    </section>
  )
}
