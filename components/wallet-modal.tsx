'use client'

import { useState } from 'react'
import { X, Wallet as WalletIcon, Plus, Settings, TrendingUp, TrendingDown, History, CreditCard } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { WalletOverview } from './wallet-modal/wallet-overview'
import { WalletDeposit } from './wallet-modal/wallet-deposit'
import { WalletWithdraw } from './wallet-modal/wallet-withdraw'
import { WalletSettings } from './wallet-modal/wallet-settings'
import { WalletTransactions } from './wallet-modal/wallet-transactions'

export function WalletModal() {
  const { isWalletModalOpen, closeWalletModal, activeWallet } = useWallet()
  const [activeTab, setActiveTab] = useState('overview')

  if (!activeWallet) return null

  return (
    <Dialog open={isWalletModalOpen} onOpenChange={closeWalletModal}>
      <DialogContent 
        className="max-w-4xl h-[90vh] p-0 bg-[#0f0a1f] border border-purple-800/30 shadow-2xl flex flex-col overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Wallet</DialogTitle>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-800/30 bg-[#1a1534]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <WalletIcon className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Wallet</h2>
          </div>
          <button
            onClick={closeWalletModal}
            className="p-2 hover:bg-purple-800/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 bg-[#1a1534]">
          <div className="px-6 pt-4 bg-[#1a1534] flex-shrink-0">
            <TabsList className="grid grid-cols-4 gap-2 bg-[#0f0a1f] p-1 rounded-lg">
              <TabsTrigger value="overview" className="text-xs">
                Overview
              </TabsTrigger>
              <TabsTrigger value="deposit" className="text-xs">
                Deposit
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="text-xs">
                Withdraw
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-[#1a1534] min-h-0">
            <TabsContent value="overview" className="mt-0 h-full">
              <WalletOverview />
            </TabsContent>
            
            <TabsContent value="deposit" className="mt-0 h-full">
              <WalletDeposit />
            </TabsContent>
            
            <TabsContent value="withdraw" className="mt-0 h-full">
              <WalletWithdraw />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0 h-full">
              <WalletSettings />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

