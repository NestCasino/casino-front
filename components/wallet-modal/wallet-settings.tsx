'use client'

import { Shield, Eye, EyeOff } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { AVAILABLE_CURRENCIES } from '@/lib/wallet-types'

const fiatCurrencies = AVAILABLE_CURRENCIES.filter((c) => c.type === 'fiat')

export function WalletSettings() {
  const { settings, updateSettings } = useWallet()

  return (
    <div className="space-y-6">
      {/* Display Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">
          Display Preferences
        </h3>
        
        {/* Hide Zero Balances */}
        <div className="flex items-center justify-between p-4 bg-[rgb(var(--bg-base))] rounded-lg border border-[rgb(var(--surface))]">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-[rgb(var(--text-muted))] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[rgb(var(--text-primary))]">
                Hide Zero Balances
              </h4>
              <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
                Your zero balances won't appear in your wallet
              </p>
            </div>
          </div>
          <Switch
            checked={settings.hideZeroBalances}
            onCheckedChange={(checked) => updateSettings({ hideZeroBalances: checked })}
          />
        </div>

        {/* Display Crypto in Fiat */}
        <div className="flex items-center justify-between p-4 bg-[rgb(var(--bg-base))] rounded-lg border border-[rgb(var(--surface))]">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-[rgb(var(--text-muted))] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[rgb(var(--text-primary))]">
                Display Crypto in Fiat
              </h4>
              <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
                All bets & transactions will be displayed in the crypto equivalent
              </p>
            </div>
          </div>
          <Switch
            checked={settings.displayCryptoInFiat}
            onCheckedChange={(checked) => updateSettings({ displayCryptoInFiat: checked })}
          />
        </div>
      </div>

      {/* Preferred Fiat Currency */}
      {settings.displayCryptoInFiat && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">
            Select Preferred Fiat Currency
          </h3>
          
          <div className="grid grid-cols-4 gap-2">
            {fiatCurrencies.slice(0, 12).map((currency) => (
              <button
                key={currency.code}
                onClick={() => updateSettings({ preferredFiatCurrency: currency.code })}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  settings.preferredFiatCurrency === currency.code
                    ? 'bg-[rgb(var(--primary))]/10 border-[rgb(var(--primary))]'
                    : 'bg-[rgb(var(--bg-base))] border-[rgb(var(--surface))] hover:border-[rgb(var(--primary))]/50'
                }`}
              >
                <div className="text-xl mb-1">{currency.icon}</div>
                <div className="text-xs font-semibold text-[rgb(var(--text-primary))]">
                  {currency.code}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Security */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">
          Security
        </h3>
        
        <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 border border-[rgb(var(--surface))]">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="h-5 w-5 text-[rgb(var(--text-muted))] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[rgb(var(--text-primary))]">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
                Improve your account security with Two-Factor Authentication
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Enable 2FA
          </Button>
        </div>

        <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 border border-[rgb(var(--surface))]">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="h-5 w-5 text-[rgb(var(--text-muted))] mt-0.5" />
            <div>
              <h4 className="font-semibold text-[rgb(var(--text-primary))]">
                Withdrawal Whitelist
              </h4>
              <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
                Only allow withdrawals to pre-approved addresses
              </p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Manage Whitelist
          </Button>
        </div>
      </div>

      {/* Session Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">
          Session Management
        </h3>
        
        <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 border border-[rgb(var(--surface))]">
          <p className="text-sm text-[rgb(var(--text-muted))] mb-4">
            Log out from all devices except this one
          </p>
          <Button variant="outline" className="w-full">
            End All Other Sessions
          </Button>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[rgb(var(--text-primary))]">
          Advanced Settings
        </h3>
        
        <div className="bg-[rgb(var(--bg-base))] rounded-lg p-4 border border-[rgb(var(--surface))]">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[rgb(var(--text-muted))]">Default Network Fee</span>
              <span className="font-semibold text-[rgb(var(--text-primary))]">Standard</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[rgb(var(--text-muted))]">Transaction Timeout</span>
              <span className="font-semibold text-[rgb(var(--text-primary))]">30 minutes</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[rgb(var(--text-muted))]">Auto-lock Wallet</span>
              <span className="font-semibold text-[rgb(var(--text-primary))]">15 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

