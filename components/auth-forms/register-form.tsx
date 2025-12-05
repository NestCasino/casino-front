'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Loader2, Mail, Lock, User, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/auth-context'
import { api, Country, Language } from '@/lib/api-client'
import { SocialLoginButtons } from './social-login-buttons'
import { PasswordStrengthIndicator } from './password-strength-indicator'
import { useDebounce } from '@/hooks/use-debounce'

interface Currency {
  id: string
  groupName: string
  name: string
  symbol: string
  type: string
  coinNetworkId: string | null
  logo: string | null
  baseCommission: string
  minAmount: string
  minWithdraw: string
  isActive: boolean
  modifyUid: string
  createDt: string
  modifyDt: string
}

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  currency: z.string().min(1, 'Please select a currency'),
  country: z.string().optional(),
  lang: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and confirm you are 18+',
  }),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const { register: registerUser, checkEmailAvailability, checkUsernameAvailability } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true)
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true)
  
  // Availability states
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [checkingUsername, setCheckingUsername] = useState(false)
  
  // Currency states
  const [fiatCurrencies, setFiatCurrencies] = useState<Currency[]>([])
  
  // Country and Language states
  const [countries, setCountries] = useState<Country[]>([])
  const [languages, setLanguages] = useState<Language[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      currency: '',
      country: '',
      lang: '',
      agreeToTerms: false,
    },
  })

  // Load fiat currencies on mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await api.currencies.getByType('fiat')
        if (response.success && response.data && response.data.length > 0) {
          const currencies = response.data as unknown as Currency[]
          setFiatCurrencies(currencies)
          
          // Set Euro (EUR) as default, or first currency if EUR not found
          const euroCurrency = currencies.find((c) => c.symbol === 'EUR')
          const defaultCurrency = euroCurrency || currencies[0]
          
          if (defaultCurrency) {
            setValue('currency', defaultCurrency.symbol, { 
              shouldValidate: false,
              shouldDirty: false,
              shouldTouch: false
            })
          }
        }
      } catch (error) {
        console.error('Failed to load currencies:', error)
      } finally {
        setIsLoadingCurrencies(false)
      }
    }

    loadCurrencies()
  }, [setValue])

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await api.countries.getActive()
        if (response.success && response.data && response.data.length > 0) {
          setCountries(response.data)
          
          // Set United States as default, or first country if US not found
          const usCountry = response.data.find((c) => c.iso === 'US')
          const defaultCountry = usCountry || response.data[0]
          
          if (defaultCountry) {
            setValue('country', defaultCountry.iso, { 
              shouldValidate: false,
              shouldDirty: false,
              shouldTouch: false
            })
          }
        }
      } catch (error) {
        console.error('Failed to load countries:', error)
      } finally {
        setIsLoadingCountries(false)
      }
    }

    loadCountries()
  }, [setValue])

  // Load languages on mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await api.languages.getActive()
        if (response.success && response.data && response.data.length > 0) {
          setLanguages(response.data)
          
          // Set English as default, or first language if EN not found
          const enLanguage = response.data.find((l) => l.iso.toLowerCase() === 'en')
          const defaultLanguage = enLanguage || response.data[0]
          
          if (defaultLanguage) {
            setValue('lang', defaultLanguage.iso, { 
              shouldValidate: false,
              shouldDirty: false,
              shouldTouch: false
            })
          }
        }
      } catch (error) {
        console.error('Failed to load languages:', error)
      } finally {
        setIsLoadingLanguages(false)
      }
    }

    loadLanguages()
  }, [setValue])

  const agreeToTerms = watch('agreeToTerms')
  const password = watch('password')
  const email = watch('email')
  const username = watch('username')
  const currency = watch('currency')
  const country = watch('country')
  const lang = watch('lang')

  // Debounce email and username for availability checks
  const debouncedEmail = useDebounce(email, 500)
  const debouncedUsername = useDebounce(username, 500)

  // Check email availability
  useEffect(() => {
    const checkEmail = async () => {
      if (debouncedEmail && !errors.email) {
        setCheckingEmail(true)
        try {
          const available = await checkEmailAvailability(debouncedEmail)
          setEmailAvailable(available)
        } catch (error) {
          setEmailAvailable(null)
        } finally {
          setCheckingEmail(false)
        }
      } else {
        setEmailAvailable(null)
      }
    }

    checkEmail()
  }, [debouncedEmail, errors.email, checkEmailAvailability])

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername && !errors.username && debouncedUsername.length >= 3) {
        setCheckingUsername(true)
        try {
          const available = await checkUsernameAvailability(debouncedUsername)
          setUsernameAvailable(available)
        } catch (error) {
          setUsernameAvailable(null)
        } finally {
          setCheckingUsername(false)
        }
      } else {
        setUsernameAvailable(null)
      }
    }

    checkUsername()
  }, [debouncedUsername, errors.username, checkUsernameAvailability])

  const onSubmit = async (data: RegisterFormData) => {
    // Check availability before submitting
    if (emailAvailable === false) {
      return
    }
    if (usernameAvailable === false) {
      return
    }

    setIsLoading(true)
    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        currency: data.currency,
        country: data.country,
        lang: data.lang,
      })
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Username Field */}
      <div className="space-y-1">
        <Label htmlFor="register-username" className="text-gray-200 text-sm">
          Username
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="register-username"
            type="text"
            placeholder="Choose a username"
            className="pl-10 pr-10 bg-[#2d1b4e] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 w-full h-10"
            {...register('username')}
            disabled={isLoading}
          />
          {checkingUsername && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
          )}
          {!checkingUsername && usernameAvailable === true && (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
          )}
          {!checkingUsername && usernameAvailable === false && (
            <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
          )}
        </div>
        {errors.username && (
          <p className="text-xs text-red-400">{errors.username.message}</p>
        )}
        {!errors.username && usernameAvailable === false && (
          <p className="text-xs text-red-400">Username is already taken</p>
        )}
        {!errors.username && usernameAvailable === true && (
          <p className="text-xs text-green-400">Username is available</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-1">
        <Label htmlFor="register-email" className="text-gray-200 text-sm">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="register-email"
            type="email"
            placeholder="Enter your email"
            className="pl-10 pr-10 bg-[#2d1b4e] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 w-full h-10"
            {...register('email')}
            disabled={isLoading}
          />
          {checkingEmail && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
          )}
          {!checkingEmail && emailAvailable === true && (
            <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
          )}
          {!checkingEmail && emailAvailable === false && (
            <X className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
          )}
        </div>
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
        {!errors.email && emailAvailable === false && (
          <p className="text-xs text-red-400">Email is already registered</p>
        )}
        {!errors.email && emailAvailable === true && (
          <p className="text-xs text-green-400">Email is available</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1">
        <Label htmlFor="register-password" className="text-gray-200 text-sm">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
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

      {/* Currency Field */}
      <div className="space-y-1">
        <Label htmlFor="register-currency" className="text-gray-200 text-sm">
          Preferred Currency
        </Label>
        <Select
          value={currency || undefined}
          onValueChange={(value) => setValue('currency', value, { shouldValidate: true })}
          disabled={isLoadingCurrencies || isLoading}
        >
          <SelectTrigger 
            id="register-currency" 
            className="bg-[#2d1b4e] border-gray-700 text-white h-10 w-full"
          >
            <SelectValue 
              placeholder={isLoadingCurrencies ? 'Loading currencies...' : 'Select currency'}
              className="text-white"
            />
          </SelectTrigger>
          <SelectContent className="bg-[#2d1b4e] border-gray-700">
            {fiatCurrencies.map((curr) => (
              <SelectItem
                key={curr.id}
                value={curr.symbol}
                className="text-white focus:bg-purple-600/30 focus:text-white"
              >
                {curr.symbol} - {curr.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.currency && (
          <p className="text-xs text-red-400">{errors.currency.message}</p>
        )}
      </div>

      {/* Country Field */}
      <div className="space-y-1">
        <Label htmlFor="register-country" className="text-gray-200 text-sm">
          Country
        </Label>
        <Select
          value={country || undefined}
          onValueChange={(value) => setValue('country', value, { shouldValidate: true })}
          disabled={isLoadingCountries || isLoading}
        >
          <SelectTrigger 
            id="register-country" 
            className="bg-[#2d1b4e] border-gray-700 text-white h-10 w-full"
          >
            <SelectValue 
              placeholder={isLoadingCountries ? 'Loading countries...' : 'Select country'}
              className="text-white"
            />
          </SelectTrigger>
          <SelectContent className="bg-[#2d1b4e] border-gray-700">
            {countries.map((countryItem) => (
              <SelectItem
                key={countryItem.id}
                value={countryItem.iso}
                className="text-white focus:bg-purple-600/30 focus:text-white"
              >
                {countryItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && (
          <p className="text-xs text-red-400">{errors.country.message}</p>
        )}
      </div>

      {/* Language Field */}
      <div className="space-y-1">
        <Label htmlFor="register-language" className="text-gray-200 text-sm">
          Language
        </Label>
        <Select
          value={lang || undefined}
          onValueChange={(value) => setValue('lang', value, { shouldValidate: true })}
          disabled={isLoadingLanguages || isLoading}
        >
          <SelectTrigger 
            id="register-language" 
            className="bg-[#2d1b4e] border-gray-700 text-white h-10 w-full"
          >
            <SelectValue 
              placeholder={isLoadingLanguages ? 'Loading languages...' : 'Select language'}
              className="text-white"
            />
          </SelectTrigger>
          <SelectContent className="bg-[#2d1b4e] border-gray-700">
            {languages.map((languageItem) => (
              <SelectItem
                key={languageItem.id}
                value={languageItem.iso}
                className="text-white focus:bg-purple-600/30 focus:text-white"
              >
                {languageItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.lang && (
          <p className="text-xs text-red-400">{errors.lang.message}</p>
        )}
      </div>

      {/* Terms & Age Checkbox */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="agree-terms"
          checked={agreeToTerms}
          onCheckedChange={(checked) => setValue('agreeToTerms', checked as boolean)}
          className="mt-1 border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
          disabled={isLoading}
        />
        <Label
          htmlFor="agree-terms"
          className="text-sm text-gray-300 cursor-pointer leading-tight"
        >
          I confirm that I am at least 18 years old and I have read and agree to the{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300">
            Terms of service
          </a>
        </Label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-xs text-red-400 -mt-1">{errors.agreeToTerms.message}</p>
      )}

      {/* Create Account Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold h-10"
        disabled={isLoading || isLoadingCurrencies || isLoadingCountries || isLoadingLanguages || emailAvailable === false || usernameAvailable === false}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Social Login */}
      <SocialLoginButtons />
    </form>
  )
}

