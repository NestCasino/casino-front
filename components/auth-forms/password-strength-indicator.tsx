'use client'

import { cn } from '@/lib/utils'

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const calculateStrength = (pwd: string): number => {
    let strength = 0
    
    if (!pwd) return 0
    
    // Length criteria
    if (pwd.length >= 8) strength += 1
    if (pwd.length >= 12) strength += 1
    
    // Character type criteria
    if (/[a-z]/.test(pwd)) strength += 1 // lowercase
    if (/[A-Z]/.test(pwd)) strength += 1 // uppercase
    if (/[0-9]/.test(pwd)) strength += 1 // numbers
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1 // special chars
    
    return Math.min(strength, 5)
  }

  const getStrengthLabel = (strength: number): string => {
    if (strength === 0) return ''
    if (strength <= 2) return 'Weak'
    if (strength <= 3) return 'Fair'
    if (strength <= 4) return 'Good'
    return 'Strong'
  }

  const getStrengthColor = (strength: number): string => {
    if (strength === 0) return 'bg-gray-700'
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 3) return 'bg-orange-500'
    if (strength <= 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const strength = calculateStrength(password)
  const strengthLabel = getStrengthLabel(strength)
  const strengthColor = getStrengthColor(strength)

  if (!password) return null

  return (
    <div className="space-y-1">
      {/* Progress bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              level <= strength ? strengthColor : 'bg-gray-700'
            )}
          />
        ))}
      </div>

      {/* Label and requirements */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Password strength:</span>
        {strengthLabel && (
          <span
            className={cn(
              'font-semibold',
              strength <= 2 && 'text-red-400',
              strength === 3 && 'text-orange-400',
              strength === 4 && 'text-yellow-400',
              strength === 5 && 'text-green-400'
            )}
          >
            {strengthLabel}
          </span>
        )}
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-gray-400">
        <div className={cn(password.length >= 8 && 'text-green-400')}>
          {password.length >= 8 ? '✓' : '○'} 8+ chars
        </div>
        <div className={cn(/[A-Z]/.test(password) && 'text-green-400')}>
          {/[A-Z]/.test(password) ? '✓' : '○'} Uppercase
        </div>
        <div className={cn(/[a-z]/.test(password) && 'text-green-400')}>
          {/[a-z]/.test(password) ? '✓' : '○'} Lowercase
        </div>
        <div className={cn(/[0-9]/.test(password) && 'text-green-400')}>
          {/[0-9]/.test(password) ? '✓' : '○'} Number
        </div>
      </div>
    </div>
  )
}

