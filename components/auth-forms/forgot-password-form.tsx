'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const { forgotPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await forgotPassword(data.email)
      setIsSuccess(true)
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-500/20 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Check Your Email</h3>
          <p className="text-sm text-gray-300">
            We've sent a password reset link to
          </p>
          <p className="text-sm font-medium text-purple-400">
            {getValues('email')}
          </p>
          <p className="text-xs text-gray-400 pt-2">
            The link will expire in 1 hour. If you don't see the email, check your spam folder.
          </p>
        </div>
        <Button
          onClick={onBackToLogin}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold h-10"
        >
          Back to Login
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBackToLogin}
        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </button>

      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">Forgot Password?</h3>
        <p className="text-sm text-gray-300">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Email Field */}
      <div className="space-y-1">
        <Label htmlFor="forgot-email" className="text-gray-200 text-sm">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="forgot-email"
            type="email"
            placeholder="Enter your email"
            className="pl-10 bg-[#2d1b4e] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 w-full h-10"
            {...register('email')}
            disabled={isLoading}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
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
            Sending...
          </>
        ) : (
          'Send Reset Link'
        )}
      </Button>
    </form>
  )
}









