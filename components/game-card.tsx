'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Game } from '@/lib/types'
import { useGameData } from '@/lib/game-data-context'
import { useToast } from '@/hooks/use-toast'

interface GameCardProps {
  game: Game
  playerCount?: number
}

export function GameCard({ game, playerCount = 0 }: GameCardProps) {
  const [imgError, setImgError] = useState(false)
  const { getProviderById } = useGameData()
  const { toast } = useToast()
  const router = useRouter()
  
  // Get provider name from context
  const provider = game.providerId ? getProviderById(game.providerId) : null
  const providerName = provider?.title || game.providerSlug || 'Unknown'

  // Construct image URL
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    
    // Remove leading slash if present to avoid double slashes if API_URL ends with one
    // But usually better to just handle it safely. 
    // Assuming API_URL might not have trailing slash.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
    return `${apiUrl}${cleanPath}`
  }
  
  const imageUrl = getImageUrl(game.image)
  
  // Check if game has a valid image - if not, don't even try to load it
  const hasValidImage = !!imageUrl
  const shouldShowPlaceholder = !hasValidImage || imgError

  const handlePlayNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Check if game is restricted
    if (game.isRestricted) {
      toast({
        title: 'Game Restricted',
        description: 'This game is not available in your region.',
        variant: 'destructive',
      })
      return
    }

    // Navigate to play page
    router.push(`/play/${game.slug}`)
  }
  
  return (
    <div className="group relative flex-shrink-0 w-full h-[260px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-250 hover:scale-105 hover:shadow-[0_12px_32px_rgba(139,92,246,0.4)]">
      {/* Game Image */}
      <div className="relative w-full h-full">
        {shouldShowPlaceholder ? (
          // Placeholder for missing images
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-purple-900/30 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 font-medium">No Image Available</p>
          </div>
        ) : (
          <Image
            src={imageUrl!}
            alt={game.gameTitle}
            fill
            className="object-cover transition-all duration-250 group-hover:brightness-110"
            onError={() => setImgError(true)}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Restricted Badge */}
        {game.isRestricted && (
          <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-[10px] text-white font-semibold">Restricted</span>
          </div>
        )}
        
        {/* Player Count Badge (if provided) */}
        {playerCount > 0 && (
          <div className="absolute bottom-16 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[11px] text-gray-300 font-medium">
              {playerCount.toLocaleString('en-US')} playing
            </span>
          </div>
        )}

        {/* Game Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
          <h3 className="text-base font-semibold text-white drop-shadow-lg text-balance line-clamp-2">
            {game.gameTitle}
          </h3>
          <p className="text-xs text-gray-400">{providerName}</p>
        </div>

        {/* Play Now Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
          <button 
            onClick={handlePlayNow}
            className="px-6 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:brightness-110 transition-all cursor-pointer"
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  )
}
