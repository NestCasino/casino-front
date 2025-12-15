'use client'

import { ProviderFilter } from './provider-filter'
import { SearchFilter } from './search-filter'

interface GameFiltersBarProps {
  providerId?: number
  search?: string
  onProviderChange: (providerId: number | undefined) => void
  onSearchChange: (search: string) => void
  showProviderFilter?: boolean
  showSearch?: boolean
}

export function GameFiltersBar({
  providerId,
  search,
  onProviderChange,
  onSearchChange,
  showProviderFilter = true,
  showSearch = true,
}: GameFiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {showSearch && (
        <SearchFilter value={search} onChange={onSearchChange} />
      )}
      {showProviderFilter && (
        <ProviderFilter value={providerId} onChange={onProviderChange} />
      )}
    </div>
  )
}

