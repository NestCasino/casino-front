'use client'

import { useEffect, useState, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/hooks/use-toast'
import { X, Loader2, AlertCircle, Maximize2, Minimize2, Heart } from 'lucide-react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import type { Game } from '@/lib/types'

export default function PlayGamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [game, setGame] = useState<Game | null>(null)
  const [gameUrl, setGameUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const gameContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadGame = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch game details
        const gameResult = await api.games.getGameBySlug(slug)
        
        if (!gameResult.success || !gameResult.data) {
          setError('Game not found')
          return
        }

        const gameData = gameResult.data
        setGame(gameData)

        // Check if game is restricted
        if (gameData.isRestricted) {
          setError('This game is not available in your region.')
          toast({
            title: 'Game Restricted',
            description: 'This game is not available in your region.',
            variant: 'destructive',
          })
          return
        }

        // Detect device type
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        const device = isMobile ? 'mobile' : 'desktop'

        // Prepare game identifier
        const gameParams = {
          ...(gameData.id ? { id: gameData.id } : {}),
          ...(gameData.slug ? { slug: gameData.slug } : {}),
          device,
        }

        let urlResult

        // Generate game URL based on authentication status
        if (isAuthenticated) {
          urlResult = await api.games.generateGameUrl(gameParams)
        } else if (gameData.hasDemo) {
          urlResult = await api.games.generateDemoUrl(gameParams)
        } else {
          setError('Please login to play this game. Demo mode is not available.')
          toast({
            title: 'Login Required',
            description: 'Please login to play this game. Demo mode is not available.',
            variant: 'destructive',
          })
          return
        }

        if (urlResult.success && urlResult.data.url) {
          setGameUrl(urlResult.data.url)
        } else {
          setError(urlResult.error?.message || 'Failed to load game')
          toast({
            title: 'Failed to Launch Game',
            description: urlResult.error?.message || 'Unable to start the game.',
            variant: 'destructive',
          })
        }
      } catch (err) {
        console.error('Error loading game:', err)
        setError('An unexpected error occurred')
        toast({
          title: 'Error',
          description: 'An unexpected error occurred while loading the game.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadGame()
  }, [slug, isAuthenticated, toast])

  const handleClose = () => {
    router.back()
  }

  const toggleFullscreen = async () => {
    if (!gameContainerRef.current) return

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (gameContainerRef.current.requestFullscreen) {
          await gameContainerRef.current.requestFullscreen()
        }
        setIsFullscreen(true)
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        }
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-[70px] min-h-screen bg-[rgb(var(--bg-primary))]">
        <div className="container mx-auto px-4 py-6">
          {/* Game Header */}
          {game && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-9 h-9 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors bg-[rgb(var(--bg-elevated))] rounded-lg hover:bg-[rgb(var(--surface))]"
                  aria-label="Go back"
                >
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-[rgb(var(--text-primary))]">{game.gameTitle}</h1>
                  {!isAuthenticated && game.hasDemo && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-white bg-yellow-500/80 rounded">
                      DEMO MODE
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center justify-center w-9 h-9 text-[rgb(var(--text-secondary))] hover:text-red-500 transition-colors bg-[rgb(var(--bg-elevated))] rounded-lg hover:bg-[rgb(var(--surface))]"
                  aria-label="Add to favorites"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Game Container */}
          <div 
            ref={gameContainerRef}
            className="relative w-full bg-black rounded-xl overflow-hidden shadow-elevated"
            style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}
          >
            {/* Fullscreen Toggle Button - Only show when game is loaded */}
            {gameUrl && !isLoading && !error && (
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 text-white bg-black/50 hover:bg-black/70 rounded-lg transition-all backdrop-blur-sm"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                <p className="text-lg text-gray-300">Loading game...</p>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-lg text-gray-300">{error}</p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Go Back
                </button>
              </div>
            )}

            {/* Game iframe */}
            {gameUrl && !isLoading && !error && (
              <iframe
                src={gameUrl}
                className="w-full h-full border-0"
                title={game?.gameTitle || 'Game'}
                allow="autoplay; fullscreen; payment"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

