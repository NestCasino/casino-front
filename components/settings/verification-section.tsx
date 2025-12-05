'use client'

import { useState } from 'react'
import { User } from '@/lib/user-context'
import { api, UpdateProfileData } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react'

interface VerificationSectionProps {
  user: User
  onUpdate: () => Promise<void>
}

export function VerificationSection({ user, onUpdate }: VerificationSectionProps) {
  const [kycFiles, setKycFiles] = useState<{
    kyc_front?: File
    kyc_back?: File
    kyc_selfie?: File
    kyc_address?: File
    kyc_payment?: File
  }>({})
  const [isKycSubmitting, setIsKycSubmitting] = useState(false)
  
  // Helper to render KYC status badge
  const renderKycStatusBadge = (status?: string) => {
    if (!status || status === 'none') {
      return (
        <div className="px-4 py-2 bg-[rgb(var(--text-muted))] text-white text-sm font-bold rounded-lg">
          Not Submitted
        </div>
      )
    }
    if (status === 'pending') {
      return (
        <div className="px-4 py-2 bg-yellow-500 text-white text-sm font-bold rounded-lg">
          Pending Review
        </div>
      )
    }
    if (status === 'confirmed') {
      return (
        <div className="px-4 py-2 bg-[rgb(var(--success))] text-white text-sm font-bold rounded-lg">
          Verified
        </div>
      )
    }
    if (status === 'rejected') {
      return (
        <div className="px-4 py-2 bg-[rgb(var(--error))] text-white text-sm font-bold rounded-lg">
          Rejected
        </div>
      )
    }
    return null
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
        setKycFiles(prev => ({
          ...prev,
          kyc_front: undefined,
          kyc_back: undefined,
          kyc_selfie: undefined,
        }))
        await onUpdate()
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
        await onUpdate()
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
  
  // Payment verification upload handler (mock)
  const handlePaymentProofUpload = () => {
    toast({
      title: 'Demo Feature',
      description: 'Payment verification document uploaded. This is demo data only.',
      duration: 3000,
    })
    setKycFiles(prev => ({ ...prev, kyc_payment: undefined }))
  }
  
  return (
    <div className="space-y-6">
      {/* Identity Verification Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[rgb(var(--text-primary))]">Identity</h2>
          {renderKycStatusBadge(user.kycStatus)}
        </div>
        
        <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
          Passport, driver's license, or other official document replacing them.
        </p>
        
        {(user.kycStatus === 'pending' || user.kycStatus === 'confirmed') ? (
          <div className="p-6 bg-[#3d2b5e] rounded-xl border border-[#5d4b7e]">
            <p className="text-sm text-[rgb(var(--text-primary))] mb-2 font-semibold">
              {user.kycStatus === 'pending' ? 'Your documents are under review' : 'Your identity is verified'}
            </p>
            <p className="text-sm text-[rgb(var(--text-muted))]">
              {user.kycStatus === 'pending' 
                ? 'We will notify you once the review is complete.'
                : 'Thank you for completing verification.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ID Front */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                ID Front <span className="text-[rgb(var(--error))]">*</span>
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange('kyc_front', e.target.files?.[0] || null)}
                className="hidden"
                id="kyc_front"
              />
              <label
                htmlFor="kyc_front"
                className="flex items-center justify-center gap-2 w-full h-32 bg-[#3d2b5e] border-2 border-dashed border-[#5d4b7e] rounded-xl cursor-pointer hover:border-[rgb(var(--primary))] transition-colors"
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
                    <p className="text-sm text-[rgb(var(--text-primary))]">Click to upload or drag and drop</p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">SVG, PNG, JPG (max 30MB)</p>
                  </div>
                )}
              </label>
            </div>
            
            {/* ID Back */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                ID Back <span className="text-[rgb(var(--error))]">*</span>
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange('kyc_back', e.target.files?.[0] || null)}
                className="hidden"
                id="kyc_back"
              />
              <label
                htmlFor="kyc_back"
                className="flex items-center justify-center gap-2 w-full h-32 bg-[#3d2b5e] border-2 border-dashed border-[#5d4b7e] rounded-xl cursor-pointer hover:border-[rgb(var(--primary))] transition-colors"
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
                    <p className="text-sm text-[rgb(var(--text-primary))]">Click to upload or drag and drop</p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">SVG, PNG, JPG (max 30MB)</p>
                  </div>
                )}
              </label>
            </div>
            
            {/* Selfie with ID */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Selfie with ID <span className="text-[rgb(var(--error))]">*</span>
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange('kyc_selfie', e.target.files?.[0] || null)}
                className="hidden"
                id="kyc_selfie"
              />
              <label
                htmlFor="kyc_selfie"
                className="flex items-center justify-center gap-2 w-full h-32 bg-[#3d2b5e] border-2 border-dashed border-[#5d4b7e] rounded-xl cursor-pointer hover:border-[rgb(var(--primary))] transition-colors"
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
                    <p className="text-sm text-[rgb(var(--text-primary))]">Click to upload or drag and drop</p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">SVG, PNG, JPG (max 30MB)</p>
                  </div>
                )}
              </label>
            </div>
            
            <button
              onClick={handleKycIdUpload}
              disabled={!kycFiles.kyc_front || !kycFiles.kyc_back || !kycFiles.kyc_selfie || isKycSubmitting}
              className="w-full px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isKycSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isKycSubmitting ? 'Uploading...' : 'Submit ID Documents'}
            </button>
          </div>
        )}
      </div>
      
      {/* Address Proof Section */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[rgb(var(--text-primary))]">Address</h2>
          {renderKycStatusBadge(user.addressProofStatus)}
        </div>
        
        <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
          Utility bill, bank statement, or any other official document that contains your full name and address.
        </p>
        
        {(user.addressProofStatus === 'pending' || user.addressProofStatus === 'confirmed') ? (
          <div className="p-6 bg-[#3d2b5e] rounded-xl border border-[#5d4b7e]">
            <p className="text-sm text-[rgb(var(--text-primary))] mb-2 font-semibold">
              {user.addressProofStatus === 'pending' ? 'Your address proof is under review' : 'Your address is verified'}
            </p>
            <p className="text-sm text-[rgb(var(--text-muted))]">
              {user.addressProofStatus === 'pending' 
                ? 'We will notify you once the review is complete.'
                : 'Thank you for completing address verification.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Address Proof Document <span className="text-[rgb(var(--error))]">*</span>
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => handleFileChange('kyc_address', e.target.files?.[0] || null)}
                className="hidden"
                id="kyc_address"
              />
              <label
                htmlFor="kyc_address"
                className="flex items-center justify-center gap-2 w-full h-32 bg-[#3d2b5e] border-2 border-dashed border-[#5d4b7e] rounded-xl cursor-pointer hover:border-[rgb(var(--primary))] transition-colors"
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
                    <p className="text-sm text-[rgb(var(--text-primary))]">Click to upload or drag and drop</p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">SVG, PNG, JPG (max 30MB)</p>
                  </div>
                )}
              </label>
            </div>
            
            <button
              onClick={handleAddressProofUpload}
              disabled={!kycFiles.kyc_address || isKycSubmitting}
              className="w-full px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isKycSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isKycSubmitting ? 'Uploading...' : 'Submit Address Proof'}
            </button>
          </div>
        )}
      </div>
      
      {/* Payment Verification Section (Demo) */}
      <div className="bg-[#2a1b47] rounded-2xl p-8 border-l-4 border-[rgb(var(--primary))]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[rgb(var(--text-primary))]">Payment</h2>
          <div className="px-4 py-2 bg-[rgb(var(--text-muted))] text-white text-sm font-bold rounded-lg">
            Not Submitted
          </div>
        </div>
        
        <div className="p-3 bg-[#3d2b5e] rounded-lg border border-[#5d4b7e] flex items-center gap-2 mb-6">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <p className="text-xs text-[rgb(var(--text-muted))]">
            This is demo functionality. Payment verification is not yet implemented.
          </p>
        </div>
        
        <p className="text-sm text-[rgb(var(--text-muted))] mb-6">
          Bank statement, or any other official document that confirms the source of your funds.
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Payment Proof Document <span className="text-[rgb(var(--error))]">*</span>
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange('kyc_payment', e.target.files?.[0] || null)}
              className="hidden"
              id="kyc_payment"
            />
            <label
              htmlFor="kyc_payment"
              className="flex items-center justify-center gap-2 w-full h-32 bg-[#3d2b5e] border-2 border-dashed border-[#5d4b7e] rounded-xl cursor-pointer hover:border-[rgb(var(--primary))] transition-colors"
            >
              {kycFiles.kyc_payment ? (
                <div className="text-center">
                  <FileText className="h-8 w-8 text-[rgb(var(--primary))] mx-auto mb-2" />
                  <p className="text-sm text-[rgb(var(--text-primary))]">{kycFiles.kyc_payment.name}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">
                    {(kycFiles.kyc_payment.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 text-[rgb(var(--text-muted))] mx-auto mb-2" />
                  <p className="text-sm text-[rgb(var(--text-primary))]">Click to upload or drag and drop</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">SVG, PNG, JPG (max 30MB)</p>
                </div>
              )}
            </label>
          </div>
          
          <button
            onClick={handlePaymentProofUpload}
            disabled={!kycFiles.kyc_payment}
            className="w-full px-6 py-3 bg-[rgb(var(--success))] hover:brightness-110 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Payment Proof
          </button>
        </div>
      </div>
    </div>
  )
}








