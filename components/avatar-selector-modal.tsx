"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser, AVAILABLE_AVATARS } from "@/lib/user-context";
import { Button } from '@/components/ui/button'
import { Check, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { api } from '@/lib/api-client'
import { toast } from 'sonner'

export function AvatarSelectorModal() {
  const { user, selectAvatar, isAvatarModalOpen, closeAvatarModal, loadUserProfile } = useUser()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      const response = await api.players.updateProfile({ avatar: file })
      if (response.success) {
        await loadUserProfile()
        toast.success('Avatar uploaded successfully')
        closeAvatarModal()
      } else {
        toast.error(response.error?.message || 'Failed to upload avatar')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isAvatarModalOpen} onOpenChange={closeAvatarModal}>
      <DialogContent className="sm:max-w-[500px] bg-[rgb(var(--bg-base))] border border-[rgb(var(--surface))]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[rgb(var(--text-primary))]">
            Select Avatar
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-6">
          {/* Custom Upload Option */}
          <button
            onClick={() => document.getElementById("avatar-upload")?.click()}
            className={cn(
              "relative aspect-square rounded-2xl overflow-hidden transition-all duration-200",
              "hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20",
              "border-2 border-dashed border-[rgb(var(--text-secondary))] hover:border-purple-500/50",
              "flex flex-col items-center justify-center gap-2 group"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-[rgb(var(--surface))] flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Upload className="h-5 w-5 text-[rgb(var(--text-secondary))] group-hover:text-purple-500" />
            </div>
            <span className="text-sm font-medium text-[rgb(var(--text-secondary))] group-hover:text-purple-500">
              Upload
            </span>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>

          {AVAILABLE_AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => selectAvatar(avatar.id)}
              className={cn(
                "relative aspect-square rounded-2xl overflow-hidden transition-all duration-200",
                "hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20",
                "border-2",
                user.avatarId === avatar.id && !user.avatar
                  ? "border-green-500 shadow-lg shadow-green-500/30"
                  : "border-transparent hover:border-purple-500/50"
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br",
                  avatar.bgColor
                )}
              />
              <div className="relative h-full flex items-center justify-center">
                <span className="text-5xl drop-shadow-lg">{avatar.emoji}</span>
              </div>
              {user.avatarId === avatar.id && !user.avatar && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={closeAvatarModal}
            className="bg-transparent border-[rgb(var(--surface))] hover:bg-[rgb(var(--surface))]"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
