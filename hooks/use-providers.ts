'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'
import type { Provider } from '@/lib/types'

interface UseProvidersResult {
  providers: Provider[] | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProviders(): UseProvidersResult {
  const [providers, setProviders] = useState<Provider[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProviders = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.providers.getActive()

      if (response.success && response.data) {
        setProviders(response.data)
      } else {
        setError(response.error?.message || 'Failed to load providers')
        setProviders([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load providers')
      setProviders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  return {
    providers,
    loading,
    error,
    refetch: fetchProviders,
  }
}

