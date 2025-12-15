'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchFilterProps {
  value?: string
  onChange: (search: string) => void
  placeholder?: string
}

export function SearchFilter({ value = '', onChange, placeholder = 'Search games...' }: SearchFilterProps) {
  const [localValue, setLocalValue] = useState(value)

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Debounced onChange
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(localValue)
    }, 400)

    return () => clearTimeout(timeout)
  }, [localValue, onChange])

  const handleClear = () => {
    setLocalValue('')
    onChange('')
  }

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10 bg-[#1a1534] border-2 border-[#2a2449] text-white placeholder:text-gray-500 focus:border-[#8b5cf6] transition-all"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

