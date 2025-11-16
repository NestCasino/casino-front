'use client'

import { useState } from 'react'

interface Provider {
  id: string
  name: string
  playerCount: number
}

const providers: Provider[] = [
  { id: '1', name: 'Pragmatic Play', playerCount: 8932 },
  { id: '2', name: 'Evolution Gaming', playerCount: 6421 },
  { id: '3', name: 'NetEnt', playerCount: 5234 },
  { id: '4', name: 'Play\'n GO', playerCount: 4876 },
  { id: '5', name: 'Push Gaming', playerCount: 3654 },
  { id: '6', name: 'Red Tiger', playerCount: 2987 },
  { id: '7', name: 'Hacksaw Gaming', playerCount: 2543 },
  { id: '8', name: 'NoLimit City', playerCount: 2154 },
]

export function ProviderFilter() {
  const [activeProvider, setActiveProvider] = useState<string | null>(null)

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 mb-6">
      {providers.map((provider) => (
        <button
          key={provider.id}
          onClick={() => setActiveProvider(provider.id === activeProvider ? null : provider.id)}
          className={`flex-shrink-0 flex flex-col items-center justify-center w-40 h-16 rounded-xl border transition-all duration-200 cursor-pointer ${
            activeProvider === provider.id
              ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))] text-white'
              : 'bg-[rgb(var(--bg-elevated))] border-[rgb(var(--surface))] text-[rgb(var(--text-secondary))] hover:border-[rgb(var(--primary))] hover:scale-105'
          }`}
        >
          <span className="text-sm font-semibold">{provider.name}</span>
          <div className="flex items-center gap-1 text-xs mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${activeProvider === provider.id ? 'bg-white' : 'bg-[rgb(var(--success))]'}`} />
            <span className={activeProvider === provider.id ? 'text-white' : 'text-[rgb(var(--text-muted))]'}>
              {provider.playerCount.toLocaleString()} playing
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
