'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/lib/auth-context'
import { SocialLoginButtons } from './social-login-buttons'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const rememberMe = watch('rememberMe')

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password, data.rememberMe)
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Email Field */}
      <div className="space-y-1">
        <Label htmlFor="login-email" className="text-gray-200 text-sm">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="login-email"
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

      {/* Password Field */}
      <div className="space-y-1">
        <Label htmlFor="login-password" className="text-gray-200 text-sm">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
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
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)}
            className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            disabled={isLoading}
          />
          <Label
            htmlFor="remember-me"
            className="text-sm text-gray-300 cursor-pointer"
          >
            Remember me
          </Label>
        </div>
        <button
          type="button"
          className="text-sm text-purple-400 hover:text-purple-300"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold h-10"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </Button>

      {/* Social Login */}
      <SocialLoginButtons />
    </form>
  )
}

