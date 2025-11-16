'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[rgb(var(--text-muted))]" />
        <input
          type="text"
          placeholder="Search your game"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-[rgb(var(--bg-elevated))] border border-[rgb(var(--surface))] rounded-xl text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--primary))]/20 transition-all"
        />
      </div>
    </div>
  )
}
