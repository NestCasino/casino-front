'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api-client'
import type { Game, GameFilters } from '@/lib/types'

interface UseGamesResult {
  games: Game[] | null
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  } | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useGames(filters: GameFilters): UseGamesResult {
  const [games, setGames] = useState<Game[] | null>(null)
  const [meta, setMeta] = useState<UseGamesResult['meta']>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Destructure filters to use individual values as dependencies
  const { page, perPage, categoryId, providerId, search, isLive, isTrending } = filters

  const fetchGames = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.games.getGames({
        page: page || 1,
        perPage: perPage || 24,
        categoryId,
        providerId,
        search,
        isLive,
        isTrending,
      })

      if (response.success && response.data) {
        setGames(response.data.data)
        setMeta(response.data.meta)
      } else {
        setError(response.error?.message || 'Failed to load games')
        setGames([])
        setMeta(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games')
      setGames([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }, [page, perPage, categoryId, providerId, search, isLive, isTrending])

  useEffect(() => {
    // Debounce search queries
    if (search !== undefined && search !== '') {
      const timeout = setTimeout(() => {
        fetchGames()
      }, 400)
      return () => clearTimeout(timeout)
    } else {
      fetchGames()
    }
  }, [fetchGames, search])

  return {
    games,
    meta,
    loading,
    error,
    refetch: fetchGames,
  }
}

