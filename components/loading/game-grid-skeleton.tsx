import { GameCardSkeleton } from './game-card-skeleton'

interface GameGridSkeletonProps {
  count?: number
}

export function GameGridSkeleton({ count = 24 }: GameGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  )
}

