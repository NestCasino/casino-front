'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { X, Trash2, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useSidebar } from '@/lib/sidebar-context'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { isCollapsed } = useSidebar()
  const [activeTab, setActiveTab] = useState('account')
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')

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
          <aside className="w-60 border-r border-[rgb(var(--surface))] bg-[rgb(var(--bg-base))]">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 rounded bg-[rgb(var(--primary))]" />
                <h1 className="text-2xl font-semibold text-[rgb(var(--text-primary))]">Settings</h1>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full text-left px-6 py-3 text-sm transition-all ${
                    activeTab === 'account'
                      ? 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-primary))] border-l-[3px] border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text-primary))]'
                  }`}
                >
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-6 py-3 text-sm transition-all ${
                    activeTab === 'security'
                      ? 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-primary))] border-l-[3px] border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text-primary))]'
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full text-left px-6 py-3 text-sm transition-all ${
                    activeTab === 'preferences'
                      ? 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-primary))] border-l-[3px] border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text-primary))]'
                  }`}
                >
                  Preferences
                </button>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`w-full text-left px-6 py-3 text-sm transition-all ${
                    activeTab === 'api'
                      ? 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-primary))] border-l-[3px] border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text-primary))]'
                  }`}
                >
                  API
                </button>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`w-full text-left px-6 py-3 text-sm transition-all ${
                    activeTab === 'verification'
                      ? 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-primary))] border-l-[3px] border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text-primary))]'
                  }`}
                >
                  Verification
                </button>
                <button
                  onClick={() => setActiveTab('offers')}
                  className={`w-full text-left px-6 py-3 text-sm transition-all ${
                    activeTab === 'offers'
                      ? 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-primary))] border-l-[3px] border-[rgb(var(--primary))]'
                      : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-elevated))] hover:text-[rgb(var(--text-primary))]'
                  }`}
                >
                  Offers
                </button>
              </nav>
            </div>
          </aside>

          {/* Settings Content Panel */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-12 max-w-4xl">
              {/* Close Button */}
              <div className="flex justify-end mb-6">
                <Link
                  href="/"
                  className="p-2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))] transition-colors"
                >
                  <X className="h-6 w-6" />
                </Link>
              </div>

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  {/* Email Section */}
                  <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Email</h2>
                      <div className="px-3 py-1 bg-[rgb(var(--success))] text-white text-xs font-bold rounded-xl">
                        Verified
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          value="lasha.katamadze666@gmail.com"
                          readOnly
                          className="w-full h-12 px-4 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] cursor-not-allowed"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--error))] hover:brightness-110 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <button className="px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all">
                      Confirm Email
                    </button>
                  </div>

                  {/* Phone Number Section */}
                  <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-6">
                    <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Phone Number</h2>

                    <p className="text-[13px] text-[rgb(var(--text-muted))]">
                      We only service areas that are listed in the available country code list.
                    </p>

                    <div>
                      <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">
                        Country Code <span className="text-[rgb(var(--error))]">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-full h-12 px-4 pr-10 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] appearance-none cursor-pointer focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                        >
                          <option value="+1">+1 Virgin Islands (U.S.), Canada, United States of America</option>
                          <option value="+44">+44 United Kingdom</option>
                          <option value="+49">+49 Germany</option>
                          <option value="+33">+33 France</option>
                          <option value="+7">+7 Russia</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[rgb(var(--text-muted))] pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">
                        Phone Number <span className="text-[rgb(var(--error))]">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full h-12 px-4 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                      />
                    </div>

                    <button
                      disabled={!phoneNumber}
                      className="px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:bg-[rgb(var(--text-disabled))] disabled:cursor-not-allowed"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-6">
                    <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Password</h2>
                    <div>
                      <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">Current Password</label>
                      <input
                        type="password"
                        className="w-full h-12 px-4 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full h-12 px-4 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))]"
                      />
                    </div>
                    <button className="px-6 py-3 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-xl transition-all">
                      Update Password
                    </button>
                  </div>

                  <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-4">
                    <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Two-Factor Authentication</h2>
                    <p className="text-sm text-[rgb(var(--text-muted))]">Add an extra layer of security to your account</p>
                    <button className="px-6 py-3 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-xl transition-all">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-6">
                    <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Preferences</h2>
                    
                    <div>
                      <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">Language</label>
                      <select className="w-full h-12 px-4 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] cursor-pointer">
                        <option>English</option>
                        <option>Russian</option>
                        <option>Spanish</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">Currency</label>
                      <select className="w-full h-12 px-4 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] cursor-pointer">
                        <option>RUB - Russian Ruble</option>
                        <option>USD - US Dollar</option>
                        <option>EUR - Euro</option>
                        <option>BTC - Bitcoin</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-[rgb(var(--text-primary))]">Email Notifications</p>
                        <p className="text-xs text-[rgb(var(--text-muted))]">Receive updates via email</p>
                      </div>
                      <button className="w-12 h-6 bg-[rgb(var(--primary))] rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs with placeholder content */}
              {activeTab === 'api' && (
                <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8">
                  <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-4">API Settings</h2>
                  <p className="text-sm text-[rgb(var(--text-muted))]">API key management and documentation</p>
                </div>
              )}

              {activeTab === 'verification' && (
                <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8">
                  <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-4">KYC Verification</h2>
                  <p className="text-sm text-[rgb(var(--text-muted))]">Upload documents for account verification</p>
                </div>
              )}

              {activeTab === 'offers' && (
                <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8">
                  <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-4">Marketing Preferences</h2>
                  <p className="text-sm text-[rgb(var(--text-muted))]">Manage promotional communications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
