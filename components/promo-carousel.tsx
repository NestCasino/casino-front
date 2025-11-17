'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
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
  },
  {
    id: '5',
    badge: 'MEGA TOURNAMENT',
    title: 'WIN BIG',
    subtitle: '$500,000',
    description: 'PRIZE POOL',
    imageUrl: '/gates-olympus-zeus-slot.jpg',
    gradient: 'from-yellow-600 to-orange-600'
  },
  {
    id: '6',
    badge: 'VIP EXCLUSIVE',
    title: 'CASHBACK',
    subtitle: 'UP TO 25%',
    description: 'ON ALL LOSSES',
    imageUrl: '/star-badge-boost-purple.jpg',
    gradient: 'from-indigo-600 to-purple-600'
  },
  {
    id: '7',
    badge: 'DAILY BONUS',
    title: 'FREE SPINS',
    subtitle: '100 SPINS',
    description: 'EVERY DAY!',
    imageUrl: '/sweet-candy-slot-game.jpg',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: '8',
    badge: 'LIVE CASINO',
    title: 'BLACKJACK',
    subtitle: '$50,000',
    description: 'LIVE TABLES',
    imageUrl: '/blackjack-casino-dealer.jpg',
    gradient: 'from-red-600 to-pink-600'
  },
  {
    id: '9',
    badge: 'SLOT RUSH',
    title: 'MULTIPLIERS',
    subtitle: 'UP TO 1000X',
    description: 'WIN MASSIVE!',
    imageUrl: '/book-of-dead-egypt-slot.jpg',
    gradient: 'from-amber-600 to-yellow-600'
  },
  {
    id: '10',
    badge: 'WEEKEND SPECIAL',
    title: 'RELOAD BONUS',
    subtitle: '150% MATCH',
    description: 'LIMITED TIME',
    imageUrl: '/wanted-dead-wild-western-slot.jpg',
    gradient: 'from-orange-600 to-red-600'
  }
]

export function PromoCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

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

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 380 // Width of each card
      const gap = 16 // Gap between cards (gap-4 = 1rem = 16px)
      const scrollPosition = index * (cardWidth + gap)
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }

  const updateActiveIndex = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = 380
      const gap = 16
      const scrollLeft = container.scrollLeft
      const index = Math.round(scrollLeft / (cardWidth + gap))
      setActiveIndex(Math.min(Math.max(0, index), promoCards.length - 1))
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', updateActiveIndex)
      return () => container.removeEventListener('scroll', updateActiveIndex)
    }
  }, [])

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
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`rounded-full transition-all cursor-pointer ${
              index === activeIndex
                ? 'w-8 h-2 bg-purple-500'
                : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
