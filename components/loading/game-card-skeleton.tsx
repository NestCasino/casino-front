export function GameCardSkeleton() {
  return (
    <div className="relative flex-shrink-0 w-[200px] h-[260px] rounded-2xl overflow-hidden bg-[#1a1534] animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-full bg-gradient-to-br from-[#2a2449] to-[#1a1534]" />
      
      {/* Player count badge skeleton */}
      <div className="absolute bottom-16 left-3 w-24 h-7 bg-[#2a2449] rounded-lg" />
      
      {/* Title skeleton */}
      <div className="absolute bottom-8 left-3 right-3 space-y-2">
        <div className="h-4 bg-[#2a2449] rounded w-3/4" />
        <div className="h-3 bg-[#2a2449] rounded w-1/2" />
      </div>
    </div>
  )
}

