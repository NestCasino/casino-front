'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PromoCard {
  id: string
  badge: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  gradient: string
}

const promoCards: PromoCard[] = [
  {
    id: '1',
    badge: 'WILD LOTTERY',
    title: 'CASH PRIZES',
    subtitle: 'WITH 0x WAGERING',
    description: 'EVERY WEEK!',
    imageUrl: '/racing-tires-blue-gradient.jpg',
    gradient: 'from-blue-600 to-purple-600'
  },
  {
    id: '2',
    badge: 'WHEELS OF FORTUNE',
    title: 'SPIN WEEKLY',
    subtitle: 'FOR $130,000',
    description: 'IN REWARDS',
    imageUrl: '/slot-characters-multicolor-gradient.jpg',
    gradient: 'from-purple-600 to-purple-700'
  },
  {
    id: '3',
    badge: 'JUNGLE JACKPOTS',
    title: '$25,000',
    subtitle: 'JACKPOTS',
    description: 'SPIN, HIT, WIN!',
    imageUrl: '/roulette-casino-red-gradient.jpg',
    gradient: 'from-pink-600 to-purple-600'
  },
  {
    id: '4',
    badge: 'WEEKLY SPOTLIGHT',
    title: 'DOUBLE POINTS',
    subtitle: 'XP AND WINS',
    description: 'ALL WEEK LONG',
    imageUrl: '/racing-tires-blue-gradient.jpg',
    gradient: 'from-green-600 to-teal-600'
  }
]

export function PromoCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative w-full mb-8">
      {/* Navigation Arrows */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all cursor-pointer"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-all cursor-pointer"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Cards Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-12"
      >
        {promoCards.map((card) => (
          <div
            key={card.id}
            className={`relative flex-shrink-0 w-[380px] h-[180px] rounded-2xl overflow-hidden bg-gradient-to-r ${card.gradient} cursor-pointer transition-transform hover:scale-105`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 opacity-40">
              <Image
                src={card.imageUrl || "/placeholder.svg"}
                alt={card.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col justify-between z-10">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">🏆</span>
                <span className="text-xs font-bold text-white/80 tracking-wider">
                  {card.badge}
                </span>
              </div>

              {/* Text Content */}
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white leading-tight">
                  {card.title}
                </h3>
                <p className="text-base font-bold text-white/90">
                  {card.subtitle}
                </p>
                <p className="text-sm font-semibold text-white/80">
                  {card.description}
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 text-4xl opacity-20">
              💰
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {promoCards.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-600"
          />
        ))}
      </div>
    </div>
  )
}
