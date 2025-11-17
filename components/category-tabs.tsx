'use client'

import { Grid3x3, Sparkles, Flame, Gamepad2, Video, Badge } from 'lucide-react'
import { useState } from 'react'

interface Category {
  id: string
  label: string
  icon: React.ReactNode
}

const categories: Category[] = [
  { id: 'lobby', label: 'Lobby', icon: <Grid3x3 className="h-5 w-5" /> },
  { id: 'new', label: 'New Releases', icon: <Sparkles className="h-5 w-5" /> },
  { id: 'originals', label: 'Nest Originals', icon: <Flame className="h-5 w-5" /> },
  { id: 'slots', label: 'Slots', icon: <Gamepad2 className="h-5 w-5" /> },
  { id: 'live', label: 'Live Casino', icon: <Video className="h-5 w-5" /> },
  { id: 'exclusive', label: 'Only on Nest', icon: <Badge className="h-5 w-5" /> },
]

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState('lobby')

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
            activeCategory === category.id
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
              : 'bg-[#1a1534] border-2 border-[#2a2449] text-gray-400 hover:bg-[#241d42] hover:border-[#332959] hover:text-gray-300'
          }`}
        >
          {category.icon}
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  )
}
