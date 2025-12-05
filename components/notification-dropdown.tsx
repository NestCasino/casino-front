'use client'

import { useNotifications } from '@/lib/notification-context'
import { X, Check } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function NotificationDropdown() {
  const {
    notifications,
    isOpen,
    closeNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
    loading,
    error,
    hasMore,
    loadMoreNotifications,
  } = useNotifications()
  
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeNotifications()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closeNotifications])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeNotifications()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeNotifications])

  if (!isOpen) return null

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'bonus':
        return 'from-amber-500/20 to-orange-500/20 border-orange-500/30'
      case 'win':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30'
      case 'promotion':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
      case 'achievement':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
      case 'financial':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30'
      case 'account':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
      case 'info':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
      case 'success':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30'
      case 'warning':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      case 'error':
        return 'from-red-500/20 to-rose-500/20 border-red-500/30'
      case 'system':
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/30'
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/30'
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markAsRead(notification.id)
    if (notification.link) {
      closeNotifications()
      // Navigation will be handled by Link component
    }
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[400px] bg-[#0f0420] border border-[#2d1b4e] rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2d1b4e] bg-[#1a0b33]">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-600 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              title="Mark all as read"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={closeNotifications}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 m-4 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {loading && notifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <div className="text-gray-400 text-sm">Loading notifications...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <div className="text-gray-400 text-sm">No notifications yet</div>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#2d1b4e]">
              {notifications.map((notification) => {
                const NotificationWrapper = notification.link ? Link : 'div'
                const wrapperProps = notification.link
                  ? { href: notification.link }
                  : {}

                return (
                  <NotificationWrapper
                    key={notification.id}
                    {...wrapperProps}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'block p-4 transition-colors cursor-pointer',
                      !notification.read
                        ? 'bg-[#1a0b33] hover:bg-[#241842]'
                        : 'bg-transparent hover:bg-[#1a0b33]'
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={cn(
                          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gradient-to-br border',
                          getNotificationColor(notification.type)
                        )}
                      >
                        {notification.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={cn(
                              'font-semibold text-sm truncate',
                              !notification.read ? 'text-white' : 'text-gray-300'
                            )}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </NotificationWrapper>
                )
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="p-4 border-t border-[#2d1b4e]">
                <button
                  onClick={loadMoreNotifications}
                  disabled={loading}
                  className={cn(
                    'w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                    loading
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  )}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-[#2d1b4e] bg-[#1a0b33] p-3 text-center">
          <Link
            href="/notifications"
            onClick={closeNotifications}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors cursor-pointer font-medium"
          >
            View all notifications
          </Link>
        </div>
      )}

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

