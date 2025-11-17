import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { ChevronLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { mockPromotions } from '@/lib/mock-data'
import { notFound } from 'next/navigation'

// Exported for unit testing and reuse
export function formatDateRange(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export default function PromotionDetailPage({ params }: { params: { id: string } }) {
  const promotion = mockPromotions.find(p => p.id === params.id)
  
  if (!promotion) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-[70px] min-h-screen">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <Link 
            href="/promotions"
            className="inline-flex items-center gap-2 text-sm text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{promotion.title}</span>
          </Link>

          {/* Hero Image */}
          <div className="relative h-[400px] rounded-3xl overflow-hidden mb-8 shadow-elevated">
            <Image
              src={promotion.imageUrl || "/placeholder.svg"}
              alt={promotion.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2 text-sm text-[rgb(var(--text-muted))] mb-4">
            <Calendar className="h-4 w-4" />
            <span>November 14, 2025 - {formatDateRange(promotion.endDate)}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-[rgb(var(--text-primary))] mb-6 text-balance">
            {promotion.title}
          </h1>

          {/* Content Sections */}
          <div className="prose prose-invert max-w-none space-y-8">
            {/* Introduction */}
            <div>
              <p className="text-lg text-[rgb(var(--text-secondary))] leading-relaxed">
                {promotion.description}
              </p>
            </div>

            {/* How To Enter */}
            <div>
              <h2 className="text-2xl font-semibold text-[rgb(var(--text-primary))] mb-4">
                How To Enter
              </h2>
              <ul className="space-y-3 text-[rgb(var(--text-secondary))]">
                <li className="flex gap-3">
                  <span className="text-[rgb(var(--primary))] font-bold">1.</span>
                  <span>Place a bet of at least 0.50c USD (or currency equivalent) on the participating games to be eligible.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[rgb(var(--primary))] font-bold">2.</span>
                  <span>Minimum multiplier to qualify: 10x</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[rgb(var(--primary))] font-bold">3.</span>
                  <span>Collect multipliers throughout the promotional period to climb the leaderboard.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[rgb(var(--primary))] font-bold">4.</span>
                  <span>Top players at the end of the promotion will share the prize pool!</span>
                </li>
              </ul>
            </div>

            {/* Participating Games */}
            <div>
              <h2 className="text-2xl font-semibold text-[rgb(var(--text-primary))] mb-4">
                Participating Games
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Link href="#" className="text-[rgb(var(--primary))] hover:underline">Book of Abyss</Link>
                <Link href="#" className="text-[rgb(var(--primary))] hover:underline">Book of Arcane</Link>
                <Link href="#" className="text-[rgb(var(--primary))] hover:underline">Sweet Bonanza</Link>
                <Link href="#" className="text-[rgb(var(--primary))] hover:underline">Gates of Olympus</Link>
                <Link href="#" className="text-[rgb(var(--primary))] hover:underline">The Dog House</Link>
                <Link href="#" className="text-[rgb(var(--primary))] hover:underline">Sugar Rush</Link>
              </div>
            </div>

            {/* Prize Distribution */}
            {promotion.prizePool && (
              <div>
                <h2 className="text-2xl font-semibold text-[rgb(var(--text-primary))] mb-4">
                  Prize Distribution
                </h2>
                <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[rgb(var(--surface))]">
                    <span className="text-[rgb(var(--text-secondary))]">1st Place</span>
                    <span className="font-bold text-[rgb(var(--secondary))]">$10,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[rgb(var(--surface))]">
                    <span className="text-[rgb(var(--text-secondary))]">2nd Place</span>
                    <span className="font-bold text-[rgb(var(--secondary))]">$5,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[rgb(var(--surface))]">
                    <span className="text-[rgb(var(--text-secondary))]">3rd Place</span>
                    <span className="font-bold text-[rgb(var(--secondary))]">$3,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[rgb(var(--text-secondary))]">4th-50th Place</span>
                    <span className="font-bold text-[rgb(var(--secondary))]">Share remaining pool</span>
                  </div>
                </div>
              </div>
            )}

            {/* Terms & Conditions */}
            <div>
              <h2 className="text-2xl font-semibold text-[rgb(var(--text-primary))] mb-4">
                Terms & Conditions
              </h2>
              <div className="text-[13px] text-[rgb(var(--text-muted))] space-y-2 leading-relaxed">
                <p>This promotion is subject to the following terms and conditions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Promotion is available to all registered Nest Casino players.</li>
                  <li>Geographic restrictions may apply based on local regulations.</li>
                  <li>Prizes will be credited within 72 hours of promotion end.</li>
                  <li>Nest Casino reserves the right to modify or cancel this promotion at any time.</li>
                  <li>General Terms & Conditions apply.</li>
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button className="w-full sm:w-auto px-8 py-4 bg-[rgb(var(--primary))] hover:brightness-110 text-white text-lg font-semibold rounded-xl transition-all shadow-lg glow-purple">
                Play Now
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
