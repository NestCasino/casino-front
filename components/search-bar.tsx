'use client'

import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import type { Game } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useSearch } from '@/lib/search-context'
import { GameCard } from './game-card'
import { useGames } from '@/hooks/use-games'

export function SearchBar() {
  const { isSearchOpen, openSearch, closeSearch } = useSearch()
  const [searchQuery, setSearchQuery] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch games with search query
  const { games, loading } = useGames({
    search: searchQuery || undefined,
    perPage: 50,
  })

  // Scroll function for horizontal navigation
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 440
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch()
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isSearchOpen, closeSearch])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSearchOpen])

  const handleGameClick = (game: Game) => {
    console.log('Selected game:', game)
    closeSearch()
    setSearchQuery('')
    // TODO: Navigate to game page or launch game
  }

  const filteredGames = games || []

  return (
    <>
      {/* Search Input Trigger */}
      <div className="relative mb-6">
        <div 
          className="relative cursor-pointer"
          onClick={openSearch}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[rgb(var(--text-muted))] pointer-events-none" />
          <input
            type="text"
            placeholder="Search your game"
            readOnly
            className="w-full h-12 pl-12 pr-4 bg-[rgb(var(--bg-elevated))] border border-[rgb(var(--surface))] rounded-xl text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] cursor-pointer transition-all hover:border-[rgb(var(--primary))]/50"
          />
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => {
              closeSearch()
              setSearchQuery('')
            }}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-7xl bg-[#0f0420] border border-[#2d1b4e] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Search Input */}
            <div className="relative border-b border-[#2d1b4e] bg-[#1a0b33]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search games, providers, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full h-16 pl-12 pr-12 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-lg"
              />
              <button
                onClick={() => {
                  closeSearch()
                  setSearchQuery('')
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-[#2d1b4e] rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Results Section */}
            <div className="p-6">
              {loading ? (
                <div className="py-16 text-center">
                  <div className="text-gray-500 text-lg mb-2">Searching...</div>
                </div>
              ) : filteredGames.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-gray-500 text-lg mb-2">No games found</div>
                  <div className="text-gray-600 text-sm">Try searching with different keywords</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Section Header with Results Count and Navigation */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Search className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">
                        Search Results
                      </h2>
                      {searchQuery && (
                        <span className="text-sm text-gray-400">
                          ({filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'})
                        </span>
                      )}
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-lg hover:bg-[#2d1b4e] text-gray-400 hover:text-white transition-all cursor-pointer"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-lg hover:bg-[#2d1b4e] text-gray-400 hover:text-white transition-all cursor-pointer"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Game Cards Carousel - 2 Rows */}
                  <div
                    ref={scrollRef}
                    className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 auto-cols-max"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {filteredGames.map((game) => (
                      <div key={game.id} onClick={() => handleGameClick(game)}>
                        <GameCard game={game} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-[#2d1b4e] bg-[#1a0b33] px-4 py-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-[#2d1b4e] rounded text-gray-400 font-mono">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-2 py-1 bg-[#2d1b4e] rounded text-gray-400 font-mono">Enter</kbd>
                  Select
                </span>
              </div>
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-[#2d1b4e] rounded text-gray-400 font-mono">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes slide-in-from-top-4 {
          from {
            transform: translateY(-1rem);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-in {
          animation: slide-in-from-top-4 0.3s ease-out, fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
