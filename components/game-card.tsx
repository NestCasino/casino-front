'use client'

import Image from 'next/image'
import { useState } from 'react'

interface GameCardProps {
  id: string
  name: string
  provider: string
  thumbnail: string
  playerCount: number
}

export function GameCard({ name, provider, thumbnail, playerCount }: GameCardProps) {
  const [imgError, setImgError] = useState(false)
  
  return (
    <div className="group relative flex-shrink-0 w-[200px] h-[260px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-250 hover:scale-105 hover:shadow-[0_12px_32px_rgba(139,92,246,0.4)]">
      {/* Game Image */}
      <div className="relative w-full h-full">
        <Image
          src={imgError ? `/placeholder.svg?height=260&width=200&query=${encodeURIComponent(name)}` : thumbnail}
          alt={name}
          fill
          className="object-cover transition-all duration-250 group-hover:brightness-110"
          onError={() => setImgError(true)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Player Count Badge */}
        <div className="absolute bottom-16 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] text-gray-300 font-medium">
            {playerCount.toLocaleString()} playing
          </span>
        </div>

        {/* Game Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
          <h3 className="text-base font-semibold text-white drop-shadow-lg text-balance">
            {name}
          </h3>
          <p className="text-xs text-gray-400">{provider}</p>
        </div>

        {/* Play Now Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
          <button className="px-6 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:brightness-110 transition-all cursor-pointer">
            Play Now
          </button>
        </div>
      </div>
    </div>
  )
}
