'use client'

import { useBonuses } from '@/lib/bonus-context'
import { X, Gift } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function BonusesDropdown() {
  const { bonuses, isOpen, closeBonuses, availableCount } = useBonuses()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [promoCode, setPromoCode] = useState('')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeBonuses()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeBonuses])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeBonuses()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeBonuses])

  if (!isOpen) return null

  const handleActivatePromo = () => {
    console.log('Activating promo code:', promoCode)
    // Add promo code activation logic here
  }

  const handleBonusAction = (bonusId: string, actionType?: string) => {
    console.log('Bonus action:', bonusId, actionType)
    // Add bonus action logic here
  }

  // Countdown timer component
  const CountdownTimer = ({ endTime }: { endTime: Date }) => {
    const [timeLeft, setTimeLeft] = useState('')

    useEffect(() => {
      const updateTimer = () => {
        const now = new Date().getTime()
        const distance = endTime.getTime() - now

        if (distance < 0) {
          setTimeLeft('00:00:00')
          return
        }

        const hours = Math.floor(distance / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        )
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }, [endTime])

    return (
      <div className="px-4 py-2 bg-[#1a1534] rounded-lg text-gray-400 text-sm font-mono">
        {timeLeft}
      </div>
    )
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[420px] bg-[#0f0420] border border-[#2d1b4e] rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2d1b4e] bg-[#1a0b33]">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Available Bonuses</h3>
          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
            {availableCount}/{bonuses.length}
          </span>
        </div>
        <button
          onClick={closeBonuses}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Bonuses List */}
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-3">
          {/* Promo Code Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-[#1a1534] border border-[#2d1b4e] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <button
              onClick={handleActivatePromo}
              disabled={!promoCode}
              className="px-5 py-2.5 bg-[#2d1b4e] hover:bg-[#3d2b5e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Activate
            </button>
          </div>

          {/* Bonus Cards */}
          {bonuses.map((bonus) => (
            <div
              key={bonus.id}
              className={cn(
                'p-4 rounded-xl border transition-all',
                bonus.status === 'available'
                  ? 'bg-gradient-to-r from-[#1a1534] to-[#1a0b33] border-[#2d1b4e] hover:border-purple-500'
                  : 'bg-[#1a1534] border-[#2d1b4e]'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-2xl">
                  {bonus.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm mb-1 truncate">
                    {bonus.title}
                  </h4>
                  {bonus.description && (
                    <p className="text-xs text-gray-400 mb-2">{bonus.description}</p>
                  )}
                  
                  {/* Progress Bar */}
                  {bonus.progress && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          ${bonus.progress.current.toFixed(2)} / ${bonus.progress.max.toFixed(2)}
                        </span>
                        {bonus.reward && (
                          <span className="text-green-400 font-semibold">{bonus.reward} 💵</span>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-[#2d1b4e] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                          style={{
                            width: `${(bonus.progress.current / bonus.progress.max) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button or Status */}
                <div className="flex-shrink-0">
                  {bonus.actionLabel && bonus.actionType && (
                    <button
                      onClick={() => handleBonusAction(bonus.id, bonus.actionType)}
                      className={cn(
                        'px-5 py-2.5 rounded-lg font-semibold text-sm transition-all cursor-pointer',
                        bonus.actionType === 'deposit'
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md shadow-red-500/30'
                          : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md shadow-red-500/30'
                      )}
                    >
                      {bonus.actionLabel}
                    </button>
                  )}
                  {bonus.countdown && <CountdownTimer endTime={bonus.countdown} />}
                  {bonus.status === 'locked' && (
                    <div className="px-4 py-2 bg-[#1a1534] rounded-lg text-gray-500 text-xs whitespace-nowrap">
                      No rewards...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#2d1b4e] bg-[#1a0b33] p-4">
        <Link href="/bonuses" onClick={closeBonuses}>
          <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/30">
            View all bonuses
          </button>
        </Link>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a0b33;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2d1b4e;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3d2b5e;
        }
        @keyframes slide-in-from-top-2 {
          from {
            transform: translateY(-0.5rem);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-in {
          animation: slide-in-from-top-2 0.2s ease-out, fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

