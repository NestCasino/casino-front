'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PromoSlide {
  id: string
  title: string
  description: string
  imageUrl: string
  buttonText: string
  buttonColor: string
  gradient: string
}

const promoSlides: PromoSlide[] = [
  {
    id: '1',
    title: 'Daily Races',
    description: 'Play in our $100,000 Daily Race',
    imageUrl: '/racing-tires-blue-gradient.jpg',
    buttonText: 'Race Now',
    buttonColor: 'border-blue-400 text-blue-400',
    gradient: 'from-blue-600/40 to-purple-600/40'
  },
  {
    id: '2',
    title: "Just Slots' Multiplier Mania",
    description: '$30,000 Prize Pool!',
    imageUrl: '/slot-characters-multicolor-gradient.jpg',
    buttonText: 'Learn More',
    buttonColor: 'border-purple-400 text-purple-400',
    gradient: 'from-purple-600/40 to-pink-600/40'
  },
  {
    id: '3',
    title: 'Mega Lucky Drops',
    description: '$50,000 in Prize Drops!',
    imageUrl: '/roulette-casino-red-gradient.jpg',
    buttonText: 'Learn More',
    buttonColor: 'border-red-400 text-red-400',
    gradient: 'from-red-600/40 to-orange-600/40'
  }
]

export function PromoCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promoSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length)
  }

  return (
    <div className="relative w-full h-[240px] mb-8">
      <div className="relative h-full overflow-hidden rounded-3xl">
        {promoSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-500 ${
              index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`relative h-full bg-gradient-to-r ${slide.gradient} overflow-hidden rounded-3xl shadow-elevated`}>
              <div className="absolute inset-0 flex items-center justify-between p-8">
                {/* Left Content */}
                <div className="flex-1 space-y-4 z-10">
                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                    Promotion
                  </div>
                  <h2 className="text-3xl font-bold text-white text-balance max-w-md">
                    {slide.title}
                  </h2>
                  <p className="text-lg text-white/90 max-w-sm">
                    {slide.description}
                  </p>
                  <button className={`px-6 py-2.5 border-2 ${slide.buttonColor} rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm cursor-pointer`}>
                    {slide.buttonText}
                  </button>
                </div>

                {/* Right Image */}
                <div className="relative w-[45%] h-full">
                  <Image
                    src={slide.imageUrl || "/placeholder.svg"}
                    alt={slide.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all z-20 cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all z-20 cursor-pointer"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {promoSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              index === currentSlide
                ? 'w-8 bg-[rgb(var(--primary))]'
                : 'bg-[rgb(var(--text-muted))]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
