'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Star, Clock, Trophy, CheckSquare, Sparkles, Gamepad2, Flame, Badge, Video, Mic, Bomb, TrendingUp, Gift, Users, Crown, FileText, MessageCircle, Handshake, Shield, Headphones, Globe, Dice5, Dribbble } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/lib/sidebar-context'

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href?: string
  active?: boolean
  badge?: string
  collapsed?: boolean
}

function SidebarItem({ icon, label, href = '#', active, badge, collapsed }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 h-11 text-sm text-gray-400 hover:bg-[#1a0b33] hover:text-white transition-all duration-200 relative group cursor-pointer",
        collapsed ? "px-3 justify-center" : "px-4",
        active && "bg-[#1a0b33] text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#8b5cf6]"
      )}
      title={collapsed ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && (
        <>
          <span className="truncate">{label}</span>
          {badge && (
            <span className="ml-auto text-xs bg-[#8b5cf6] text-white px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#1a0b33] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
          {label}
        </div>
      )}
    </Link>
  )
}

function SidebarDivider({ collapsed }: { collapsed?: boolean }) {
  return <div className={cn("h-px bg-[#2d1b4e] my-4", collapsed ? "mx-2" : "mx-4")} />
}

function SidebarLabel({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) return null
  return (
    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<'casino' | 'sports'>('casino')
  const { isCollapsed } = useSidebar()
  
  return (
    <aside className={cn(
      "hidden lg:block fixed left-0 top-[70px] bottom-0 bg-[#0f0420] border-r border-[#2d1b4e] overflow-y-auto transition-all duration-300",
      isCollapsed ? "w-[70px]" : "w-60"
    )}>
      <nav className="py-4">
        <div className={cn("mb-6", isCollapsed ? "px-2 space-y-2" : "px-4")}>
          {isCollapsed ? (
            // Icon-only mode for collapsed sidebar
            <>
              <button
                onClick={() => setActiveTab('casino')}
                className={cn(
                  "w-full h-11 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center",
                  activeTab === 'casino' 
                    ? "bg-[#ef4444] text-white shadow-lg shadow-red-500/30" 
                    : "bg-[#1a0b33] text-gray-400 hover:bg-[#2d1b4e] hover:text-white"
                )}
                title="Casino"
              >
                <Dice5 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveTab('sports')}
                className={cn(
                  "w-full h-11 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center",
                  activeTab === 'sports' 
                    ? "bg-[#ef4444] text-white shadow-lg shadow-red-500/30" 
                    : "bg-[#1a0b33] text-gray-400 hover:bg-[#2d1b4e] hover:text-white"
                )}
                title="Sports"
              >
                <Dribbble className="h-5 w-5" />
              </button>
            </>
          ) : (
            // Full text mode for expanded sidebar
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('casino')}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer",
                  activeTab === 'casino' 
                    ? "bg-[#ef4444] text-white shadow-lg shadow-red-500/30" 
                    : "bg-[#1a0b33] text-gray-400 hover:bg-[#2d1b4e] hover:text-white"
                )}
              >
                Casino
              </button>
              <button
                onClick={() => setActiveTab('sports')}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer",
                  activeTab === 'sports' 
                    ? "bg-[#ef4444] text-white shadow-lg shadow-red-500/30" 
                    : "bg-[#1a0b33] text-gray-400 hover:bg-[#2d1b4e] hover:text-white"
                )}
              >
                Sports
              </button>
            </div>
          )}
        </div>

        {/* Personal Section */}
        <SidebarItem icon={<Star className="h-5 w-5" />} label="Favourites" href="/" active={pathname === '/favourites'} collapsed={isCollapsed} />
        <SidebarItem icon={<Clock className="h-5 w-5" />} label="Recent" href="/recent" active={pathname === '/recent'} collapsed={isCollapsed} />
        <SidebarItem icon={<Trophy className="h-5 w-5" />} label="Challenges" href="/challenges" active={pathname === '/challenges'} collapsed={isCollapsed} />
        <SidebarItem icon={<CheckSquare className="h-5 w-5" />} label="My Bets" href="/my-bets" active={pathname === '/my-bets'} collapsed={isCollapsed} />

        <SidebarDivider collapsed={isCollapsed} />

        <SidebarLabel collapsed={isCollapsed}>Games</SidebarLabel>

        {/* Games Categories */}
        <SidebarItem icon={<Sparkles className="h-5 w-5" />} label="New Releases" href="/new-releases" active={pathname === '/new-releases'} collapsed={isCollapsed} />
        <SidebarItem icon={<Gamepad2 className="h-5 w-5" />} label="Slots" href="/slots" active={pathname === '/slots'} collapsed={isCollapsed} />
        <SidebarItem icon={<Flame className="h-5 w-5" />} label="Stake Originals" href="/originals" active={pathname === '/originals'} collapsed={isCollapsed} />
        <SidebarItem icon={<Badge className="h-5 w-5" />} label="Only on Stake" href="/exclusive" active={pathname === '/exclusive'} collapsed={isCollapsed} />
        <SidebarItem icon={<Video className="h-5 w-5" />} label="Live Casino" href="/live-casino" active={pathname === '/live-casino'} collapsed={isCollapsed} />
        <SidebarItem icon={<Mic className="h-5 w-5" />} label="Game Shows" href="/game-shows" active={pathname === '/game-shows'} collapsed={isCollapsed} />
        <SidebarItem icon={<Bomb className="h-5 w-5" />} label="Burst Games" href="/burst" active={pathname === '/burst'} collapsed={isCollapsed} />
        <SidebarItem icon={<TrendingUp className="h-5 w-5" />} label="Enhanced RTP" href="/enhanced-rtp" active={pathname === '/enhanced-rtp'} collapsed={isCollapsed} />

        <SidebarDivider collapsed={isCollapsed} />

        {/* Utility Links */}
        <SidebarItem icon={<Gift className="h-5 w-5" />} label="Promotions" href="/promotions" active={pathname === '/promotions'} collapsed={isCollapsed} />
        <SidebarItem icon={<Users className="h-5 w-5" />} label="Affiliate" href="/affiliate" active={pathname === '/affiliate'} collapsed={isCollapsed} />
        <SidebarItem icon={<Crown className="h-5 w-5" />} label="VIP Club" href="/vip" active={pathname === '/vip'} collapsed={isCollapsed} />
        <SidebarItem icon={<FileText className="h-5 w-5" />} label="Blog" href="/blog" active={pathname === '/blog'} collapsed={isCollapsed} />
        <SidebarItem icon={<MessageCircle className="h-5 w-5" />} label="Forum" href="/forum" active={pathname === '/forum'} collapsed={isCollapsed} />

        <SidebarDivider collapsed={isCollapsed} />

        {/* Support & Settings */}
        <SidebarItem icon={<Handshake className="h-5 w-5" />} label="Sponsorships" href="/sponsorships" active={pathname === '/sponsorships'} collapsed={isCollapsed} />
        <SidebarItem icon={<Shield className="h-5 w-5" />} label="Responsible Gambling" href="/responsible" active={pathname === '/responsible'} collapsed={isCollapsed} />
        <SidebarItem icon={<Headphones className="h-5 w-5" />} label="Live Support" href="/support" active={pathname === '/support'} collapsed={isCollapsed} />
        <SidebarItem icon={<Globe className="h-5 w-5" />} label="Language: English" href="/language" active={pathname === '/language'} collapsed={isCollapsed} />
      </nav>
    </aside>
  )
}
