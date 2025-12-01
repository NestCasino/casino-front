'use client'

import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { X, Trash2, ChevronDown, Upload, Eye, EyeOff, FileText, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSidebar } from '@/lib/sidebar-context'
import { useUser } from '@/lib/user-context'
import { api, UpdateProfileData } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { isCollapsed } = useSidebar()
  const { user, isLoadingUser, loadUserProfile } = useUser()
  const [activeTab, setActiveTab] = useState('account')
  
  // Account tab state
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isPhoneSubmitting, setIsPhoneSubmitting] = useState(false)
  
  // Security tab state
  const [passwordData, setPasswordData] = useState({
    password: '',
    new_password: '',
    repeat_password: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    repeat: false,
  })
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  
  // KYC tab state
  const [kycFiles, setKycFiles] = useState<{
    kyc_front?: File
    kyc_back?: File
    kyc_selfie?: File
    kyc_address?: File
  }>({})
  const [isKycSubmitting, setIsKycSubmitting] = useState(false)
  
  // Load user phone number when user data is available
  useEffect(() => {
    if (user?.phone) {
      setPhoneNumber(user.phone)
    }
  }, [user])
  
  // Phone number update handler
  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Phone number is required',
        variant: 'destructive',
      })
      return
    }
    
    setIsPhoneSubmitting(true)
    try {
      const updateData: UpdateProfileData = {
        phone: phoneNumber,
      }
      
      const response = await api.players.updateProfile(updateData)
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Phone number updated successfully',
        })
        await loadUserProfile()
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to update phone number',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update phone number',
        variant: 'destructive',
      })
    } finally {
      setIsPhoneSubmitting(false)
    }
  }
  
  // Password validation
  const validatePassword = (password: string): boolean => {
    if (password.length < 8) return false
    if (!/[A-Z]/.test(password)) return false
    if (!/[a-z]/.test(password)) return false
    if (!/[0-9]/.test(password)) return false
    if (!/[@$!%*?&]/.test(password)) return false
    return true
  }
  
  // Password update handler
  const handlePasswordSubmit = async () => {
    // Validation
    if (!passwordData.password || !passwordData.new_password || !passwordData.repeat_password) {
      toast({
        title: 'Validation Error',
        description: 'All password fields are required',
        variant: 'destructive',
      })
      return
    }
    
    if (passwordData.new_password !== passwordData.repeat_password) {
      toast({
        title: 'Validation Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      })
      return
    }
    
    if (!validatePassword(passwordData.new_password)) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
        variant: 'destructive',
      })
      return
    }
    
    setIsPasswordSubmitting(true)
    try {
      const updateData: UpdateProfileData = {
        password: passwordData.password,
        new_password: passwordData.new_password,
        repeat_password: passwordData.repeat_password,
      }
      
      const response = await api.players.updateProfile(updateData)
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Password updated successfully',
        })
        // Clear form
        setPasswordData({
          password: '',
          new_password: '',
          repeat_password: '',
        })
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to update password',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      })
    } finally {
      setIsPasswordSubmitting(false)
    }
  }
  
  // File upload handler
  const handleFileChange = (field: keyof typeof kycFiles, file: File | null) => {
    if (!file) {
      const newFiles = { ...kycFiles }
      delete newFiles[field]
      setKycFiles(newFiles)
      return
    }
    
    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Only JPEG, PNG, and PDF files are allowed',
        variant: 'destructive',
      })
      return
    }
    
    const maxSize = 30 * 1024 * 1024 // 30MB
    if (file.size > maxSize) {
      toast({
        title: 'File Too Large',
        description: 'File size must be less than 30MB',
        variant: 'destructive',
      })
      return
    }
    
    setKycFiles(prev => ({ ...prev, [field]: file }))
  }
  
  // KYC ID documents upload handler
  const handleKycIdUpload = async () => {
    // Validate all three documents are present
    if (!kycFiles.kyc_front || !kycFiles.kyc_back || !kycFiles.kyc_selfie) {
      toast({
        title: 'Validation Error',
        description: 'All three ID documents (front, back, and selfie) are required',
        variant: 'destructive',
      })
      return
    }
    
    setIsKycSubmitting(true)
    try {
      const updateData: UpdateProfileData = {
        kyc_front: kycFiles.kyc_front,
        kyc_back: kycFiles.kyc_back,
        kyc_selfie: kycFiles.kyc_selfie,
      }
      
      const response = await api.players.updateProfile(updateData)
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'KYC documents uploaded successfully. Status changed to Pending.',
        })
        // Clear files
        setKycFiles(prev => ({
          ...prev,
          kyc_front: undefined,
          kyc_back: undefined,
          kyc_selfie: undefined,
        }))
        await loadUserProfile()
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to upload KYC documents',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload KYC documents',
        variant: 'destructive',
      })
    } finally {
      setIsKycSubmitting(false)
    }
  }
  
  // KYC address proof upload handler
  const handleAddressProofUpload = async () => {
    if (!kycFiles.kyc_address) {
      toast({
        title: 'Validation Error',
        description: 'Address proof document is required',
        variant: 'destructive',
      })
      return
    }
    
    setIsKycSubmitting(true)
    try {
      const updateData: UpdateProfileData = {
        kyc_address: kycFiles.kyc_address,
      }
      
      const response = await api.players.updateProfile(updateData)
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Address proof uploaded successfully',
        })
        setKycFiles(prev => ({ ...prev, kyc_address: undefined }))
        await loadUserProfile()
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to upload address proof',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload address proof',
        variant: 'destructive',
      })
    } finally {
      setIsKycSubmitting(false)
    }
  }
  
  // Helper to render KYC status badge
  const renderKycStatusBadge = (status?: string) => {
    if (!status || status === 'none') {
      return (
        <div className="px-3 py-1 bg-[rgb(var(--text-muted))] text-white text-xs font-bold rounded-xl">
          Not Submitted
        </div>
      )
    }
    if (status === 'pending') {
      return (
        <div className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-xl">
          Pending Review
        </div>
      )
    }
    if (status === 'confirmed') {
      return (
        <div className="px-3 py-1 bg-[rgb(var(--success))] text-white text-xs font-bold rounded-xl">
          Verified
        </div>
      )
    }
    if (status === 'rejected') {
      return (
        <div className="px-3 py-1 bg-[rgb(var(--error))] text-white text-xs font-bold rounded-xl">
          Rejected
        </div>
      )
    }
    return null
  }

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

              {isLoadingUser ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[rgb(var(--primary))]" />
                </div>
              ) : (
                <>
                  {/* Account Tab */}
                  {activeTab === 'account' && (
                    <div className="space-y-6">
                      {/* Email Section */}
                      <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Email</h2>
                          {user?.emailVerified ? (
                            <div className="px-3 py-1 bg-[rgb(var(--success))] text-white text-xs font-bold rounded-xl">
                              Verified
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-xl">
                              Not Verified
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">Email</label>
                          <div className="relative">
                            <input
                              type="email"
                              value={user?.email || ''}
                              readOnly
                              className="w-full h-12 px-4 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] cursor-not-allowed"
                            />
                          </div>
                        </div>

                        {!user?.emailVerified && (
                          <button className="px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all">
                            Confirm Email
                          </button>
                        )}
                      </div>

                      {/* Phone Number Section */}
                      <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-6">
                        <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Phone Number</h2>

                        <p className="text-[13px] text-[rgb(var(--text-muted))]">
                          Add your phone number for account security and notifications.
                        </p>

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
                          onClick={handlePhoneSubmit}
                          disabled={!phoneNumber || isPhoneSubmitting}
                          className="px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:bg-[rgb(var(--text-disabled))] disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isPhoneSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                          {isPhoneSubmitting ? 'Updating...' : 'Update Phone Number'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-6">
                        <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Change Password</h2>
                        
                        <div>
                          <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.current ? 'text' : 'password'}
                              value={passwordData.password}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                              className="w-full h-12 px-4 pr-12 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]"
                            >
                              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? 'text' : 'password'}
                              value={passwordData.new_password}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                              className="w-full h-12 px-4 pr-12 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]"
                            >
                              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                            At least 8 characters with uppercase, lowercase, number, and special character
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">Repeat New Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.repeat ? 'text' : 'password'}
                              value={passwordData.repeat_password}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, repeat_password: e.target.value }))}
                              className="w-full h-12 px-4 pr-12 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({ ...prev, repeat: !prev.repeat }))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]"
                            >
                              {showPasswords.repeat ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <button
                          onClick={handlePasswordSubmit}
                          disabled={isPasswordSubmitting}
                          className="px-6 py-3 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isPasswordSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                          {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>

                      <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-4">
                        <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Two-Factor Authentication</h2>
                        <p className="text-sm text-[rgb(var(--text-muted))]">Add an extra layer of security to your account</p>
                        <button className="px-6 py-3 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-xl transition-all opacity-50 cursor-not-allowed">
                          Enable 2FA (Coming Soon)
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
                          <select 
                            value={user?.lang || 'EN'}
                            disabled
                            className="w-full h-12 px-4 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] cursor-not-allowed opacity-70"
                          >
                            <option value="EN">English</option>
                            <option value="RU">Russian</option>
                            <option value="ES">Spanish</option>
                          </select>
                          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">Language preferences coming soon</p>
                        </div>

                        <div>
                          <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">Currency</label>
                          <select 
                            value={user?.currency || 'RUB'}
                            disabled
                            className="w-full h-12 px-4 bg-[rgb(var(--surface))] border border-[rgb(var(--surface-hover))] rounded-xl text-sm text-[rgb(var(--text-primary))] cursor-not-allowed opacity-70"
                          >
                            <option value="RUB">RUB - Russian Ruble</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="BTC">BTC - Bitcoin</option>
                          </select>
                          <p className="text-xs text-[rgb(var(--text-muted))] mt-2">Currency is set during registration</p>
                        </div>

                        <div className="flex items-center justify-between py-3 opacity-50">
                          <div>
                            <p className="text-sm font-medium text-[rgb(var(--text-primary))]">Email Notifications</p>
                            <p className="text-xs text-[rgb(var(--text-muted))]">Receive updates via email (Coming Soon)</p>
                          </div>
                          <button disabled className="w-12 h-6 bg-[rgb(var(--surface))] rounded-full relative cursor-not-allowed">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-[rgb(var(--text-muted))] rounded-full" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Verification Tab */}
                  {activeTab === 'verification' && (
                    <div className="space-y-6">
                      {/* KYC ID Documents Section */}
                      <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Identity Verification (KYC)</h2>
                          {renderKycStatusBadge(user?.kycStatus)}
                        </div>
                        
                        <p className="text-sm text-[rgb(var(--text-muted))]">
                          Upload your identity documents for verification. All three documents must be uploaded together.
                        </p>
                        
                        {(user?.kycStatus === 'pending' || user?.kycStatus === 'confirmed') ? (
                          <div className="bg-[rgb(var(--surface))] rounded-xl p-6 border border-[rgb(var(--surface-hover))]">
                            <p className="text-sm text-[rgb(var(--text-primary))] mb-2">
                              {user?.kycStatus === 'pending' ? 'Your documents are under review' : 'Your identity is verified'}
                            </p>
                            <p className="text-xs text-[rgb(var(--text-muted))]">
                              {user?.kycStatus === 'pending' 
                                ? 'We will notify you once the review is complete.'
                                : 'Thank you for completing verification.'}
                            </p>
                          </div>
                        ) : (
                          <>
                            {/* ID Front */}
                            <div>
                              <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">
                                ID Front <span className="text-[rgb(var(--error))]">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  onChange={(e) => handleFileChange('kyc_front', e.target.files?.[0] || null)}
                                  className="hidden"
                                  id="kyc_front"
                                />
                                <label
                                  htmlFor="kyc_front"
                                  className="flex items-center justify-center gap-2 w-full h-32 bg-[rgb(var(--surface))] border-2 border-dashed border-[rgb(var(--surface-hover))] rounded-xl cursor-pointer hover:border-[rgb(var(--primary))] transition-colors"
                                >
                                  {kycFiles.kyc_front ? (
                                    <div className="text-center">
                                      <FileText className="h-8 w-8 text-[rgb(var(--primary))] mx-auto mb-2" />
                                      <p className="text-sm text-[rgb(var(--text-primary))]">{kycFiles.kyc_front.name}</p>
                                      <p className="text-xs text-[rgb(var(--text-muted))]">
                                        {(kycFiles.kyc_front.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <Upload className="h-8 w-8 text-[rgb(var(--text-muted))] mx-auto mb-2" />
                                      <p className="text-sm text-[rgb(var(--text-primary))]">Upload ID Front</p>
                                      <p className="text-xs text-[rgb(var(--text-muted))]">JPEG, PNG, PDF (max 30MB)</p>
                                    </div>
                                  )}
                                </label>
                              </div>
                            </div>
                            
                            {/* ID Back */}
                            <div>
                              <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">
                                ID Back <span className="text-[rgb(var(--error))]">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  onChange={(e) => handleFileChange('kyc_back', e.target.files?.[0] || null)}
                                  className="hidden"
                                  id="kyc_back"
                                />
                                <label
                                  htmlFor="kyc_back"
                                  className="flex items-center justify-center gap-2 w-full h-32 bg-[rgb(var(--surface))] border-2 border-dashed border-[rgb(var(--surface-hover))] rounded-xl cursor-pointer hover:border-[rgb(var(--primary))] transition-colors"
                                >
                                  {kycFiles.kyc_back ? (
                                    <div className="text-center">
                                      <FileText className="h-8 w-8 text-[rgb(var(--primary))] mx-auto mb-2" />
                                      <p className="text-sm text-[rgb(var(--text-primary))]">{kycFiles.kyc_back.name}</p>
                                      <p className="text-xs text-[rgb(var(--text-muted))]">
                                        {(kycFiles.kyc_back.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <Upload className="h-8 w-8 text-[rgb(var(--text-muted))] mx-auto mb-2" />
                                      <p className="text-sm text-[rgb(var(--text-primary))]">Upload ID Back</p>
                                      <p className="text-xs text-[rgb(var(--text-muted))]">JPEG, PNG, PDF (max 30MB)</p>
                                    </div>
                                  )}
                                </label>
                              </div>
                            </div>
                            
                            {/* Selfie with ID */}
                            <div>
                              <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">
                                Selfie with ID <span className="text-[rgb(var(--error))]">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  onChange={(e) => handleFileChange('kyc_selfie', e.target.files?.[0] || null)}
                                  className="hidden"
                                  id="kyc_selfie"
                                />
                                <label
                                  htmlFor="kyc_selfie"
                                  className="flex items-center justify-center gap-2 w-full h-32 bg-[rgb(var(--surface))] border-2 border-dashed border-[rgb(var(--surface-hover))] rounded-xl cursor-pointer hover:border-[rgb(var(--primary))] transition-colors"
                                >
                                  {kycFiles.kyc_selfie ? (
                                    <div className="text-center">
                                      <FileText className="h-8 w-8 text-[rgb(var(--primary))] mx-auto mb-2" />
                                      <p className="text-sm text-[rgb(var(--text-primary))]">{kycFiles.kyc_selfie.name}</p>
                                      <p className="text-xs text-[rgb(var(--text-muted))]">
                                        {(kycFiles.kyc_selfie.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <Upload className="h-8 w-8 text-[rgb(var(--text-muted))] mx-auto mb-2" />
                                      <p className="text-sm text-[rgb(var(--text-primary))]">Upload Selfie with ID</p>
                                      <p className="text-xs text-[rgb(var(--text-muted))]">JPEG, PNG, PDF (max 30MB)</p>
                                    </div>
                                  )}
                                </label>
                              </div>
                            </div>
                            
                            <button
                              onClick={handleKycIdUpload}
                              disabled={!kycFiles.kyc_front || !kycFiles.kyc_back || !kycFiles.kyc_selfie || isKycSubmitting}
                              className="px-6 py-3 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isKycSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                              {isKycSubmitting ? 'Uploading...' : 'Submit ID Documents'}
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Address Proof Section */}
                      <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8 space-y-6">
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))]">Address Proof</h2>
                          {renderKycStatusBadge(user?.addressProofStatus)}
                        </div>
                        
                        <p className="text-sm text-[rgb(var(--text-muted))]">
                          Upload a utility bill, bank statement, or official document showing your address.
                        </p>
                        
                        {(user?.addressProofStatus === 'pending' || user?.addressProofStatus === 'confirmed') ? (
                          <div className="bg-[rgb(var(--surface))] rounded-xl p-6 border border-[rgb(var(--surface-hover))]">
                            <p className="text-sm text-[rgb(var(--text-primary))] mb-2">
                              {user?.addressProofStatus === 'pending' ? 'Your address proof is under review' : 'Your address is verified'}
                            </p>
                            <p className="text-xs text-[rgb(var(--text-muted))]">
                              {user?.addressProofStatus === 'pending' 
                                ? 'We will notify you once the review is complete.'
                                : 'Thank you for completing address verification.'}
                            </p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <label className="block text-xs text-[rgb(var(--text-muted))] mb-2">
                                Address Proof Document <span className="text-[rgb(var(--error))]">*</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  onChange={(e) => handleFileChange('kyc_address', e.target.files?.[0] || null)}
                                  className="hidden"
                                  id="kyc_address"
                                />
                                <label
                                  htmlFor="kyc_address"
                                  className="flex items-center justify-center gap-2 w-full h-32 bg-[rgb(var(--surface))] border-2 border-dashed border-[rgb(var(--surface-hover))] rounded-xl cursor-pointer hover:border-[rgb(var(--primary))] transition-colors"
                                >
                                  {kycFiles.kyc_address ? (
                                    <div className="text-center">
                                      <FileText className="h-8 w-8 text-[rgb(var(--primary))] mx-auto mb-2" />
                                      <p className="text-sm text-[rgb(var(--text-primary))]">{kycFiles.kyc_address.name}</p>
                                      <p className="text-xs text-[rgb(var(--text-muted))]">
                                        {(kycFiles.kyc_address.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <Upload className="h-8 w-8 text-[rgb(var(--text-muted))] mx-auto mb-2" />
                                      <p className="text-sm text-[rgb(var(--text-primary))]">Upload Address Proof</p>
                                      <p className="text-xs text-[rgb(var(--text-muted))]">JPEG, PNG, PDF (max 30MB)</p>
                                    </div>
                                  )}
                                </label>
                              </div>
                            </div>
                            
                            <button
                              onClick={handleAddressProofUpload}
                              disabled={!kycFiles.kyc_address || isKycSubmitting}
                              className="px-6 py-3 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              {isKycSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                              {isKycSubmitting ? 'Uploading...' : 'Submit Address Proof'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* API Tab */}
                  {activeTab === 'api' && (
                    <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8">
                      <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-4">API Settings</h2>
                      <p className="text-sm text-[rgb(var(--text-muted))]">API key management and documentation (Coming Soon)</p>
                    </div>
                  )}

                  {/* Offers Tab */}
                  {activeTab === 'offers' && (
                    <div className="bg-[rgb(var(--bg-elevated))] rounded-2xl p-8">
                      <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-4">Marketing Preferences</h2>
                      <p className="text-sm text-[rgb(var(--text-muted))]">Manage promotional communications (Coming Soon)</p>
                    </div>
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
