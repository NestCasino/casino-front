'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import type { Category } from '@/lib/types'

interface UseCategoriesResult {
  categories: Category[] | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.categories.getActive()

      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        setError(response.error?.message || 'Failed to load categories')
        setCategories([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  }
}

