'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { Promotion } from '@/lib/mock-data'

interface PromotionCardProps extends Promotion {}

export function PromotionCard({
  id,
  title,
  description,
  imageUrl,
  endDate,
  prizePool
}: PromotionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <Link href={`/promotions/${id}`}>
      <div className="group bg-[#2d1b4e] border border-[#3d2b5e]/50 rounded-2xl overflow-hidden hover:border-[rgb(var(--primary))] hover:shadow-elevated hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 cursor-pointer shadow-card">
        {/* Image Section */}
        <div className="relative h-[200px] overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-all duration-300"
          />
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))] text-balance">
            {title}
          </h3>
          
          <p className="text-sm text-[rgb(var(--text-secondary))] line-clamp-2">
            {description}
          </p>

          {/* End Date */}
          <div className="flex items-center gap-2 pt-2">
            <Clock className="h-4 w-4 text-[rgb(var(--text-muted))]" />
            <div className="text-xs">
              <span className="text-[rgb(var(--text-muted))]">Ends at </span>
              <span className="text-[rgb(var(--text-primary))] font-semibold">
                {formatDate(endDate)}
              </span>
            </div>
          </div>

          {/* Prize Pool Badge */}
          {prizePool && (
            <div className="inline-block px-3 py-1.5 bg-[rgb(var(--primary))]/10 border border-[rgb(var(--primary))]/30 rounded-lg">
              <span className="text-sm font-bold text-[rgb(var(--primary))]">{prizePool}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
