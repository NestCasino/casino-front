'use client'

import { useState, useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Lock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { PasswordStrengthIndicator } from '@/components/auth-forms/password-strength-indicator'
import Link from 'next/link'

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { resetPassword } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid or missing reset link. Please request a new password reset.')
    }
  }, [token, email])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token || !email) {
      setError('Invalid reset link')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      await resetPassword(email, token, data.password, data.confirmPassword)
      setIsSuccess(true)
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] flex items-center justify-center p-4">
        <div className="bg-[#1a0b2e]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-500/20 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Password Reset Successful!</h1>
            <p className="text-gray-300">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <p className="text-sm text-gray-400 pt-2">
              Redirecting to home page in 3 seconds...
            </p>
          </div>
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] flex items-center justify-center p-4">
      <div className="bg-[#1a0b2e]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-8 max-w-md w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
            <p className="text-sm text-gray-300">
              Enter your new password below
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-sm text-red-400">{error}</p>
              <Link href="/" className="text-sm text-purple-400 hover:text-purple-300 underline mt-2 inline-block">
                Return to home page
              </Link>
            </div>
          )}

          {/* Form */}
          {!error && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* New Password Field */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-gray-200 text-sm">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    className="pl-10 pr-10 bg-[#2d1b4e] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 w-full h-10"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
                {password && !errors.password && (
                  <PasswordStrengthIndicator password={password} />
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-gray-200 text-sm">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10 bg-[#2d1b4e] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 w-full h-10"
                    {...register('confirmPassword')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold h-10"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              {/* Back to Home Link */}
              <div className="text-center">
                <Link href="/" className="text-sm text-purple-400 hover:text-purple-300">
                  Back to Home
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
































