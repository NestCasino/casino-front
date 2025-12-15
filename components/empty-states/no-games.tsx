import { Gamepad2, Search } from 'lucide-react'

interface NoGamesProps {
  message?: string
  description?: string
  showSearchIcon?: boolean
}

export function NoGames({ 
  message = 'No games found',
  description = 'Try adjusting your filters or search term',
  showSearchIcon = true
}: NoGamesProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-[#1a1534] border-2 border-[#2a2449] flex items-center justify-center mb-6">
        {showSearchIcon ? (
          <Search className="h-10 w-10 text-gray-500" />
        ) : (
          <Gamepad2 className="h-10 w-10 text-gray-500" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
      <p className="text-gray-400 text-center max-w-md">{description}</p>
    </div>
  )
}

