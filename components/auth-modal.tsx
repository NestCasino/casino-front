'use client'

import { useAuth } from '@/lib/auth-context'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from './auth-forms/login-form'
import { RegisterForm } from './auth-forms/register-form'
import { ForgotPasswordForm } from './auth-forms/forgot-password-form'
import { X } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal } = useAuth()

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="!max-w-[900px] w-[95vw] p-0 bg-[#1a0b33] border-gray-800 overflow-hidden h-auto max-h-[95vh]">
        <VisuallyHidden>
          <DialogTitle>Authentication</DialogTitle>
        </VisuallyHidden>

        <div className="grid md:grid-cols-[40%_60%] h-auto">
          {/* Left Side - Branding */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-8 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-4">
              <div className="text-5xl font-bold italic bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                Nest
              </div>
              
              <h2 className="text-2xl font-bold text-white">
                Welcome Bonus
                <br />
                <span className="text-4xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  UP TO 590%
                </span>
              </h2>
              
              <div className="text-purple-200 text-base">
                + 225 Free Spins
              </div>

              {/* Mascot/Character placeholder */}
              <div className="mt-4">
                <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-2xl">
                  <span className="text-7xl">🦝</span>
                </div>
              </div>

              <div className="text-xs text-purple-200 mt-4 space-y-1.5">
                <p>✨ Instant withdrawals</p>
                <p>🎮 10,000+ casino games</p>
                <p>🏆 Daily tournaments & prizes</p>
              </div>
            </div>
          </div>

          {/* Right Side - Forms */}
          <div className="p-6 md:px-12 md:py-8 flex flex-col overflow-auto">
            {authModalTab === 'forgot-password' ? (
              <div className="space-y-4">
                <ForgotPasswordForm onBackToLogin={() => openAuthModal('login')} />
              </div>
            ) : (
              <Tabs value={authModalTab} onValueChange={(value) => openAuthModal(value as 'login' | 'register')} className="flex flex-col">
                <TabsList className="grid w-full grid-cols-2 bg-[#2d1b4e] p-1 mb-4 flex-shrink-0">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 font-semibold"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 font-semibold"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Welcome back!</h3>
                      <p className="text-gray-400 text-sm">
                        Login to continue your winning streak
                      </p>
                    </div>
                    <LoginForm />
                  </div>
                </TabsContent>

                <TabsContent value="register" className="mt-0">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Create Account</h3>
                      <p className="text-gray-400 text-sm">
                        Join now and claim your welcome bonus
                      </p>
                    </div>
                    <RegisterForm />
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

