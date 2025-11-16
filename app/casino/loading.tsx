export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0f0420]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        <p className="text-sm text-gray-400">Loading Casino...</p>
      </div>
    </div>
  )
}
