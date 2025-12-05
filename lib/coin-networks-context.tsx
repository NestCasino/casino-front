'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, CoinNetwork } from './api-client'

interface CoinNetworksContextType {
  networks: CoinNetwork[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const CoinNetworksContext = createContext<CoinNetworksContextType | undefined>(undefined)

export function useCoinNetworks() {
  const context = useContext(CoinNetworksContext)
  if (!context) {
    throw new Error('useCoinNetworks must be used within CoinNetworksProvider')
  }
  return context
}

// Fallback static network data in case API fails
const FALLBACK_NETWORKS: CoinNetwork[] = [
  {
    id: '1',
    name: 'Bitcoin',
    slug: 'bitcoin',
    baseFee: 0.0005,
    isActive: true,
    createDt: new Date().toISOString(),
    modifyDt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Ethereum',
    slug: 'ethereum',
    baseFee: 0.005,
    isActive: true,
    createDt: new Date().toISOString(),
    modifyDt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'ERC-20',
    slug: 'erc-20',
    baseFee: 0.003,
    isActive: true,
    createDt: new Date().toISOString(),
    modifyDt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'TRC-20',
    slug: 'trc-20',
    baseFee: 1,
    isActive: true,
    createDt: new Date().toISOString(),
    modifyDt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'BEP-20',
    slug: 'bep-20',
    baseFee: 0.0001,
    isActive: true,
    createDt: new Date().toISOString(),
    modifyDt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Litecoin',
    slug: 'litecoin',
    baseFee: 0.001,
    isActive: true,
    createDt: new Date().toISOString(),
    modifyDt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Tron',
    slug: 'tron',
    baseFee: 1,
    isActive: true,
    createDt: new Date().toISOString(),
    modifyDt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Solana',
    slug: 'solana',
    baseFee: 0.01,
    isActive: true,
    createDt: new Date().toISOString(),
    modifyDt: new Date().toISOString(),
  },
]

export function CoinNetworksProvider({ children }: { children: ReactNode }) {
  const [networks, setNetworks] = useState<CoinNetwork[]>(FALLBACK_NETWORKS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)

  const fetchNetworks = async (force = false) => {
    // Cache for 5 minutes
    const CACHE_DURATION = 5 * 60 * 1000
    const now = Date.now()
    
    if (!force && lastFetch && now - lastFetch < CACHE_DURATION) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await api.coinNetworks.getActive()
      
      if (response.success && response.data) {
        setNetworks(response.data)
        setLastFetch(now)
      } else {
        throw new Error(response.error?.message || 'Failed to load coin networks')
      }
    } catch (err: any) {
      console.error('Failed to fetch coin networks, using fallback data:', err)
      setError(err.message || 'Failed to load coin networks')
      // Keep using fallback networks or previously loaded networks
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = async () => {
    await fetchNetworks(true)
  }

  useEffect(() => {
    fetchNetworks()
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      fetchNetworks()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <CoinNetworksContext.Provider
      value={{
        networks,
        isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </CoinNetworksContext.Provider>
  )
}









