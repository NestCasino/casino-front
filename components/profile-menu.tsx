'use client'

import { useUser } from '@/lib/user-context'
import { useWallet } from '@/lib/wallet-context'
import { useAuth } from '@/lib/auth-context'
import { 
  Wallet, 
  Crown, 
  Gift, 
  Zap, 
  Settings, 
  MessageCircle, 
  LogOut,
  ChevronRight,
  Mail,
  Camera
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AvatarSelectorModal } from './avatar-selector-modal'

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'Fr',
    SEK: 'kr',
    NZD: 'NZ$',
    BTC: '₿',
    ETH: 'Ξ',
  }
  return symbols[currency] || currency + ' '
}

export function ProfileMenu() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { user, getAvatar, openAvatarModal, clearUser } = useUser()
  const { openWalletModal, activeWallet } = useWallet()
  const { logout } = useAuth()
  const router = useRouter()
  
  if (!user) return null
  
  const currentAvatar = getAvatar(user.avatarId)

  const menuItems = [
    { icon: Wallet, label: 'Wallet', action: openWalletModal },
    { icon: Crown, label: 'Vip Club', href: '/vip' },
    { icon: Gift, label: 'Bonuses', href: '/bonuses' },
    { icon: Zap, label: 'Wild Points', href: '/wild-points' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: MessageCircle, label: 'Live Support', href: '/support' },
  ]

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="relative flex items-center gap-3 p-1 rounded-full hover:ring-2 hover:ring-purple-500/50 transition-all group"
          >
            {/* Avatar Circle */}
            <div className={cn(
              "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center shadow-md overflow-hidden",
              "group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all",
              !user.avatar && currentAvatar?.bgColor
            )}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">{currentAvatar?.emoji}</span>
              )}
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="end" 
          className="w-[380px] !bg-[#1a0b33] border border-surface p-0 mt-2 shadow-2xl"
        >
          {/* User Profile Header */}
          <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-t-lg">
            <div className="flex items-start gap-4">
              {/* Avatar with Edit Button */}
              <div className="relative group/avatar">
                <div className={cn(
                  "w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg overflow-hidden",
                  !user.avatar && currentAvatar?.bgColor
                )}>
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">{currentAvatar?.emoji}</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openAvatarModal()
                  }}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  <Camera className="h-3.5 w-3.5 text-gray-700" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{user.username}</h3>
                  <span className="text-xs text-purple-200">#{user.id}</span>
                </div>
                {(user.firstName || user.lastName) && (
                  <p className="text-sm text-purple-200 mb-2">
                    {user.firstName} {user.lastName}
                  </p>
                )}
                
                {/* Email Verification Status */}
                {!user.emailVerified && (
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-xs font-medium text-orange-200 border border-orange-400/30 transition-colors">
                    <Mail className="h-3 w-3" />
                    <span>Email Not Verified</span>
                  </button>
                )}
              </div>

            {/* Balances */}
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {getCurrencySymbol(activeWallet?.currency.code || user.currency)}{((activeWallet?.balance ?? user.balance) || 0).toFixed(2)}
                </div>
                <div className="text-xs text-purple-200">{activeWallet?.currency.code || user.currency}</div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-200">Level {user.level}</span>
                <span className="text-white font-semibold">{user.levelProgress}%</span>
                <span className="text-purple-200">Level {user.level + 1}</span>
              </div>
              <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${user.levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item, index) => {
              const content = (
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-lg",
                    "hover:bg-[#2d1b4e] transition-colors cursor-pointer group"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2d1b4e] flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <item.icon className="h-4 w-4 text-[#d1d5db] group-hover:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-[#f9fafb]">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#9ca3af] group-hover:text-purple-400 transition-colors" />
                </div>
              )

              if ('action' in item && item.action) {
                return (
                  <button key={item.label} onClick={item.action} className="w-full">
                    {content}
                  </button>
                )
              }

              return (
                <Link key={item.href} href={item.href || '#'}>
                  {content}
                </Link>
              )
            })}
          </div>

          <DropdownMenuSeparator className="bg-[#2d1b4e]" />

          {/* Logout Button */}
          <div className="p-2">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
                "text-red-400 hover:bg-red-500/10 transition-colors font-medium"
              )}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <AvatarSelectorModal />

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-[#1a0b33] border-surface text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              You will be returned to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-600 text-white hover:bg-white/10 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await logout()
                clearUser()
                router.push('/')
                setShowLogoutDialog(false)
              }}
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

