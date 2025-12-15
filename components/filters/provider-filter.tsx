'use client'

import { useGameData } from '@/lib/game-data-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Package } from 'lucide-react'

interface ProviderFilterProps {
  value?: number
  onChange: (providerId: number | undefined) => void
}

export function ProviderFilter({ value, onChange }: ProviderFilterProps) {
  const { providers, loading } = useGameData()

  const handleValueChange = (val: string) => {
    if (val === 'all') {
      onChange(undefined)
    } else {
      onChange(parseInt(val, 10))
    }
  }

  if (loading) {
    return (
      <div className="w-[200px] h-10 bg-[#1a1534] border-2 border-[#2a2449] rounded-lg animate-pulse" />
    )
  }

  return (
    <Select value={value?.toString() || 'all'} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px] bg-[#1a1534] border-2 border-[#2a2449] text-white hover:bg-[#241d42] hover:border-[#332959] transition-all">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-400" />
          <SelectValue placeholder="All Providers" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#1a1534] border-[#2a2449] text-white">
        <SelectItem value="all" className="hover:bg-[#241d42] cursor-pointer">
          All Providers
        </SelectItem>
        {providers.map((provider) => (
          <SelectItem
            key={provider.id}
            value={provider.id.toString()}
            className="hover:bg-[#241d42] cursor-pointer"
          >
            {provider.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

