'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { mockGames, type Game } from '@/lib/mock-data'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useSearch } from '@/lib/search-context'

export function SearchBar() {
  const { isSearchOpen, openSearch, closeSearch } = useSearch()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredGames, setFilteredGames] = useState<Game[]>([])

  // Filter games based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGames(mockGames)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = mockGames.filter(
        game =>
          game.name.toLowerCase().includes(query) ||
          game.provider.toLowerCase().includes(query) ||
          game.category.some(cat => cat.toLowerCase().includes(query))
      )
      setFilteredGames(filtered)
    }
  }, [searchQuery])

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
    // Here you can add navigation or other actions
  }

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
          <div className="relative w-full max-w-2xl bg-[#0f0420] border border-[#2d1b4e] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
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

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {filteredGames.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="text-gray-500 text-lg mb-2">No games found</div>
                  <div className="text-gray-600 text-sm">Try searching with different keywords</div>
                </div>
              ) : (
                <div className="p-2">
                  {searchQuery && (
                    <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">
                      {filteredGames.length} {filteredGames.length === 1 ? 'Result' : 'Results'}
                    </div>
                  )}
                  <div className="space-y-1">
                    {filteredGames.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => handleGameClick(game)}
                        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-[#1a0b33] transition-colors group cursor-pointer text-left"
                      >
                        {/* Game Thumbnail */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#2d1b4e]">
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🎮
                          </div>
                        </div>

                        {/* Game Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
                            {game.name}
                          </div>
                          <div className="text-sm text-gray-400 truncate">
                            {game.provider}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {game.playerCount.toLocaleString()} playing
                            </span>
                            {game.category.length > 0 && (
                              <>
                                <span className="text-gray-600">•</span>
                                <span className="text-xs text-purple-400">
                                  {game.category[0]}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Play Icon */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      </button>
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a0b33;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2d1b4e;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3d2b5e;
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
