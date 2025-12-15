'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Provider } from '@/lib/types'

interface ProviderCardProps {
  provider: Provider
  gameCount?: number
}

export function ProviderCard({ provider, gameCount }: ProviderCardProps) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link href={`/providers/${provider.slug}`}>
      <div className="group relative h-[180px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-250 hover:scale-105 hover:shadow-[0_12px_32px_rgba(139,92,246,0.4)] bg-[#1a1534] border-2 border-[#2a2449] hover:border-[#8b5cf6]">
        {/* Provider Logo/Image */}
        <div className="flex items-center justify-center h-full p-6">
          {provider.image && !imgError ? (
            <Image
              src={provider.image}
              alt={provider.title}
              width={200}
              height={100}
              className="object-contain max-w-full max-h-[80px] transition-all duration-250 group-hover:brightness-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="text-3xl font-bold text-white text-center">
              {provider.title}
            </div>
          )}
        </div>

        {/* Provider Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
          <h3 className="text-lg font-semibold text-white mb-1">
            {provider.title}
          </h3>
          {gameCount !== undefined && (
            <p className="text-sm text-gray-400">
              {gameCount} {gameCount === 1 ? 'game' : 'games'}
            </p>
          )}
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
      </div>
    </Link>
  )
}

