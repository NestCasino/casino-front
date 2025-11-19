'use client'

import Link from 'next/link'
import { Star, Clock, Trophy, CheckSquare, Sparkles, Cherry, Video, Mic, Bomb, LayoutGrid, CircleDot, Spade, Diamond, Gift, Users, Crown, FileText, MessageCircle, Handshake, Shield, Headphones, Globe } from 'lucide-react'
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
  const { isCollapsed } = useSidebar()
  
  return (
    <aside className={cn(
      "hidden lg:block fixed left-0 top-[70px] bottom-0 bg-[#0f0420] border-r border-[#2d1b4e] overflow-y-auto transition-all duration-300",
      isCollapsed ? "w-[70px]" : "w-60"
    )}>
      <nav className="py-4">
        {/* Personal Section */}
        <SidebarItem icon={<Star className="h-5 w-5" />} label="Favourites" href="/favorites" active={pathname === '/favorites'} collapsed={isCollapsed} />
        <SidebarItem icon={<Clock className="h-5 w-5" />} label="Recent" href="/recent" active={pathname === '/recent'} collapsed={isCollapsed} />
        <SidebarItem icon={<Trophy className="h-5 w-5" />} label="Tournaments" href="/tournaments" active={pathname === '/tournaments'} collapsed={isCollapsed} />

        <SidebarDivider collapsed={isCollapsed} />

        <SidebarLabel collapsed={isCollapsed}>Games</SidebarLabel>

        {/* Games Categories */}
        <SidebarItem icon={<LayoutGrid className="h-5 w-5" />} label="All Games" href="/all-games" active={pathname === '/all-games'} collapsed={isCollapsed} />
        <SidebarItem icon={<Sparkles className="h-5 w-5" />} label="New Releases" href="/new-releases" active={pathname === '/new-releases'} collapsed={isCollapsed} />
        <SidebarItem icon={<Cherry className="h-5 w-5" />} label="Slots" href="/slots" active={pathname === '/slots'} collapsed={isCollapsed} />
        <SidebarItem icon={<Video className="h-5 w-5" />} label="Live Casino" href="/live-casino" active={pathname === '/live-casino'} collapsed={isCollapsed} />
        <SidebarItem icon={<Mic className="h-5 w-5" />} label="Game Shows" href="/game-shows" active={pathname === '/game-shows'} collapsed={isCollapsed} />
        <SidebarItem icon={<Bomb className="h-5 w-5" />} label="Burst Games" href="/burst" active={pathname === '/burst'} collapsed={isCollapsed} />
        <SidebarItem icon={<CircleDot className="h-5 w-5" />} label="Roulette" href="/roulette" active={pathname === '/roulette'} collapsed={isCollapsed} />
        <SidebarItem icon={<Spade className="h-5 w-5" />} label="Blackjack" href="/blackjack" active={pathname === '/blackjack'} collapsed={isCollapsed} />
        <SidebarItem icon={<Diamond className="h-5 w-5" />} label="Baccarat" href="/baccarat" active={pathname === '/baccarat'} collapsed={isCollapsed} />

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
