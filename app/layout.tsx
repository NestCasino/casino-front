import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SidebarProvider } from '@/lib/sidebar-context'
import { SearchProvider } from '@/lib/search-context'
import { WalletProvider } from '@/lib/wallet-context'
import { AuthProvider } from '@/lib/auth-context'
import { UserProvider } from '@/lib/user-context'
import { NotificationProvider } from '@/lib/notification-context'
import { WebSocketProvider } from '@/lib/websocket-context'
import { BonusProvider } from '@/lib/bonus-context'
import { CoinNetworksProvider } from '@/lib/coin-networks-context'
import { WalletModal } from '@/components/wallet-modal'
import { AuthModal } from '@/components/auth-modal'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nest Casino - Premium Gaming Experience',
  description: 'Your premium gaming nest - Casino, Sports, and more',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <SidebarProvider>
          <SearchProvider>
            <AuthProvider>
              <CoinNetworksProvider>
                <WalletProvider>
                  <UserProvider>
                    <NotificationProvider>
                      <WebSocketProvider>
                        <BonusProvider>
                          {children}
                          <WalletModal />
                          <AuthModal />
                          <Toaster />
                        </BonusProvider>
                      </WebSocketProvider>
                    </NotificationProvider>
                  </UserProvider>
                </WalletProvider>
              </CoinNetworksProvider>
            </AuthProvider>
          </SearchProvider>
        </SidebarProvider>
        <Analytics />
      </body>
    </html>
  )
}
