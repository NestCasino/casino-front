'use client'

import { PhoneCall as Football, Dribbble as Dribble, Trophy, Gamepad2, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface SportCategory {
  id: string
  label: string
  icon: React.ReactNode
}

const sportCategories: SportCategory[] = [
  { id: 'soccer', label: 'Soccer', icon: <Football className="h-5 w-5" /> },
  { id: 'basketball', label: 'Basketball', icon: <Dribble className="h-5 w-5" /> },
  { id: 'tennis', label: 'Tennis', icon: <Trophy className="h-5 w-5" /> },
  { id: 'esports', label: 'eSports', icon: <Gamepad2 className="h-5 w-5" /> },
  { id: 'all', label: 'All Sports', icon: <TrendingUp className="h-5 w-5" /> },
]

export function SportCategoryTabs() {
  const [activeCategory, setActiveCategory] = useState('soccer')

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-6">
      {sportCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
            activeCategory === category.id
              ? 'bg-[rgb(var(--primary))] text-white'
              : 'bg-transparent border-2 border-[rgb(var(--surface))] text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--surface))] hover:border-[rgb(var(--surface-hover))]'
          }`}
        >
          {category.icon}
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  )
}
