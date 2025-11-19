'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { useSidebar } from '@/lib/sidebar-context'
import { useUser } from '@/lib/user-context'
import { cn } from '@/lib/utils'
import { Crown, Info, Gift, Wallet, Target } from 'lucide-react'
import { useState } from 'react'

// VIP Tier Icons
const TierIcon = ({ tier, active = false }: { tier: string; active?: boolean }) => {
  const colors = {
    'Bronze': 'from-orange-700 to-orange-500',
    'Silver': 'from-gray-400 to-gray-300',
    'Gold': 'from-yellow-500 to-yellow-400',
    'Platinum': 'from-purple-400 to-purple-300',
    'Diamond': 'from-blue-400 to-blue-300',
    'Ruby': 'from-pink-500 to-pink-400',
    'Sapphire': 'from-blue-600 to-blue-500',
  }
  
  const color = colors[tier as keyof typeof colors] || 'from-gray-500 to-gray-400'
  
  return (
    <div className={cn(
      'w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br',
      color,
      !active && 'opacity-40 grayscale'
    )}>
      <Crown className="h-6 w-6 text-white" />
    </div>
  )
}

// Level data for all 30 levels
const vipLevels = [
  // Bronze (1-2)
  { level: 1, tier: 'Bronze', bonus: '0 FS', weeklyCashback: '5%', wagerReq: '7x Wager', dailyRakeback: '1%', rakeback: '3x Wager', wager: 0 },
  { level: 2, tier: 'Bronze', bonus: '10 FS', weeklyCashback: '5%', wagerReq: '7x Wager', dailyRakeback: '1%', rakeback: '3x Wager', wager: 400 },
  
  // Silver (3-6)
  { level: 3, tier: 'Silver', bonus: '20 FS', weeklyCashback: '6%', wagerReq: '6x Wager', dailyRakeback: '1%', rakeback: '3x Wager', wager: 800 },
  { level: 4, tier: 'Silver', bonus: '30 FS', weeklyCashback: '6%', wagerReq: '6x Wager', dailyRakeback: '1%', rakeback: '3x Wager', wager: 1200 },
  { level: 5, tier: 'Silver', bonus: '50 FS', weeklyCashback: '6%', wagerReq: '6x Wager', dailyRakeback: '1%', rakeback: '3x Wager', wager: 2000 },
  { level: 6, tier: 'Silver', bonus: '60 FS', weeklyCashback: '6%', wagerReq: '6x Wager', dailyRakeback: '1%', rakeback: '3x Wager', wager: 4000 },
  
  // Gold (7-11)
  { level: 7, tier: 'Gold', bonus: '70 FS', weeklyCashback: '7%', wagerReq: '5x Wager', dailyRakeback: '2%', rakeback: '3x Wager', wager: 6000 },
  { level: 8, tier: 'Gold', bonus: '80 FS', weeklyCashback: '7%', wagerReq: '5x Wager', dailyRakeback: '2%', rakeback: '3x Wager', wager: 10000 },
  { level: 9, tier: 'Gold', bonus: '100 FS', weeklyCashback: '7%', wagerReq: '5x Wager', dailyRakeback: '2%', rakeback: '3x Wager', wager: 20000 },
  { level: 10, tier: 'Gold', bonus: '$15', weeklyCashback: '7%', wagerReq: '5x Wager', dailyRakeback: '3%', rakeback: '3x Wager', wager: 40000 },
  { level: 11, tier: 'Gold', bonus: '$30', weeklyCashback: '7%', wagerReq: '5x Wager', dailyRakeback: '3%', rakeback: '3x Wager', wager: 100000 },
  
  // Platinum (12-16)
  { level: 12, tier: 'Platinum', bonus: '$50', weeklyCashback: '8%', wagerReq: '3x Wager', dailyRakeback: '4%', rakeback: '3x Wager', wager: 200000 },
  { level: 13, tier: 'Platinum', bonus: '$100', weeklyCashback: '8%', wagerReq: '3x Wager', dailyRakeback: '4%', rakeback: '3x Wager', wager: 400000 },
  { level: 14, tier: 'Platinum', bonus: '$100', weeklyCashback: '9%', wagerReq: '3x Wager', dailyRakeback: '4%', rakeback: '3x Wager', wager: 600000 },
  { level: 15, tier: 'Platinum', bonus: '$200', weeklyCashback: '9%', wagerReq: '0x Wager', dailyRakeback: '5%', rakeback: '0x Wager', wager: 1000000 },
  { level: 16, tier: 'Platinum', bonus: '$250', weeklyCashback: '10%', wagerReq: '0x Wager', dailyRakeback: '5%', rakeback: '0x Wager', wager: 1500000 },
  
  // Diamond (17-24)
  { level: 17, tier: 'Diamond', bonus: '$300', weeklyCashback: '10%', wagerReq: '0x Wager', dailyRakeback: '5%', rakeback: '0x Wager', wager: 2000000 },
  { level: 18, tier: 'Diamond', bonus: '$400', weeklyCashback: '10%', wagerReq: '0x Wager', dailyRakeback: '5%', rakeback: '0x Wager', wager: 3000000 },
  { level: 19, tier: 'Diamond', bonus: '$500', weeklyCashback: '11%', wagerReq: '0x Wager', dailyRakeback: '6%', rakeback: '0x Wager', wager: 4000000 },
  { level: 20, tier: 'Diamond', bonus: '$1000', weeklyCashback: '12%', wagerReq: '0x Wager', dailyRakeback: '6%', rakeback: '0x Wager', wager: 6000000 },
  { level: 21, tier: 'Diamond', bonus: '$1000', weeklyCashback: '12%', wagerReq: '0x Wager', dailyRakeback: '6%', rakeback: '0x Wager', wager: 8000000 },
  { level: 22, tier: 'Diamond', bonus: '$1000', weeklyCashback: '13%', wagerReq: '0x Wager', dailyRakeback: '6%', rakeback: '0x Wager', wager: 10000000 },
  { level: 23, tier: 'Diamond', bonus: '$2500', weeklyCashback: '13%', wagerReq: '0x Wager', dailyRakeback: '6%', rakeback: '0x Wager', wager: 15000000 },
  { level: 24, tier: 'Diamond', bonus: '$2500', weeklyCashback: '14%', wagerReq: '0x Wager', dailyRakeback: '7%', rakeback: '0x Wager', wager: 20000000 },
  
  // Ruby (25-28)
  { level: 25, tier: 'Ruby', bonus: '$2500', weeklyCashback: '14%', wagerReq: '0x Wager', dailyRakeback: '7%', rakeback: '0x Wager', wager: 25000000 },
  { level: 26, tier: 'Ruby', bonus: '$2500', weeklyCashback: '15%', wagerReq: '0x Wager', dailyRakeback: '8%', rakeback: '0x Wager', wager: 30000000 },
  { level: 27, tier: 'Ruby', bonus: '$5000', weeklyCashback: '15%', wagerReq: '0x Wager', dailyRakeback: '8%', rakeback: '0x Wager', wager: 40000000 },
  { level: 28, tier: 'Ruby', bonus: '$5000', weeklyCashback: '16%', wagerReq: '0x Wager', dailyRakeback: '9%', rakeback: '0x Wager', wager: 50000000 },
  
  // Sapphire (29-30)
  { level: 29, tier: 'Sapphire', bonus: '$25000', weeklyCashback: '18%', wagerReq: '0x Wager', dailyRakeback: '9%', rakeback: '0x Wager', wager: 100000000 },
  { level: 30, tier: 'Sapphire', bonus: '$50000', weeklyCashback: '20%', wagerReq: '0x Wager', dailyRakeback: '10%', rakeback: '0x Wager', wager: 200000000 },
]

export default function VipPage() {
  const { isCollapsed } = useSidebar()
  const { user } = useUser()
  const [selectedTier, setSelectedTier] = useState<string>('Bronze')
  const [showRewardDetails, setShowRewardDetails] = useState(false)

  // User's current level (simulated)
  const currentLevel = 1
  const currentProgress = 0 // 0-100%

  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby', 'Sapphire']
  
  const rewards = [
    {
      title: 'Daily Rakeback',
      badge: 'Daily Reward',
      badgeColor: 'bg-blue-600',
      icon: '🎭',
      iconBg: 'from-blue-500 to-purple-600',
      description: 'Receive a percentage of the house edge back every day on all gameplay!',
    },
    {
      title: 'Weekly Cashback',
      badge: 'Weekly Reward',
      badgeColor: 'bg-green-600',
      icon: '💰',
      iconBg: 'from-green-600 to-teal-600',
      description: 'Receive a percentage of your losses back at the end of each week!',
    },
    {
      title: 'Monthly Bonus',
      badge: 'Monthly Reward',
      badgeColor: 'bg-red-600',
      icon: '🎰',
      iconBg: 'from-red-500 to-pink-600',
      description: 'Receive an extra reward at the end of each month, based on your activity.',
    },
    {
      title: 'Level Up Bonus',
      badge: 'Monthly Reward',
      badgeColor: 'bg-teal-600',
      icon: '🔄',
      iconBg: 'from-teal-600 to-cyan-600',
      description: 'Unlock an exclusive milestone bonus every time you level up!',
    },
    {
      title: 'Wheel of Fortune',
      badge: 'Daily Chance',
      badgeColor: 'bg-orange-600',
      icon: '🎡',
      iconBg: 'from-orange-500 to-yellow-500',
      description: 'Test your luck with the Wheel of Fortune. Instantly win cash bonuses, free spins, or the jackpot!',
    },
    {
      title: 'Wild Points',
      badge: 'Exchange',
      badgeColor: 'bg-blue-600',
      icon: '💎',
      iconBg: 'from-blue-600 to-purple-600',
      description: 'Earn Wild Points based on your activity, then redeem them for real money in the Bonus Shop.',
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className={cn(
        "pt-[70px] min-h-screen transition-all duration-300",
        isCollapsed ? "lg:ml-[70px]" : "lg:ml-60"
      )}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-900/60 via-purple-900/60 to-blue-900/60 border border-[#2d1b4e] rounded-2xl p-8 lg:p-12 mb-8 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -ml-48 -mb-48" />
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  Get Up to <span className="text-orange-500">30%</span> in Rewards +<br />
                  Up to <span className="text-cyan-400">$75K</span>
                </h1>
                <p className="text-xl text-gray-300 mb-6">
                  Turn your bets into thrilling rewards with our<br />
                  Wild Loyalty Program!
                </p>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                <div className="text-6xl lg:text-8xl font-black">
                  <span className="text-green-400">WILD</span><br />
                  <span className="text-yellow-400">UP</span>
                  <span className="text-blue-400 text-5xl lg:text-7xl">⚡</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative z-10 mt-8 bg-[#1a1534]/80 backdrop-blur-sm border border-[#2d1b4e] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-700 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Level 1</div>
                    <div className="text-orange-500 text-sm font-semibold">Bronze</div>
                  </div>
                </div>

                <div className="flex-1 mx-8">
                  <div className="text-center mb-2">
                    <span className="text-sm text-gray-400">Your progress <span className="text-white font-semibold">{currentProgress}%</span></span>
                  </div>
                  <div className="relative h-3 bg-[#0f0420] rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Level 2</div>
                    <div className="text-orange-500 text-sm font-semibold">Bronze</div>
                  </div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-700 to-orange-500 rounded-xl flex items-center justify-center opacity-40">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowRewardDetails(!showRewardDetails)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 mx-auto"
              >
                Reward details <Info className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Unlock Rewards Every Day */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Unlock Rewards Every Day
              </h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Enjoy daily, weekly, and monthly bonuses, unlock milestone perks, spin for instant prizes, 
                and collect points you can redeem anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward, index) => (
                <div 
                  key={index}
                  className="relative bg-[#1a1534] border border-[#2d1b4e] rounded-2xl p-6 hover:border-purple-500/50 transition-all group overflow-hidden"
                >
                  <div className="absolute top-4 right-4">
                    <span className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white',
                      reward.badgeColor
                    )}>
                      {reward.badge}
                    </span>
                  </div>
                  
                  <div className={cn(
                    'w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center text-4xl mb-4',
                    reward.iconBg
                  )}>
                    {reward.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{reward.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{reward.description}</p>
                  
                  <button className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="h-5 w-5 text-blue-400 hover:text-blue-300" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* VIP Rewards Breakdown */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                <span className="text-green-400">VIP</span> Rewards Breakdown
              </h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Experience an exciting adventure spanning 30 levels across 7 tiers, 
                each delivering its own distinct and rewarding journey.
              </p>
            </div>

            {/* Tier Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {tiers.map((tier) => {
                const tierColors = {
                  'Bronze': 'from-orange-700 to-orange-500',
                  'Silver': 'from-gray-400 to-gray-300',
                  'Gold': 'from-yellow-500 to-yellow-400',
                  'Platinum': 'from-purple-400 to-purple-300',
                  'Diamond': 'from-blue-400 to-blue-300',
                  'Ruby': 'from-pink-500 to-pink-400',
                  'Sapphire': 'from-blue-600 to-blue-500',
                }
                
                return (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={cn(
                      'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all',
                      selectedTier === tier
                        ? 'bg-[#2d1b4e] text-white border-2 border-purple-500'
                        : 'bg-[#1a1534] text-gray-400 border border-[#2d1b4e] hover:border-purple-500/50'
                    )}
                  >
                    <TierIcon tier={tier} active={selectedTier === tier} />
                    <span>{tier}</span>
                  </button>
                )
              })}
            </div>

            {/* Level Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {vipLevels
                .filter(level => level.tier === selectedTier)
                .map((level) => {
                  const tierColors = {
                    'Bronze': 'from-orange-700 to-orange-500',
                    'Silver': 'from-gray-400 to-gray-300',
                    'Gold': 'from-yellow-500 to-yellow-400',
                    'Platinum': 'from-purple-400 to-purple-300',
                    'Diamond': 'from-blue-400 to-blue-300',
                    'Ruby': 'from-pink-500 to-pink-400',
                    'Sapphire': 'from-blue-600 to-blue-500',
                  }
                  
                  const tierTextColors = {
                    'Bronze': 'text-orange-500',
                    'Silver': 'text-gray-300',
                    'Gold': 'text-yellow-400',
                    'Platinum': 'text-purple-300',
                    'Diamond': 'text-blue-300',
                    'Ruby': 'text-pink-400',
                    'Sapphire': 'text-blue-400',
                  }
                  
                  return (
                    <div
                      key={level.level}
                      className={cn(
                        'bg-[#1a1534] border rounded-2xl p-6 transition-all hover:scale-105',
                        level.level === currentLevel 
                          ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                          : 'border-[#2d1b4e]'
                      )}
                    >
                      {/* Level Badge */}
                      <div className="flex flex-col items-center mb-6">
                        <div className={cn(
                          'w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-3',
                          tierColors[level.tier as keyof typeof tierColors]
                        )}>
                          <span className="text-3xl font-bold text-white">{level.level}</span>
                        </div>
                        <div className="text-xl font-bold text-white">Level {level.level}</div>
                        <div className={cn(
                          'text-sm font-semibold',
                          tierTextColors[level.tier as keyof typeof tierTextColors]
                        )}>
                          {level.tier}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-[#2d1b4e] mb-6" />

                      {/* Level Up Bonus */}
                      <div className="text-center mb-6">
                        <div className={cn(
                          'text-3xl font-bold mb-1',
                          level.bonus.includes('FS') ? 'text-green-400' : 'text-cyan-400'
                        )}>
                          {level.bonus}
                        </div>
                        <div className="text-xs text-gray-400">Level Up Bonus</div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-[#2d1b4e] mb-4" />

                      {/* Stats */}
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-white">{level.weeklyCashback}</div>
                          <div className="text-xs text-gray-400 mb-1">Weekly Cashback</div>
                          <div className="text-xs text-gray-500">{level.wagerReq}</div>
                        </div>

                        <div>
                          <div className="text-2xl font-bold text-white">{level.dailyRakeback}</div>
                          <div className="text-xs text-gray-400 mb-1">Daily Rakeback</div>
                          <div className="text-xs text-gray-500">{level.rakeback}</div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-[#2d1b4e] my-4" />

                      {/* Wager */}
                      <div className="text-center">
                        <div className="text-xl font-bold text-cyan-400">
                          ${level.wager.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">Wager</div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </section>

        </div>
        <Footer />
      </main>
    </div>
  )
}

