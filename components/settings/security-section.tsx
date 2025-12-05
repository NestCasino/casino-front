'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/user-context'
import { api, UpdateProfileData } from '@/lib/api-client'
import { useAuth } from '@/lib/auth-context'
import { toast } from '@/hooks/use-toast'
import { Eye, EyeOff, Loader2, Check, Monitor, Smartphone, X } from 'lucide-react'
import { generateMockSessions, generate2FASecret, generate2FAQRCode, MockSession } from '@/lib/settings-mock-data'

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
  
  // 2FA state
  const [twoFASecret, setTwoFASecret] = useState('')
  const [twoFAQRCode, setTwoFAQRCode] = useState('')
  const [twoFACode, setTwoFACode] = useState(['', '', '', '', '', ''])
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  
  // Email verification state
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  
  // Active sessions state
  const [sessions, setSessions] = useState<MockSession[]>([])
  
  // Generate 2FA secret and QR code on mount
  useEffect(() => {
    const secret = generate2FASecret()
    setTwoFASecret(secret)
    setTwoFAQRCode(generate2FAQRCode(user.username, secret))
    setSessions(generateMockSessions())
  }, [user.username])
  
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
  
  // Enable 2FA (mock)
  const handleEnable2FA = () => {
    const codeComplete = twoFACode.every(digit => digit !== '')
    if (!codeComplete) {
      toast({
        title: 'Validation Error',
        description: 'Please enter the 6-digit code from your authenticator app',
        variant: 'destructive',
      })
      return
    }
    
    setIs2FAEnabled(true)
    toast({
      title: 'Demo Feature',
      description: 'Two-Factor Authentication enabled successfully. This is demo data only.',
      duration: 3000,
    })
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
  
  // End session (mock)
  const handleEndSession = (sessionId: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, status: 'closed' as const } : s
    ))
    toast({
      title: 'Demo Feature',
      description: 'Session ended successfully. This is demo data only.',
      duration: 3000,
    })
  }
  
  // Handle 2FA code input
  const handle2FACodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return
    
    const newCode = [...twoFACode]
    newCode[index] = value
    setTwoFACode(newCode)
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`2fa-code-${index + 1}`)
      nextInput?.focus()
    }
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
      
      {/* Two-Factor Authentication Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">
          Set Up Two-Factor Authentication
        </h2>
        <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
          Download and install Google Authenticator. Enable Two-factor Authentication to protect your account from unauthorized access. Scan the QR code with your Google Authenticator App or enter the secret key manually.
        </p>
        
        {!is2FAEnabled ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-6 p-6 bg-[#3d2b5e] rounded-xl">
              <img src={twoFAQRCode} alt="2FA QR Code" className="w-48 h-48 bg-white p-4 rounded-lg" />
              
              <div className="w-full">
                <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Secret Key</label>
                <div className="p-3 bg-[#4d3b6e] rounded-lg font-mono text-sm text-[rgb(var(--text-primary))] break-all text-center">
                  {twoFASecret}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2 text-center">
                Verification Key
              </label>
              <div className="flex justify-center gap-2">
                {twoFACode.map((digit, index) => (
                  <input
                    key={index}
                    id={`2fa-code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handle2FACodeChange(index, e.target.value)}
                    className="w-12 h-14 text-center bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-lg font-bold text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
                  />
                ))}
              </div>
            </div>
            
            <button
              onClick={handleEnable2FA}
              className="w-full px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all"
            >
              Enable
            </button>
          </div>
        ) : (
          <div className="p-6 bg-[#3d2b5e] rounded-xl flex items-center gap-4">
            <Check className="h-6 w-6 text-[rgb(var(--success))]" />
            <div>
              <p className="font-semibold text-[rgb(var(--text-primary))]">Two-Factor Authentication Enabled</p>
              <p className="text-sm text-[rgb(var(--text-muted))]">Your account is protected with 2FA (Demo)</p>
            </div>
          </div>
        )}
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
      
      {/* Active Sessions Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">Active Sessions</h2>
        <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
          View and manage your currently active sessions on different devices.
        </p>
        
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 bg-[#3d2b5e] rounded-xl border border-[#5d4b7e]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#4d3b6e] flex items-center justify-center">
                    <Monitor className="h-6 w-6 text-[rgb(var(--primary))]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-[rgb(var(--text-primary))]">{session.os}</p>
                      {session.status === 'active' ? (
                        <span className="px-2 py-1 bg-[rgb(var(--success))] text-white text-xs font-bold rounded">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-[rgb(var(--error))] text-white text-xs font-bold rounded">Closed</span>
                      )}
                    </div>
                    <p className="text-sm text-[rgb(var(--text-muted))] mb-1">{session.browser}</p>
                    <p className="text-sm text-[rgb(var(--text-muted))]">
                      {session.ip} • {session.location}
                    </p>
                    <p className="text-xs text-[rgb(var(--text-muted))] mt-1">
                      {new Date(session.loginTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                {session.status === 'active' && (
                  <button
                    onClick={() => handleEndSession(session.id)}
                    className="p-2 text-[rgb(var(--error))] hover:bg-[rgb(var(--error))] hover:text-white rounded-lg transition-all"
                    title="End session"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}








