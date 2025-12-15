'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/user-context'
import { api, UpdateProfileData, Session } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { toast } from '@/hooks/use-toast'
import { Eye, EyeOff, Loader2, Check, Smartphone, Monitor, Smartphone as MobileIcon, X } from 'lucide-react'

interface SecuritySectionProps {
  user: User
  onUpdate: () => Promise<void>
}

export function SecuritySection({ user, onUpdate }: SecuritySectionProps) {
  const { requestEmailVerification } = useAuth()
  
  // Password state
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
  
  // Email verification state
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  
  // Sessions state
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [isRevokingSession, setIsRevokingSession] = useState<string | null>(null)
  const [isRevokingAll, setIsRevokingAll] = useState(false)
  
  // Password validation
  const validatePassword = (password: string): boolean => {
    if (password.length < 8) return false
    if (!/[A-Z]/.test(password)) return false
    if (!/[a-z]/.test(password)) return false
    if (!/[0-9]/.test(password)) return false
    if (!/[@$!%*?&]/.test(password)) return false
    return true
  }
  
  // Calculate password strength
  const getPasswordStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 25
    if (/[A-Z]/.test(password)) strength += 15
    if (/[a-z]/.test(password)) strength += 15
    if (/[0-9]/.test(password)) strength += 10
    if (/[@$!%*?&]/.test(password)) strength += 10
    return Math.min(strength, 100)
  }
  
  const passwordStrength = getPasswordStrength(passwordData.new_password)
  
  // Update password
  const handlePasswordUpdate = async () => {
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
      const response = await api.players.updateProfile({
        password: passwordData.password,
        new_password: passwordData.new_password,
        repeat_password: passwordData.repeat_password,
      })
      
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Password updated successfully',
        })
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
  
  // Resend email verification
  const handleResendVerification = async () => {
    setIsResendingVerification(true)
    try {
      await requestEmailVerification()
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email inbox for the verification link.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send verification email',
        variant: 'destructive',
      })
    } finally {
      setIsResendingVerification(false)
    }
  }
  
  // Verify phone (mock)
  const handleVerifyPhone = () => {
    toast({
      title: 'Demo Feature',
      description: 'Phone verification SMS sent. This is demo data only.',
      duration: 3000,
    })
  }
  
  // Fetch sessions
  const fetchSessions = async () => {
    setIsLoadingSessions(true)
    try {
      const response = await api.sessions.getSessions()
      if (response.success) {
        setSessions(response.data)
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to load sessions',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load sessions',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingSessions(false)
    }
  }
  
  // Revoke a specific session
  const handleRevokeSession = async (sessionId: string) => {
    setIsRevokingSession(sessionId)
    try {
      const response = await api.sessions.revokeSession(sessionId)
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Session revoked successfully',
        })
        // Refresh sessions list
        await fetchSessions()
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to revoke session',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to revoke session',
        variant: 'destructive',
      })
    } finally {
      setIsRevokingSession(null)
    }
  }
  
  // Revoke all other sessions
  const handleRevokeAllOtherSessions = async () => {
    setIsRevokingAll(true)
    try {
      const response = await api.sessions.revokeAllOtherSessions()
      if (response.success) {
        toast({
          title: 'Success',
          description: 'All other sessions have been logged out',
        })
        // Refresh sessions list
        await fetchSessions()
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to revoke sessions',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to revoke sessions',
        variant: 'destructive',
      })
    } finally {
      setIsRevokingAll(false)
    }
  }
  
  // Load sessions on mount
  useEffect(() => {
    fetchSessions()
  }, [])
  
  // Helper function to get device icon
  const getDeviceIcon = (deviceType?: string) => {
    if (deviceType?.toLowerCase().includes('mobile') || deviceType?.toLowerCase().includes('tablet')) {
      return <MobileIcon className="h-5 w-5" />
    }
    return <Monitor className="h-5 w-5" />
  }
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    })
  }
  
  return (
    <div className="space-y-6">
      {/* Password Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">Change Password</h2>
        <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
          Keep your account secure by updating your password regularly.
        </p>
        
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Current Password <span className="text-[rgb(var(--error))]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.password}
                onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full h-12 px-4 pr-12 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
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
          
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              New Password <span className="text-[rgb(var(--error))]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.new_password}
                onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                className="w-full h-12 px-4 pr-12 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text-primary))]"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordData.new_password && (
              <div className="mt-2">
                <div className="flex gap-1 h-2">
                  <div className={`flex-1 rounded ${passwordStrength >= 25 ? 'bg-[rgb(var(--error))]' : 'bg-[#5d4b7e]'}`} />
                  <div className={`flex-1 rounded ${passwordStrength >= 50 ? 'bg-yellow-500' : 'bg-[#5d4b7e]'}`} />
                  <div className={`flex-1 rounded ${passwordStrength >= 75 ? 'bg-[rgb(var(--success))]' : 'bg-[#5d4b7e]'}`} />
                  <div className={`flex-1 rounded ${passwordStrength >= 100 ? 'bg-[rgb(var(--success))]' : 'bg-[#5d4b7e]'}`} />
                </div>
                <p className="text-xs text-[rgb(var(--text-muted))] mt-2">
                  At least 8 characters with uppercase, lowercase, number, and special character
                </p>
              </div>
            )}
          </div>
          
          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Confirm Password <span className="text-[rgb(var(--error))]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPasswords.repeat ? 'text' : 'password'}
                value={passwordData.repeat_password}
                onChange={(e) => setPasswordData(prev => ({ ...prev, repeat_password: e.target.value }))}
                className="w-full h-12 px-4 pr-12 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
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
          
          <p className="text-sm text-[rgb(var(--text-muted))]">
            Re-login will be required after changing the password.
          </p>
          
          <div className="flex justify-end">
            <button
              onClick={handlePasswordUpdate}
              disabled={isPasswordSubmitting}
              className="px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPasswordSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
      
      
      {/* Email & Phone Verification Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">Verification</h2>
        
        <div className="space-y-4">
          {/* Email Verification */}
          <div className="p-4 bg-[#3d2b5e] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.emailVerified ? 'bg-[rgb(var(--success))]' : 'bg-yellow-500'}`}>
                {user.emailVerified ? <Check className="h-5 w-5 text-white" /> : <span className="text-white font-bold">!</span>}
              </div>
              <div>
                <p className="font-semibold text-[rgb(var(--text-primary))]">Email Verification</p>
                <p className="text-sm text-[rgb(var(--text-muted))]">
                  {user.emailVerified ? 'Email is verified' : 'Email is not verified'}
                </p>
              </div>
            </div>
            {!user.emailVerified && (
              <button
                onClick={handleResendVerification}
                disabled={isResendingVerification}
                className="px-4 py-2 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {isResendingVerification ? 'Sending...' : 'Resend Email'}
              </button>
            )}
          </div>
          
          {/* Phone Verification */}
          <div className="p-4 bg-[#3d2b5e] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-500">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[rgb(var(--text-primary))]">Phone Verification</p>
                <p className="text-sm text-[rgb(var(--text-muted))]">Verify your phone number</p>
              </div>
            </div>
            <button
              onClick={handleVerifyPhone}
              className="px-4 py-2 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-lg transition-all"
            >
              Verify Phone
            </button>
          </div>
        </div>
      </div>
      
      {/* Sessions Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[rgb(var(--text-primary))]">Active Sessions</h2>
            <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
              Manage your active sessions and log out from other devices
            </p>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAllOtherSessions}
              disabled={isRevokingAll}
              className="px-4 py-2 bg-[rgb(var(--error))] hover:brightness-110 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRevokingAll && <Loader2 className="h-4 w-4 animate-spin" />}
              Log Out All Others
            </button>
          )}
        </div>
        
        {isLoadingSessions ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[rgb(var(--primary))]" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[rgb(var(--text-muted))]">No active sessions found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 bg-[#3d2b5e] rounded-xl flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    session.isCurrent ? 'bg-[rgb(var(--success))]' : 'bg-[#5d4b7e]'
                  }`}>
                    {getDeviceIcon(session.deviceType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-[rgb(var(--text-primary))] truncate">
                        {session.browser || 'Unknown Browser'}
                        {session.os && ` • ${session.os}`}
                      </p>
                      {session.isCurrent && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-[rgb(var(--success))] text-white rounded-full flex-shrink-0">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm text-[rgb(var(--text-muted))] truncate">
                        {session.ipAddress}
                        {(session.city || session.country) && (
                          <> • {[session.city, session.country].filter(Boolean).join(', ')}</>
                        )}
                      </p>
                      <p className="text-xs text-[rgb(var(--text-muted))]">
                        Last active: {formatDate(session.lastActivityAt)}
                      </p>
                    </div>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    disabled={isRevokingSession === session.id}
                    className="p-2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--error))] hover:bg-[#2a1b47] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    title="Log out this session"
                  >
                    {isRevokingSession === session.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <X className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}








