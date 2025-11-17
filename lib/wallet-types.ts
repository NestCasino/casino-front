// Wallet Types and Interfaces

export type CurrencyType = 'crypto' | 'fiat'

export interface Currency {
  code: string
  name: string
  symbol: string
  icon: string
  type: CurrencyType
  decimals: number
  network?: string // For crypto currencies
}

export interface Wallet {
  id: string
  currency: Currency
  balance: number
  lockedBalance: number
  isDefault: boolean
  createdAt: string
}

export interface Transaction {
  id: string
  walletId: string
  type: 'deposit' | 'withdraw' | 'bet' | 'win' | 'bonus'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  timestamp: string
  description: string
  txHash?: string // For crypto transactions
  confirmations?: number
  requiredConfirmations?: number
  network?: string
}

export interface WalletSettings {
  hideZeroBalances: boolean
  displayCryptoInFiat: boolean
  preferredFiatCurrency: string
}

// Available currencies
export const AVAILABLE_CURRENCIES: Currency[] = [
  // Fiat Currencies
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    icon: '$',
    type: 'fiat',
    decimals: 2,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    icon: '€',
    type: 'fiat',
    decimals: 2,
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    icon: 'C$',
    type: 'fiat',
    decimals: 2,
  },
  {
    code: 'RUB',
    name: 'Russian Ruble',
    symbol: '₽',
    icon: '₽',
    type: 'fiat',
    decimals: 2,
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    icon: '¥',
    type: 'fiat',
    decimals: 0,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    icon: '£',
    type: 'fiat',
    decimals: 2,
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    icon: 'A$',
    type: 'fiat',
    decimals: 2,
  },
  {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    icon: 'NZ$',
    type: 'fiat',
    decimals: 2,
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    icon: '₹',
    type: 'fiat',
    decimals: 2,
  },
  {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    icon: '₩',
    type: 'fiat',
    decimals: 0,
  },
  
  // Crypto Currencies
  {
    code: 'BTC',
    name: 'Bitcoin',
    symbol: '₿',
    icon: '🟠',
    type: 'crypto',
    decimals: 8,
    network: 'Bitcoin',
  },
  {
    code: 'ETH',
    name: 'Ethereum',
    symbol: 'Ξ',
    icon: '💎',
    type: 'crypto',
    decimals: 8,
    network: 'Ethereum',
  },
  {
    code: 'USDT',
    name: 'Tether',
    symbol: '₮',
    icon: '💚',
    type: 'crypto',
    decimals: 2,
    network: 'ERC-20',
  },
  {
    code: 'USDC',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '🔵',
    type: 'crypto',
    decimals: 2,
    network: 'ERC-20',
  },
  {
    code: 'LTC',
    name: 'Litecoin',
    symbol: 'Ł',
    icon: '⚡',
    type: 'crypto',
    decimals: 8,
    network: 'Litecoin',
  },
  {
    code: 'BCH',
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    icon: '💚',
    type: 'crypto',
    decimals: 8,
    network: 'Bitcoin Cash',
  },
  {
    code: 'DOGE',
    name: 'Dogecoin',
    symbol: 'Ð',
    icon: '🐕',
    type: 'crypto',
    decimals: 8,
    network: 'Dogecoin',
  },
  {
    code: 'XRP',
    name: 'Ripple',
    symbol: 'XRP',
    icon: '💧',
    type: 'crypto',
    decimals: 6,
    network: 'XRP Ledger',
  },
  {
    code: 'TRX',
    name: 'Tron',
    symbol: 'TRX',
    icon: '🔴',
    type: 'crypto',
    decimals: 6,
    network: 'Tron',
  },
  {
    code: 'SOL',
    name: 'Solana',
    symbol: 'SOL',
    icon: '🟣',
    type: 'crypto',
    decimals: 9,
    network: 'Solana',
  },
]

// Helper functions
export function getCurrencyByCode(code: string): Currency | undefined {
  return AVAILABLE_CURRENCIES.find((c) => c.code === code)
}

export function formatCurrency(amount: number, currency: Currency): string {
  return `${currency.symbol}${amount.toFixed(currency.decimals)}`
}

export function formatBalance(amount: number, currencyCode: string): string {
  const currency = getCurrencyByCode(currencyCode)
  if (!currency) return `${amount}`
  return formatCurrency(amount, currency)
}

