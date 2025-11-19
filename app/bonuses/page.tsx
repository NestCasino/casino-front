'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Footer } from '@/components/footer'
import { BonusDetailsModal } from '@/components/bonus-details-modal'
import { useSidebar } from '@/lib/sidebar-context'
import { useUser } from '@/lib/user-context'
import { cn } from '@/lib/utils'
import { Gift, Calendar, Crown, Sparkles, Info, ChevronDown, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function BonusesPage() {
  const { isCollapsed } = useSidebar()
  const { user } = useUser()
  const [promoCode, setPromoCode] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [selectedBonusId, setSelectedBonusId] = useState<string | null>(null)
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false)

  const handleActivatePromo = () => {
    console.log('Activating promo:', promoCode)
  }

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  const openBonusDetails = (bonusId: string) => {
    setSelectedBonusId(bonusId)
    setIsBonusModalOpen(true)
  }

  const closeBonusDetails = () => {
    setIsBonusModalOpen(false)
    setSelectedBonusId(null)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className={cn(
        "pt-[70px] min-h-screen transition-all duration-300",
        isCollapsed ? "lg:ml-[70px]" : "lg:ml-60"
      )}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-[#2d1b4e] rounded-2xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl overflow-hidden">
                    {user?.avatar ? (
                      <Image src={user.avatar} alt="User" fill className="object-cover" />
                    ) : (
                      '🎰'
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    Welcome to Bonuses
                    <Gift className="h-6 w-6 text-amber-500" />
                  </h1>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Wager for next rank:</span>
                    <span className="text-white font-semibold">$3,000.00</span>
                    <Info className="h-4 w-4 text-gray-500 cursor-pointer" />
                  </div>
                  <div className="mt-2 w-64 h-2 bg-[#1a1534] rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Total Bonus & Promo Code */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-lg px-4 py-2.5 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-gray-400">Total bonus claimed:</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">$0</span>
                    <button className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1">
                      History <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-2 bg-[#1a1534] border border-[#2d1b4e] rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    onClick={handleActivatePromo}
                    disabled={!promoCode}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    Activate
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Pack */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Gift className="h-8 w-8 text-purple-400" />
                <h2 className="text-3xl font-bold text-white">Welcome pack</h2>
              </div>
              <button className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                More info <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Deposit */}
              <div className="relative bg-gradient-to-br from-blue-900/60 to-blue-800/60 border-2 border-blue-500/50 rounded-2xl p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="text-xs text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                    1st Deposit | From $5
                    <Info 
                      className="h-3 w-3 cursor-pointer hover:text-white transition-colors" 
                      onClick={() => openBonusDetails('welcome-1')}
                    />
                  </div>
                  <div className="text-5xl font-bold text-white mb-2">150%</div>
                  <div className="text-sm text-gray-300 mb-4">Bonus</div>
                  <div className="flex items-center gap-2 mb-4 text-amber-400">
                    <span className="text-2xl">🎰</span>
                    <span className="text-sm font-semibold">+ 50 Free Spins</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 font-mono">6d 06:03:26</span>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/30">
                    Deposit
                  </button>
                </div>
              </div>

              {/* Second Deposit */}
              <div className="bg-gradient-to-br from-[#1a1534] to-[#0f0420] border border-[#2d1b4e] rounded-2xl p-6">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  2nd Deposit | From $20
                </div>
                <div className="text-5xl font-bold text-white mb-2">180%</div>
                <div className="text-sm text-gray-300 mb-4">Bonus</div>
                <div className="flex items-center gap-2 mb-4 text-amber-400">
                  <span className="text-2xl">🎰</span>
                  <span className="text-sm font-semibold">+ 75 Free Spins</span>
                </div>
                <button className="w-full py-3 bg-purple-900/50 text-purple-300 font-bold rounded-xl transition-all cursor-not-allowed">
                  Deposit
                </button>
              </div>

              {/* Third Deposit */}
              <div className="bg-gradient-to-br from-[#1a1534] to-[#0f0420] border border-[#2d1b4e] rounded-2xl p-6">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  3rd Deposit | From $100
                </div>
                <div className="text-5xl font-bold text-white mb-2">200%</div>
                <div className="text-sm text-gray-300 mb-4">Bonus</div>
                <div className="flex items-center gap-2 mb-4 text-amber-400">
                  <span className="text-2xl">🎰</span>
                  <span className="text-sm font-semibold">+ 100 Free Spins</span>
                </div>
                <button className="w-full py-3 bg-purple-900/50 text-purple-300 font-bold rounded-xl transition-all cursor-not-allowed">
                  Deposit
                </button>
              </div>
            </div>
          </section>

          {/* Bonus Calendar */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-400" />
                <h2 className="text-3xl font-bold text-white">Bonus calendar</h2>
              </div>
              <button className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                More info <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-[#2d1b4e] rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-white mb-2">Unlock Rewards & Epic Wins!</h3>
                <p className="text-gray-400">
                  Play <span className="text-white font-semibold">🎮 Games</span> and bet on{' '}
                  <span className="text-white font-semibold">⚽ Sports</span> to increase the bonus.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/30">
                  Go to Casino
                </button>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30">
                  Go to Sports
                </button>
              </div>
            </div>
          </section>

          {/* Regular Bonuses */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-white">Regular bonuses</h2>
              <span className="text-lg text-gray-400">1/6</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Free Nest Wheel */}
              <div className="bg-gradient-to-br from-purple-900/60 to-purple-800/60 border border-purple-500/50 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl">
                    🎯
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Free Nest Wheel</h3>
                    <p className="text-sm text-gray-300">Spin every 12h</p>
                  </div>
                  <Info 
                    className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer flex-shrink-0 transition-colors" 
                    onClick={() => openBonusDetails('free-wheel')}
                  />
                </div>
                <div className="flex items-center gap-2 mb-4 text-amber-400">
                  <span className="text-xl">🪙</span>
                  <span className="text-sm font-semibold">Win up to 1 BTC</span>
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/30">
                  Spin the Wheel
                </button>
              </div>

              {/* Rakeback */}
              <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center text-3xl">
                    💸
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Rakeback</h3>
                    <p className="text-sm text-gray-300">$0.00</p>
                  </div>
                  <Info 
                    className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer flex-shrink-0 transition-colors" 
                    onClick={() => openBonusDetails('rakeback')}
                  />
                </div>
                <div className="flex items-center gap-2 mb-4 text-gray-500">
                  <span className="text-xl">🚀</span>
                  <span className="text-sm font-semibold">BOOST X2 INACTIVE</span>
                </div>
                <button className="w-full py-3 bg-[#0f0420] text-gray-500 font-bold rounded-xl cursor-not-allowed">
                  Place bets to get a bonus
                </button>
              </div>

              {/* Cashback */}
              <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-3xl">
                    💰
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Cashback</h3>
                    <p className="text-sm text-gray-300">$0.00</p>
                  </div>
                  <Info 
                    className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer flex-shrink-0 transition-colors" 
                    onClick={() => openBonusDetails('cashback')}
                  />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-400 font-semibold">5%</span>
                    <span className="text-gray-400">→ 6%</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-[#0f0420] text-gray-400 font-bold rounded-xl">
                  Claim in: 1 d 16:16:05
                </button>
              </div>

              {/* Weekly Bonus */}
              <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-3xl">
                    🎰
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Weekly Bonus</h3>
                    <p className="text-sm text-gray-300">$0.00</p>
                  </div>
                  <Info 
                    className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer flex-shrink-0 transition-colors" 
                    onClick={() => openBonusDetails('weekly-bonus')}
                  />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Wager to unlock:</span>
                    <span>$0/$150</span>
                  </div>
                  <div className="w-full h-2 bg-[#0f0420] rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                  </div>
                </div>
                <button className="w-full py-3 bg-[#0f0420] text-gray-400 font-bold rounded-xl">
                  Claim in: 2 d 15:16:05
                </button>
              </div>

              {/* Weekly Sport Bonus */}
              <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-3xl">
                    ⚽
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Weekly Sport Bonus</h3>
                    <p className="text-sm text-gray-300">No bonus</p>
                  </div>
                  <Info 
                    className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer flex-shrink-0 transition-colors" 
                    onClick={() => openBonusDetails('weekly-sport')}
                  />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Wager to next bonus:</span>
                    <span className="text-green-400 font-semibold">$0/$150 💵 $3</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-[#0f0420] text-gray-400 font-bold rounded-xl">
                  Claim in: 5 d 04:16:05
                </button>
              </div>

              {/* Monthly Bonus */}
              <div className="bg-[#1a1534] border border-[#2d1b4e] rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-3xl">
                    💵
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">Monthly Bonus</h3>
                    <p className="text-sm text-gray-300">$0.00</p>
                  </div>
                  <Info 
                    className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer flex-shrink-0 transition-colors" 
                    onClick={() => openBonusDetails('monthly-bonus')}
                  />
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Play 🎮 Casino and ⚽ Sports to increase the bonus
                </p>
                <button className="w-full py-3 bg-[#0f0420] text-gray-400 font-bold rounded-xl">
                  Claim in: 11 d 15:16:05
                </button>
              </div>
            </div>
          </section>

          {/* VIP Bonuses */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-amber-500" />
                <h2 className="text-3xl font-bold text-white">VIP bonuses</h2>
              </div>
              <button className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                VIP Benefits <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 'vip-bounty',
                  icon: '👑',
                  title: 'VIP Bounty',
                  description: 'Play 🎮 Games and bet on ⚽ Sports to increase the bonus.',
                },
                {
                  id: 'welcome-vip',
                  icon: '🔥',
                  title: 'Welcome VIP',
                  description: 'Join the 🔥 VIP club to get a welcome bonus.',
                },
                {
                  id: 'personal-vip',
                  icon: '🎁',
                  title: 'Personal VIP',
                  description: 'Get Personal VIP bonuses based on your activity.',
                },
                {
                  id: 'birthday-vip',
                  icon: '🎂',
                  title: 'Birthday',
                  description: 'More fun on your Big day! Sweeten your B-day celebration with tasty BFG Bonus ready for you.',
                },
              ].map((vip, index) => (
                <div key={index} className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-2xl p-6 relative">
                  <Info 
                    className="h-5 w-5 text-gray-500 hover:text-gray-300 cursor-pointer absolute top-6 right-6 transition-colors" 
                    onClick={() => openBonusDetails(vip.id)}
                  />
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-3xl mb-4 grayscale opacity-50">
                    {vip.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{vip.title}</h3>
                  <p className="text-sm text-gray-400">{vip.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Special Bonuses */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-8 w-8 text-pink-400" />
              <h2 className="text-3xl font-bold text-white">Special bonuses</h2>
            </div>

            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-[#2d1b4e] rounded-2xl p-16 text-center">
              <div className="flex justify-center gap-8 mb-4 opacity-30">
                <div className="text-6xl">🎁</div>
                <div className="text-6xl">🎉</div>
              </div>
              <p className="text-gray-400 text-lg">No bonuses yet</p>
            </div>
          </section>

          {/* Other Bonuses */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Other bonuses</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '🪙',
                  title: 'Coindrops',
                  description: 'Get free coins in the Internal chat in one simple action.',
                  gradient: 'from-orange-500 to-amber-500',
                },
                {
                  icon: '💰',
                  title: 'Crypto Rains',
                  description: 'Send crypto to random active users in the Internal Chat.',
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: '🍀',
                  title: 'Tips',
                  description: 'Communicate in the chat to get some crypto treats.',
                  gradient: 'from-green-500 to-emerald-500',
                },
                {
                  icon: '🎭',
                  title: 'Catch Mr. Nest',
                  description: 'Catch Tricky Mr. Nest to get a bonus on your balance.',
                  gradient: 'from-purple-500 to-pink-500',
                  hasMore: true,
                },
              ].map((bonus, index) => (
                <div key={index} className="bg-[#1a1534] border border-[#2d1b4e] rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                  <div className={cn(
                    'w-14 h-14 bg-gradient-to-br rounded-xl flex items-center justify-center text-3xl mb-4',
                    bonus.gradient
                  )}>
                    {bonus.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{bonus.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{bonus.description}</p>
                  {bonus.hasMore && (
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                      More details <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">FAQ</h2>

            <div className="flex gap-2 mb-6">
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Regular Bonuses & Bonus Calendar
              </button>
              <button className="px-6 py-2.5 bg-[#1a1534] hover:bg-[#241842] text-gray-400 font-semibold rounded-lg transition-colors">
                Free Spins and Deposits Bonuses
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'q1',
                  icon: '♾️',
                  question: 'Are there limits on the amount of bonus withdrawals?',
                },
                {
                  id: 'q2',
                  icon: '📅',
                  question: 'A percentage of some bonuses is credited to the calendar upon withdrawal. What are these bonuses?',
                },
                {
                  id: 'q3',
                  icon: '🔥',
                  question: 'Do the bonuses that were distributed to the calendar expire?',
                },
                {
                  id: 'q4',
                  icon: '🎁',
                  question: 'Can regular bonuses expire?',
                },
                {
                  id: 'q5',
                  icon: '📅',
                  question: 'Where can I find bonus expiration date?',
                },
                {
                  id: 'q6',
                  icon: '🚫',
                  question: 'Are there any restrictions or prohibitions?',
                },
              ].map((faq) => (
                <div key={faq.id} className="bg-[#1a1534] border border-[#2d1b4e] rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-[#241842] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{faq.icon}</span>
                      <span className="text-white font-medium text-left">{faq.question}</span>
                    </div>
                    <ChevronDown className={cn(
                      'h-5 w-5 text-blue-400 transition-transform',
                      expandedFaq === faq.id && 'rotate-180'
                    )} />
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-5 pb-5 pt-2 text-gray-400">
                      <p>Answer content would go here. This is where detailed information about the question would be displayed.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>
        <Footer />
      </main>

      {/* Bonus Details Modal */}
      <BonusDetailsModal
        isOpen={isBonusModalOpen}
        onClose={closeBonusDetails}
        bonusId={selectedBonusId}
      />
    </div>
  )
}

