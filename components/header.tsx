'use client'

import Link from 'next/link'
import { Search, Bell, Settings, Menu, Gift, PanelLeftClose, PanelLeft, Dice5, Dribbble } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/lib/sidebar-context'
import { useSearch } from '@/lib/search-context'
import { useWallet } from '@/lib/wallet-context'
import { useNotifications } from '@/lib/notification-context'
import { useBonuses } from '@/lib/bonus-context'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { WalletSelector } from './wallet-selector'
import { ProfileMenu } from './profile-menu'
import { NotificationDropdown } from './notification-dropdown'
import { BonusesDropdown } from './bonuses-dropdown'

export function Header() {
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { openSearch } = useSearch()
  const { openWalletModal } = useWallet()
  const { openNotifications, unreadCount } = useNotifications()
  const { openBonuses } = useBonuses()
  const [activeTab, setActiveTab] = useState<'casino' | 'sports'>('casino')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-[rgb(var(--bg-base))]/95 backdrop-blur-md border-b border-[rgb(var(--surface))]">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 hover:bg-[rgb(var(--surface))] rounded-lg transition-colors cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeft className="h-6 w-6 text-[rgb(var(--text-secondary))]" />
            ) : (
              <PanelLeftClose className="h-6 w-6 text-[rgb(var(--text-secondary))]" />
            )}
          </button>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold italic bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Nest
            </span>
          </Link>
          
          {/* Casino/Sports Tabs */}
          <div className="hidden md:flex gap-2 ml-2">
            <button
              onClick={() => setActiveTab('casino')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer",
                activeTab === 'casino' 
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/30" 
                  : "bg-[#1a1534] text-gray-400 hover:bg-[#241d42] hover:text-gray-300"
              )}
            >
              <Dice5 className="h-4 w-4" />
              <span>Casino</span>
            </button>
            <button
              onClick={() => setActiveTab('sports')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer",
                activeTab === 'sports' 
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/30" 
                  : "bg-[#1a1534] text-gray-400 hover:bg-[#241d42] hover:text-gray-300"
              )}
            >
              <Dribbble className="h-4 w-4" />
              <span>Sports</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center flex-1">
          <WalletSelector />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Bonuses Button with Dropdown */}
          <div className="relative">
            <Button 
              onClick={openBonuses}
              className="hidden sm:flex bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-orange-500/30"
            >
              <Gift className="h-4 w-4 mr-2" />
              Bonuses
            </Button>
            <BonusesDropdown />
          </div>

          {/* Icon Cluster */}
          <button 
            onClick={openSearch}
            className="p-2 hover:bg-[rgb(var(--surface))] rounded-lg transition-colors cursor-pointer"
          >
            <Search className="h-5 w-5 text-[rgb(var(--text-secondary))]" />
          </button>
          
          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button 
              onClick={openNotifications}
              className="p-2 hover:bg-[rgb(var(--surface))] rounded-lg transition-colors relative cursor-pointer"
            >
              <Bell className="h-5 w-5 text-[rgb(var(--text-secondary))]" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 h-2 w-2 bg-[rgb(var(--error))] rounded-full animate-pulse"></span>
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </>
              )}
            </button>
            <NotificationDropdown />
          </div>
          
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
