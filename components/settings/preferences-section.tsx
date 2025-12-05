'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/user-context'
import { api, UpdateProfileData, Language } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface PreferencesSectionProps {
  user: User
  onUpdate: () => Promise<void>
}

export function PreferencesSection({ user, onUpdate }: PreferencesSectionProps) {
  // Privacy settings (mock)
  const [hideUsername, setHideUsername] = useState(false)
  const [hideStatistics, setHideStatistics] = useState(false)
  const [hideActivity, setHideActivity] = useState(false)
  const [hideProfileData, setHideProfileData] = useState(false)
  
  // Notification settings (mock)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  
  // Responsible gambling settings (mock)
  const [selfExclusion, setSelfExclusion] = useState('none')
  const [depositLimit, setDepositLimit] = useState('')
  const [timeLimit, setTimeLimit] = useState('')
  const [lossLimit, setLossLimit] = useState('')
  const [betLimit, setBetLimit] = useState('')
  
  // Language settings (backend connected)
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true)
  const [isLanguageSubmitting, setIsLanguageSubmitting] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('')
  
  // Load user language
  useEffect(() => {
    if (user?.lang) {
      setSelectedLanguage(user.lang)
    }
  }, [user])
  
  // Load languages
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await api.languages.getActive()
        if (response.success && response.data) {
          setLanguages(response.data)
        }
      } catch (error) {
        console.error('Failed to load languages:', error)
      } finally {
        setIsLoadingLanguages(false)
      }
    }
    loadLanguages()
  }, [])
  
  // Language update handler
  const handleLanguageChange = async (newLanguage: string) => {
    if (!newLanguage) return
    
    setSelectedLanguage(newLanguage)
    setIsLanguageSubmitting(true)
    try {
      const response = await api.players.updateProfile({ lang: newLanguage })
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Language preference updated successfully',
        })
        await onUpdate()
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to update language preference',
          variant: 'destructive',
        })
        if (user?.lang) setSelectedLanguage(user.lang)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update language preference',
        variant: 'destructive',
      })
      if (user?.lang) setSelectedLanguage(user.lang)
    } finally {
      setIsLanguageSubmitting(false)
    }
  }
  
  // Mock handlers
  const handlePrivacySave = () => {
    toast({
      title: 'Demo Feature',
      description: 'Privacy settings saved. This is demo data only.',
      duration: 3000,
    })
  }
  
  const handleNotificationsSave = () => {
    toast({
      title: 'Demo Feature',
      description: 'Notification preferences saved. This is demo data only.',
      duration: 3000,
    })
  }
  
  const handleResponsibleGamblingSave = () => {
    toast({
      title: 'Demo Feature',
      description: 'Responsible gambling limits saved. This is demo data only.',
      duration: 3000,
    })
  }
  
  return (
    <div className="space-y-6">
      {/* Privacy Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">Privacy</h2>
        <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
          User privacy is one of the core values of Stake. These settings allow you to be completely anonymous from the rest of the players.
        </p>
        
        <div className="space-y-4 mb-6">
          {/* Enable Ghost Mode / Hide Username */}
          <div className="flex items-center justify-between p-4 bg-[#3d2b5e] rounded-xl">
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">Enable Ghost Mode</p>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                Your username will not appear in public bet feed and bet preview
              </p>
            </div>
            <Switch
              checked={hideUsername}
              onCheckedChange={setHideUsername}
            />
          </div>
          
          {/* Hide All Your Statistics */}
          <div className="flex items-center justify-between p-4 bg-[#3d2b5e] rounded-xl">
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">Hide All Your Statistics</p>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                Other users won't be able to view your wins, losses and wagered statistics
              </p>
            </div>
            <Switch
              checked={hideStatistics}
              onCheckedChange={setHideStatistics}
            />
          </div>
          
          {/* Hide All Your Race Statistics */}
          <div className="flex items-center justify-between p-4 bg-[#3d2b5e] rounded-xl">
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">Hide All Your Race Statistics</p>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                Other users won't be able to view your race statistics
              </p>
            </div>
            <Switch
              checked={hideActivity}
              onCheckedChange={setHideActivity}
            />
          </div>
          
          {/* Hide Profile Data */}
          <div className="flex items-center justify-between p-4 bg-[#3d2b5e] rounded-xl">
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">Hide Profile Data</p>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                Your profile information will be hidden from other users
              </p>
            </div>
            <Switch
              checked={hideProfileData}
              onCheckedChange={setHideProfileData}
            />
          </div>
        </div>
        
        <p className="text-sm text-[rgb(var(--text-muted))] mb-4">
          Please allow up to 30 seconds for update to take effect.
        </p>
        
        <button
          onClick={handlePrivacySave}
          className="px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all"
        >
          Save
        </button>
      </div>
      
      {/* Notifications Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">Notifications</h2>
        <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
          Manage how you receive notifications and updates from us.
        </p>
        
        <div className="space-y-4 mb-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-[#3d2b5e] rounded-xl">
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">Email Notifications</p>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                Receive updates and promotional offers via email
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-4 bg-[#3d2b5e] rounded-xl">
            <div>
              <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">SMS Notifications</p>
              <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                Receive important alerts via SMS
              </p>
            </div>
            <Switch
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
        </div>
        
        <button
          onClick={handleNotificationsSave}
          className="px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all"
        >
          Save
        </button>
      </div>
      
      {/* Responsible Gambling Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">Responsible Gambling</h2>
        <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
          Set limits to help you manage your gambling activity responsibly.
        </p>
        
        <div className="space-y-6 mb-6">
          {/* Self-Exclusion */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Self-Exclusion Period
            </label>
            <select
              value={selfExclusion}
              onChange={(e) => setSelfExclusion(e.target.value)}
              className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
            >
              <option value="none">None</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
              <option value="180d">6 Months</option>
              <option value="365d">1 Year</option>
              <option value="permanent">Permanent</option>
            </select>
            <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
              Temporarily suspend your account for the selected period
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deposit Limits */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Deposit Limits ({user.currency})
              </label>
              <input
                type="number"
                value={depositLimit}
                onChange={(e) => setDepositLimit(e.target.value)}
                placeholder="Enter daily deposit limit"
                className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                Maximum daily deposit amount
              </p>
            </div>
            
            {/* Time Limits */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Time Limits (hours/day)
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="Enter daily time limit"
                className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                Maximum hours per day
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loss Limits */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Loss Limits ({user.currency})
              </label>
              <input
                type="number"
                value={lossLimit}
                onChange={(e) => setLossLimit(e.target.value)}
                placeholder="Enter daily loss limit"
                className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                Maximum daily loss amount
              </p>
            </div>
            
            {/* Bet Limits */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Bet Limits ({user.currency})
              </label>
              <input
                type="number"
                value={betLimit}
                onChange={(e) => setBetLimit(e.target.value)}
                placeholder="Enter maximum bet"
                className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                Maximum single bet amount
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleResponsibleGamblingSave}
          className="px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all"
        >
          Save Limits
        </button>
      </div>
      
      {/* Language & Currency Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">Language & Currency</h2>
        
        <div className="space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={isLoadingLanguages || isLanguageSubmitting}
              className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingLanguages ? (
                <option value="">Loading languages...</option>
              ) : (
                languages.map((language) => (
                  <option key={language.id} value={language.iso}>
                    {language.name}
                  </option>
                ))
              )}
            </select>
            {isLanguageSubmitting && (
              <p className="text-xs text-[rgb(var(--text-muted))] mt-2 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Updating language...
              </p>
            )}
          </div>
          
          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Currency</label>
            <input
              type="text"
              value={user.currency}
              readOnly
              className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] cursor-not-allowed"
            />
            <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
              Currency is set during registration and cannot be changed
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}








