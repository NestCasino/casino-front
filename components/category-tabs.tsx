'use client'

import { Grid3x3, Zap, TableProperties, Gamepad2, Ticket, Film, LayoutGrid } from 'lucide-react'
import { useState } from 'react'
import { useGameData } from '@/lib/game-data-context'
import Link from 'next/link'

// Icon mapping for categories
const getCategoryIcon = (slug: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    slots: <Gamepad2 className="h-5 w-5" />,
    instant: <Zap className="h-5 w-5" />,
    table: <TableProperties className="h-5 w-5" />,
    arcade: <LayoutGrid className="h-5 w-5" />,
    lottery: <Ticket className="h-5 w-5" />,
    game_show: <Film className="h-5 w-5" />,
    other: <Grid3x3 className="h-5 w-5" />,
  }
  return iconMap[slug] || <Grid3x3 className="h-5 w-5" />
}

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { categories } = useGameData()

  // Filter and sort categories
  const activeCategories = categories
    .filter(cat => cat.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-6">
      {/* All Games option */}
      <Link href="/all-games">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
              : 'bg-[#1a1534] border-2 border-[#2a2449] text-gray-400 hover:bg-[#241d42] hover:border-[#332959] hover:text-gray-300'
          }`}
        >
          <Grid3x3 className="h-5 w-5" />
          <span>All Games</span>
        </button>
      </Link>

      {/* Dynamic categories from backend */}
      {activeCategories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`}>
          <button
            onClick={() => setActiveCategory(category.slug)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
              activeCategory === category.slug
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'bg-[#1a1534] border-2 border-[#2a2449] text-gray-400 hover:bg-[#241d42] hover:border-[#332959] hover:text-gray-300'
            }`}
          >
            {getCategoryIcon(category.slug)}
            <span>{category.title}</span>
          </button>
        </Link>
      ))}
    </div>
  )
}
