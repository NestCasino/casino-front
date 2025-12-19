'use client'

import { GameSection } from './game-section'
import { useGames } from '@/hooks/use-games'
import type { Category } from '@/lib/types'

interface CategoryGameSectionProps {
  category: Category
}

// Category icon mapping
const getCategoryIcon = (slug: string): string => {
  const iconMap: Record<string, string> = {
    slots: '🎰',
    instant: '⚡',
    table: '🃏',
    arcade: '🕹️',
    lottery: '🎫',
    game_show: '🎬',
    other: '🎮',
  }
  return iconMap[slug] || '🎮'
}

export function CategoryGameSection({ category }: CategoryGameSectionProps) {
  const { games, loading } = useGames({
    categoryId: Number(category.id),
    perPage: 12,
  })

  return (
    <GameSection
      title={category.title}
      icon={getCategoryIcon(category.slug)}
      games={games}
      loading={loading}
      viewAllHref={`/category/${category.slug}`}
    />
  )
}













