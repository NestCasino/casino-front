'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Category, Provider } from './types'
import { useCategories } from '@/hooks/use-categories'
import { useProviders } from '@/hooks/use-providers'

interface GameDataContextType {
  categories: Category[]
  providers: Provider[]
  getCategoryBySlug: (slug: string) => Category | undefined
  getProviderBySlug: (slug: string) => Provider | undefined
  getCategoryById: (id: number) => Category | undefined
  getProviderById: (id: number) => Provider | undefined
  loading: boolean
  error: string | null
}

const GameDataContext = createContext<GameDataContextType | undefined>(undefined)

export function GameDataProvider({ children }: { children: ReactNode }) {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const { providers, loading: providersLoading, error: providersError } = useProviders()

  const getCategoryBySlug = (slug: string): Category | undefined => {
    return categories?.find((cat) => cat.slug === slug)
  }

  const getProviderBySlug = (slug: string): Provider | undefined => {
    return providers?.find((prov) => prov.slug === slug)
  }

  const getCategoryById = (id: number): Category | undefined => {
    return categories?.find((cat) => cat.id === id)
  }

  const getProviderById = (id: number): Provider | undefined => {
    return providers?.find((prov) => prov.id === id)
  }

  const loading = categoriesLoading || providersLoading
  const error = categoriesError || providersError

  return (
    <GameDataContext.Provider
      value={{
        categories: categories || [],
        providers: providers || [],
        getCategoryBySlug,
        getProviderBySlug,
        getCategoryById,
        getProviderById,
        loading,
        error,
      }}
    >
      {children}
    </GameDataContext.Provider>
  )
}

export function useGameData() {
  const context = useContext(GameDataContext)
  if (context === undefined) {
    throw new Error('useGameData must be used within a GameDataProvider')
  }
  return context
}

