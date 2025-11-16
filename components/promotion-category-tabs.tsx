'use client'

import { useState } from 'react'

type PromotionCategory = 'all' | 'casino' | 'sport' | 'community' | 'poker' | 'esports'

interface PromotionCategoryTabsProps {
  activeCategory?: PromotionCategory
  onCategoryChange?: (category: PromotionCategory) => void
}

const categories: { id: PromotionCategory; label: string }[] = [
  { id: 'all', label: 'All Promotions' },
  { id: 'casino', label: 'Casino' },
  { id: 'sport', label: 'Sport' },
  { id: 'community', label: 'Community' },
  { id: 'poker', label: 'Poker' },
  { id: 'esports', label: 'Esports' },
]

export function PromotionCategoryTabs({ activeCategory = 'all', onCategoryChange }: PromotionCategoryTabsProps) {
  const [active, setActive] = useState<PromotionCategory>(activeCategory)

  const handleCategoryChange = (category: PromotionCategory) => {
    setActive(category)
    onCategoryChange?.(category)
  }

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold transition-all duration-200 cursor-pointer ${
            active === category.id
              ? 'bg-[rgb(var(--primary))] text-white'
              : 'bg-transparent border-2 border-[rgb(var(--surface))] text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--surface))] hover:border-[rgb(var(--surface-hover))]'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
