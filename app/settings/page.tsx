'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { X, Loader2 } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useSidebar } from '@/lib/sidebar-context'
import { useUser } from '@/lib/user-context'
import { cn } from '@/lib/utils'
import { AccountSection } from '@/components/settings/account-section'
import { SecuritySection } from '@/components/settings/security-section'
import { HistorySection } from '@/components/settings/history-section'
import { VerificationSection } from '@/components/settings/verification-section'
import { PreferencesSection } from '@/components/settings/preferences-section'

export default function SettingsPage() {
  const { isCollapsed } = useSidebar()
  const { user, isLoadingUser, loadUserProfile } = useUser()
  const [activeTab, setActiveTab] = useState('account')

  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar />
      
      <main className={cn(
        "pt-[70px] min-h-screen bg-[rgb(var(--bg-base))] transition-all duration-300",
        isCollapsed ? "lg:ml-[70px]" : "lg:ml-60"
      )}>
        <div className="flex h-[calc(100vh-70px)]">
          {/* Settings Navigation Sidebar */}
          <aside className="w-64 border-r border-[rgb(var(--surface))] bg-[rgb(var(--bg-base))]">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-[rgb(var(--primary))] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.05 2.05C7.35 2 7.675 2 8 2C8.325 2 8.65 2 8.95 2.05C9.05 2.4 9.25 2.75 9.55 3.025C9.85 3.3 10.225 3.475 10.625 3.525C11.05 3.7 11.45 3.9 11.825 4.15C11.975 3.8 12.075 3.425 12.075 3.025C12.525 3.3 12.95 3.625 13.325 4C13.7 4.375 14.025 4.8 14.3 5.25C13.9 5.25 13.525 5.35 13.175 5.5C13.425 5.875 13.625 6.275 13.8 6.7C13.85 7.1 14.025 7.475 14.3 7.775C14.575 8.075 14.925 8.275 15.275 8.375C15.325 8.675 15.325 9 15.325 9.325C15.325 9.65 15.325 9.975 15.275 10.275C14.925 10.375 14.575 10.575 14.3 10.875C14.025 11.175 13.85 11.55 13.8 11.95C13.625 12.375 13.425 12.775 13.175 13.15C13.525 13.3 13.9 13.4 14.3 13.4C14.025 13.85 13.7 14.275 13.325 14.65C12.95 15.025 12.525 15.35 12.075 15.625C12.075 15.225 11.975 14.85 11.825 14.5C11.45 14.75 11.05 14.95 10.625 15.125C10.225 15.175 9.85 15.35 9.55 15.625C9.25 15.9 9.05 16.25 8.95 16.6C8.65 16.65 8.325 16.65 8 16.65C7.675 16.65 7.35 16.65 7.05 16.6C6.95 16.25 6.75 15.9 6.45 15.625C6.15 15.35 5.775 15.175 5.375 15.125C4.95 14.95 4.55 14.75 4.175 14.5C4.025 14.85 3.925 15.225 3.925 15.625C3.475 15.35 3.05 15.025 2.675 14.65C2.3 14.275 1.975 13.85 1.7 13.4C2.1 13.4 2.475 13.3 2.825 13.15C2.575 12.775 2.375 12.375 2.2 11.95C2.15 11.55 1.975 11.175 1.7 10.875C1.425 10.575 1.075 10.375 0.725 10.275C0.675 9.975 0.675 9.65 0.675 9.325C0.675 9 0.675 8.675 0.725 8.375C1.075 8.275 1.425 8.075 1.7 7.775C1.975 7.475 2.15 7.1 2.2 6.7C2.375 6.275 2.575 5.875 2.825 5.5C2.475 5.35 2.1 5.25 1.7 5.25C1.975 4.8 2.3 4.375 2.675 4C3.05 3.625 3.475 3.3 3.925 3.025C3.925 3.425 4.025 3.8 4.175 4.15C4.55 3.9 4.95 3.7 5.375 3.525C5.775 3.475 6.15 3.3 6.45 3.025C6.75 2.75 6.95 2.4 7.05 2.05Z" fill="white"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))]">Settings</h1>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all",
                    activeTab === 'account'
                      ? 'bg-[#2a1b47] text-[rgb(var(--text-primary))] border-l-4 border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[#2a1b47] hover:text-[rgb(var(--text-primary))]'
                  )}
                >
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all",
                    activeTab === 'security'
                      ? 'bg-[#2a1b47] text-[rgb(var(--text-primary))] border-l-4 border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[#2a1b47] hover:text-[rgb(var(--text-primary))]'
                  )}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all",
                    activeTab === 'history'
                      ? 'bg-[#2a1b47] text-[rgb(var(--text-primary))] border-l-4 border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[#2a1b47] hover:text-[rgb(var(--text-primary))]'
                  )}
                >
                  History
                </button>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all",
                    activeTab === 'verification'
                      ? 'bg-[#2a1b47] text-[rgb(var(--text-primary))] border-l-4 border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[#2a1b47] hover:text-[rgb(var(--text-primary))]'
                  )}
                >
                  Verification
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={cn(
                    "w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all",
                    activeTab === 'preferences'
                      ? 'bg-[#2a1b47] text-[rgb(var(--text-primary))] border-l-4 border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[#2a1b47] hover:text-[rgb(var(--text-primary))]'
                  )}
                >
                  Preferences
                </button>
              </nav>
            </div>
          </aside>

          {/* Settings Content Panel */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 max-w-5xl mx-auto">
              {/* Close Button */}
              <div className="flex justify-end mb-6">
                <Link
                  href="/"
                  className="p-2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] hover:bg-[#2a1b47] rounded-lg transition-all"
                >
                  <X className="h-6 w-6" />
                </Link>
              </div>

              {isLoadingUser ? (
                <div className="flex items-center justify-center py-24">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[rgb(var(--primary))] mx-auto mb-4" />
                    <p className="text-sm text-[rgb(var(--text-muted))]">Loading settings...</p>
                  </div>
                </div>
              ) : !user ? (
                <div className="flex items-center justify-center py-24">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-2">
                      Please log in to access settings
                    </p>
                    <Link
                      href="/"
                      className="text-sm text-[rgb(var(--primary))] hover:underline"
                    >
                      Go to homepage
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Account Tab */}
                  {activeTab === 'account' && (
                    <AccountSection user={user} onUpdate={loadUserProfile} />
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <SecuritySection user={user} onUpdate={loadUserProfile} />
                  )}

                  {/* History Tab */}
                  {activeTab === 'history' && (
                    <HistorySection user={user} />
                  )}

                  {/* Verification Tab */}
                  {activeTab === 'verification' && (
                    <VerificationSection user={user} onUpdate={loadUserProfile} />
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 'preferences' && (
                    <PreferencesSection user={user} onUpdate={loadUserProfile} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
