'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/user-context'
import { api, UpdateProfileData, Country } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
import { Loader2, Check } from 'lucide-react'
import { generateAccountNumber } from '@/lib/settings-mock-data'

interface AccountSectionProps {
  user: User
  onUpdate: () => Promise<void>
}

export function AccountSection({ user, onUpdate }: AccountSectionProps) {
  // Account Details state
  const [phone, setPhone] = useState('')
  const [isPhoneSubmitting, setIsPhoneSubmitting] = useState(false)
  
  // Personal Details state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('')
  const [birthDate, setBirthDate] = useState('')
  const [isPersonalSubmitting, setIsPersonalSubmitting] = useState(false)
  
  // Address state
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [isAddressSubmitting, setIsAddressSubmitting] = useState(false)
  
  // Load user data
  useEffect(() => {
    if (user) {
      setPhone(user.phone || '')
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setGender((user.gender as 'Male' | 'Female' | 'Other') || '')
      setBirthDate(user.birthDate || '')
      setCountry(user.country || '')
      setCity(user.city || '')
      setAddress(user.address || '')
      setPostalCode(user.postalCode || '')
    }
  }, [user])
  
  // Load countries
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await api.countries.getAll()
        if (response.success && response.data) {
          setCountries(response.data.filter(c => c.isActive))
        }
      } catch (error) {
        console.error('Failed to load countries:', error)
      } finally {
        setIsLoadingCountries(false)
      }
    }
    loadCountries()
  }, [])
  
  // Update phone
  const handlePhoneUpdate = async () => {
    if (!phone.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Phone number is required',
        variant: 'destructive',
      })
      return
    }
    
    setIsPhoneSubmitting(true)
    try {
      const response = await api.players.updateProfile({ phone })
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Phone number updated successfully',
        })
        await onUpdate()
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
  
  // Update personal details
  const handlePersonalUpdate = async () => {
    setIsPersonalSubmitting(true)
    try {
      const updateData: UpdateProfileData = {
        first_name: firstName,
        last_name: lastName,
        gender: gender as 'Male' | 'Female' | 'Other',
        birthday: birthDate,
      }
      
      const response = await api.players.updateProfile(updateData)
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Personal details updated successfully',
        })
        await onUpdate()
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to update personal details',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update personal details',
        variant: 'destructive',
      })
    } finally {
      setIsPersonalSubmitting(false)
    }
  }
  
  // Update address
  const handleAddressUpdate = async () => {
    setIsAddressSubmitting(true)
    try {
      const updateData: UpdateProfileData = {
        country,
        city,
        address,
        postal_code: postalCode,
      }
      
      const response = await api.players.updateProfile(updateData)
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Address updated successfully',
        })
        await onUpdate()
      } else {
        toast({
          title: 'Error',
          description: response.error?.message || 'Failed to update address',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update address',
        variant: 'destructive',
      })
    } finally {
      setIsAddressSubmitting(false)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Account Details Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">Account Details</h2>
        
        <div className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Email</label>
            <div className="flex items-center gap-3">
              <input
                type="email"
                value={user.email}
                readOnly
                className="flex-1 h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] cursor-not-allowed"
              />
              {user.emailVerified ? (
                <div className="px-4 py-2 bg-[rgb(var(--success))] text-white text-sm font-semibold rounded-lg flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Verified
                </div>
              ) : (
                <div className="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg">
                  Not Verified
                </div>
              )}
            </div>
          </div>
          
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Phone Number
            </label>
            <div className="flex items-center gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="flex-1 h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
              <button
                onClick={handlePhoneUpdate}
                disabled={isPhoneSubmitting}
                className="px-6 py-3 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPhoneSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Update
              </button>
            </div>
          </div>
          
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Username</label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] cursor-not-allowed"
            />
          </div>
          
          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Account Number <span className="text-xs text-[rgb(var(--text-muted))]">(Display ID)</span>
            </label>
            <input
              type="text"
              value={generateAccountNumber(user.playerUuid)}
              readOnly
              className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] cursor-not-allowed font-mono"
            />
          </div>
        </div>
      </div>
      
      {/* Personal Details Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">Personal Details</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
            </div>
            
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Date of Birth</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handlePersonalUpdate}
              disabled={isPersonalSubmitting}
              className="px-6 py-3 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPersonalSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Personal Details
            </button>
          </div>
        </div>
      </div>
      
      {/* Address Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <h2 className="text-xl font-bold text-[rgb(var(--text-primary))] mb-6">Address</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isLoadingCountries}
                className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors disabled:opacity-50"
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.iso}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
              />
            </div>
          </div>
          
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
            />
          </div>
          
          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter postal code"
              className="w-full h-12 px-4 bg-[#3d2b5e] border border-[#5d4b7e] rounded-xl text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-disabled))] focus:outline-none focus:border-[rgb(var(--primary))] transition-colors"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleAddressUpdate}
              disabled={isAddressSubmitting}
              className="px-6 py-3 bg-[rgb(var(--primary))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAddressSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Address
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}








