'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useUser, AVAILABLE_AVATARS } from '@/lib/user-context'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AvatarSelectorModal() {
  const { user, selectAvatar, isAvatarModalOpen, closeAvatarModal } = useUser()

  return (
    <Dialog open={isAvatarModalOpen} onOpenChange={closeAvatarModal}>
      <DialogContent className="sm:max-w-[500px] bg-[rgb(var(--bg-base))] border border-[rgb(var(--surface))]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[rgb(var(--text-primary))]">
            Select Avatar
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-6">
          {AVAILABLE_AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => selectAvatar(avatar.id)}
              className={cn(
                "relative aspect-square rounded-2xl overflow-hidden transition-all duration-200",
                "hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20",
                "border-2",
                user.avatarId === avatar.id 
                  ? "border-green-500 shadow-lg shadow-green-500/30" 
                  : "border-transparent hover:border-purple-500/50"
              )}
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br",
                avatar.bgColor
              )} />
              <div className="relative h-full flex items-center justify-center">
                <span className="text-5xl drop-shadow-lg">
                  {avatar.emoji}
                </span>
              </div>
              {user.avatarId === avatar.id && (
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
  )
}

