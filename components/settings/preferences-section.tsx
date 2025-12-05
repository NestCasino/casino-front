'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/user-context'
import { api, UpdateProfileData, Language } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface PreferencesSectionProps {
  user: User
  onUpdate: () => Promise<void>
}

export function PreferencesSection({ user, onUpdate }: PreferencesSectionProps) {
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
  
  
  return (
    <div className="space-y-6">
      
      
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








