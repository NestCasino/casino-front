'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface BonusDetail {
  id: string
  title: string
  description: string
  specialFeatures?: {
    title: string
    icon: string
    features: string[]
    action?: {
      label: string
      requirement?: string
    }
  }
  accrualFrequency?: string
  nextAvailable?: string
  additionalInfo?: string[]
}

interface BonusDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  bonusId: string | null
}

const bonusDetails: Record<string, BonusDetail> = {
  'free-wheel': {
    id: 'free-wheel',
    title: 'Free Nest Wheel',
    description: 'Spin the Free Wheel and get a chance to win up to 1 BTC on your balance.',
    specialFeatures: {
      title: 'With Telegram Bot:',
      icon: '✈️',
      features: [
        '- Bigger winning amounts',
        '- Increased winning amounts for all currencies',
        '- Win up to 5 BTC!'
      ],
      action: {
        label: 'Connect Nest Bot',
        requirement: '📱 Reach Rank 2+ to activate TG Wheel'
      }
    },
    accrualFrequency: 'Every 12 hours',
    nextAvailable: '00:00:00',
    additionalInfo: [
      '- Spin the Wheel from Rank 1 and get real crypto or NestTokens to participate in the Nest Battle for free.',
      '- From Rank 2 Special Nest Wheel rewards users only with real crypto.',
      '- Connect Nest Bot to access TG Wheel and get only crypto wins.'
    ]
  },
  'rakeback': {
    id: 'rakeback',
    title: 'Rakeback',
    description: 'Get back a percentage of your total bets automatically. The more you play, the more you earn!',
    specialFeatures: {
      title: 'Boost Feature:',
      icon: '🚀',
      features: [
        '- BOOST X2 multiplies your rakeback',
        '- Activate by reaching certain wager milestones',
        '- Temporary boost that lasts for a limited time'
      ]
    },
    accrualFrequency: 'Instant accrual on every bet',
    additionalInfo: [
      '- Rakeback is calculated based on the house edge of each game.',
      '- You can claim your rakeback at any time.',
      '- VIP levels increase your rakeback percentage.',
      '- All games contribute to rakeback, including slots, table games, and live casino.'
    ]
  },
  'cashback': {
    id: 'cashback',
    title: 'Cashback',
    description: 'Receive a percentage of your net losses back. Available to claim once per day.',
    accrualFrequency: 'Daily calculation at midnight UTC',
    additionalInfo: [
      '- Cashback is calculated on net losses for the day.',
      '- Minimum cashback amount: $1.00',
      '- Cashback percentage increases with your VIP level (5% → 10%).',
      '- Claim your cashback within 24 hours or it expires.',
      '- Only losing bets are counted towards cashback.'
    ]
  },
  'weekly-bonus': {
    id: 'weekly-bonus',
    title: 'Weekly Bonus',
    description: 'Wager on casino games to unlock weekly rewards. The more you wager, the bigger the bonus!',
    accrualFrequency: 'Weekly reset every Monday at 00:00 UTC',
    additionalInfo: [
      '- Complete wagering requirements to unlock your bonus.',
      '- Bonus amount depends on total wager for the week.',
      '- Multiple reward tiers available.',
      '- All casino games contribute to wagering.',
      '- Bonus can be claimed after the weekly period ends.',
      '- Unclaimed bonuses expire after 7 days.'
    ]
  },
  'weekly-sport': {
    id: 'weekly-sport',
    title: 'Weekly Sport Bonus',
    description: 'Place sports bets to earn weekly bonuses. Bet on your favorite sports and get rewarded!',
    accrualFrequency: 'Weekly reset every Monday at 00:00 UTC',
    additionalInfo: [
      '- Only settled sports bets count towards the bonus.',
      '- Minimum odds requirement: 1.50',
      '- Multiple reward tiers based on total bet amount.',
      '- Pre-match and live bets both qualify.',
      '- Bonus credited after weekly period ends.',
      '- Combine with casino wagering for extra rewards.'
    ]
  },
  'monthly-bonus': {
    id: 'monthly-bonus',
    title: 'Monthly Bonus',
    description: 'Play casino games and place sports bets throughout the month to earn a massive monthly bonus!',
    accrualFrequency: 'Monthly reset on the 1st of each month',
    additionalInfo: [
      '- Combine casino and sports betting for maximum rewards.',
      '- Progressive reward tiers unlock as you play more.',
      '- Bonus is calculated based on total monthly activity.',
      '- VIP members receive enhanced monthly bonuses.',
      '- Claim your bonus within 7 days of the month ending.',
      '- One of the most rewarding bonuses available!'
    ]
  },
  'welcome-1': {
    id: 'welcome-1',
    title: '1st Deposit Bonus - 150% + 50 FS',
    description: 'Get started with an amazing 150% bonus on your first deposit plus 50 Free Spins!',
    accrualFrequency: 'One-time offer for new players',
    additionalInfo: [
      '- Minimum deposit: $5',
      '- Maximum bonus: $500',
      '- Free Spins are awarded on popular slot games.',
      '- Wagering requirement: 35x bonus amount',
      '- Valid for 30 days after activation.',
      '- Cannot be combined with other welcome offers.'
    ]
  },
  'welcome-2': {
    id: 'welcome-2',
    title: '2nd Deposit Bonus - 180% + 75 FS',
    description: 'Continue your journey with an even bigger 180% bonus plus 75 Free Spins on your second deposit!',
    accrualFrequency: 'Available after first deposit bonus',
    additionalInfo: [
      '- Minimum deposit: $20',
      '- Maximum bonus: $1,000',
      '- Free Spins on premium slot games.',
      '- Wagering requirement: 35x bonus amount',
      '- Must be claimed within 7 days of first deposit.',
      '- Valid for 30 days after activation.'
    ]
  },
  'welcome-3': {
    id: 'welcome-3',
    title: '3rd Deposit Bonus - 200% + 100 FS',
    description: 'Complete your welcome package with a massive 200% bonus plus 100 Free Spins!',
    accrualFrequency: 'Final welcome package bonus',
    additionalInfo: [
      '- Minimum deposit: $100',
      '- Maximum bonus: $2,000',
      '- 100 Free Spins on top-rated slots.',
      '- Wagering requirement: 35x bonus amount',
      '- Must be claimed within 14 days of second deposit.',
      '- Valid for 30 days after activation.',
      '- Unlock exclusive VIP benefits with this deposit!'
    ]
  },
  'vip-bounty': {
    id: 'vip-bounty',
    title: 'VIP Bounty',
    description: 'Exclusive VIP reward program that increases your bonus based on your casino and sports betting activity.',
    accrualFrequency: 'Continuous accumulation based on activity',
    additionalInfo: [
      '- Available for VIP members only',
      '- Earn bounty points for every bet placed',
      '- Casino games contribute to bounty accumulation',
      '- Sports bets also count towards bounty rewards',
      '- Higher VIP levels unlock better bounty rates',
      '- Bounty can be claimed at any time',
      '- No expiration on accumulated bounty',
      '- Combine with other VIP benefits for maximum rewards'
    ]
  },
  'welcome-vip': {
    id: 'welcome-vip',
    title: 'Welcome VIP',
    description: 'Join the exclusive VIP club and receive a special welcome bonus to kickstart your VIP journey!',
    accrualFrequency: 'One-time bonus upon joining VIP club',
    additionalInfo: [
      '- Exclusive for new VIP members',
      '- Bonus amount based on your initial VIP tier',
      '- Instant credit upon VIP activation',
      '- Can be combined with ongoing VIP benefits',
      '- Special welcome gifts and perks included',
      '- Dedicated VIP manager assigned',
      '- Access to exclusive VIP-only games and tournaments',
      '- Priority customer support'
    ]
  },
  'personal-vip': {
    id: 'personal-vip',
    title: 'Personal VIP',
    description: 'Get personalized VIP bonuses tailored specifically to your gaming activity and preferences.',
    accrualFrequency: 'Custom schedule based on your activity',
    additionalInfo: [
      '- Bonuses customized to your play style',
      '- Based on your favorite games and bet amounts',
      '- Frequency increases with higher VIP levels',
      '- Surprise bonuses on special occasions',
      '- Personalized reload bonuses',
      '- Custom wagering requirements based on your history',
      '- Exclusive offers not available to other players',
      '- Direct communication with your VIP manager'
    ]
  },
  'birthday-vip': {
    id: 'birthday-vip',
    title: 'Birthday Bonus',
    description: 'Celebrate your special day with an exclusive birthday bonus! More fun on your Big day!',
    accrualFrequency: 'Annual bonus on your birthday',
    additionalInfo: [
      '- Special bonus credited on your birthday',
      '- Bonus amount increases with VIP level',
      '- Valid for 7 days from your birthday',
      '- No deposit required to claim',
      '- Includes free spins on birthday-themed slots',
      '- Additional surprise gifts for higher VIP tiers',
      '- Can be combined with other active bonuses',
      '- Personalized birthday message from the team'
    ]
  }
}

export function BonusDetailsModal({ isOpen, onClose, bonusId }: BonusDetailsModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !bonusId) return null

  const bonus = bonusDetails[bonusId]
  if (!bonus) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0a1929] border border-[#1e3a5f] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1e3a5f]">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Bonus Details</h2>
            <p className="text-blue-400 text-sm">{bonus.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1e3a5f] rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Description */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            {bonus.description}
          </p>

          {/* Special Features */}
          {bonus.specialFeatures && (
            <div className="mb-6 p-4 bg-[#0f2942] border border-[#1e3a5f] rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{bonus.specialFeatures.icon}</span>
                <h3 className="text-blue-400 font-semibold">{bonus.specialFeatures.title}</h3>
              </div>
              <div className="space-y-1 mb-4">
                {bonus.specialFeatures.features.map((feature, index) => (
                  <p key={index} className="text-gray-300 text-sm">
                    {feature}
                  </p>
                ))}
              </div>
              {bonus.specialFeatures.action && (
                <>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all mb-2">
                    {bonus.specialFeatures.action.label}
                  </button>
                  {bonus.specialFeatures.action.requirement && (
                    <p className="text-xs text-gray-400 text-center">
                      {bonus.specialFeatures.action.requirement}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Accrual Frequency */}
          {bonus.accrualFrequency && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Accrual frequency:</h4>
              <p className="text-gray-300">{bonus.accrualFrequency}</p>
            </div>
          )}

          {/* Next Available */}
          {bonus.nextAvailable && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2">Next spin in:</h4>
              <p className="text-gray-300 font-mono text-xl">{bonus.nextAvailable}</p>
            </div>
          )}

          {/* Additional Info */}
          {bonus.additionalInfo && bonus.additionalInfo.length > 0 && (
            <div className="space-y-2">
              {bonus.additionalInfo.map((info, index) => (
                <p key={index} className="text-gray-400 text-sm leading-relaxed">
                  {info}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#1e3a5f] p-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a1929;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e3a5f;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2a4a6f;
        }
        @keyframes slide-in-from-bottom-4 {
          from {
            transform: translateY(1rem);
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
          animation: slide-in-from-bottom-4 0.3s ease-out, fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

