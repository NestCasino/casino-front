// Wallet Types and Interfaces
import { CoinNetwork } from './api-client'

export type CurrencyType = 'crypto' | 'fiat'

export interface Currency {
  code: string
  name: string
  symbol: string
  icon: string
  type: CurrencyType
  decimals: number
  network?: string // For crypto currencies - backward compatibility
  networkSlug?: string // Maps to backend CoinNetwork slug
  supportedNetworks?: string[] // For multi-network currencies (e.g., USDT)
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
    networkSlug: 'bitcoin',
  },
  {
    code: 'ETH',
    name: 'Ethereum',
    symbol: 'Ξ',
    icon: '💎',
    type: 'crypto',
    decimals: 8,
    network: 'Ethereum',
    networkSlug: 'ethereum',
  },
  {
    code: 'USDT',
    name: 'Tether',
    symbol: '₮',
    icon: '💚',
    type: 'crypto',
    decimals: 2,
    network: 'ERC-20',
    networkSlug: 'erc-20',
    supportedNetworks: ['ERC-20', 'TRC-20', 'BEP-20'], // Multi-network support
  },
  {
    code: 'USDC',
    name: 'USD Coin',
    symbol: 'USDC',
    icon: '🔵',
    type: 'crypto',
    decimals: 2,
    network: 'ERC-20',
    networkSlug: 'erc-20',
    supportedNetworks: ['ERC-20', 'TRC-20', 'BEP-20'], // Multi-network support
  },
  {
    code: 'LTC',
    name: 'Litecoin',
    symbol: 'Ł',
    icon: '⚡',
    type: 'crypto',
    decimals: 8,
    network: 'Litecoin',
    networkSlug: 'litecoin',
  },
  {
    code: 'BCH',
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    icon: '💚',
    type: 'crypto',
    decimals: 8,
    network: 'Bitcoin Cash',
    networkSlug: 'bitcoin-cash',
  },
  {
    code: 'DOGE',
    name: 'Dogecoin',
    symbol: 'Ð',
    icon: '🐕',
    type: 'crypto',
    decimals: 8,
    network: 'Dogecoin',
    networkSlug: 'dogecoin',
  },
  {
    code: 'XRP',
    name: 'Ripple',
    symbol: 'XRP',
    icon: '💧',
    type: 'crypto',
    decimals: 6,
    network: 'XRP Ledger',
    networkSlug: 'xrp-ledger',
  },
  {
    code: 'TRX',
    name: 'Tron',
    symbol: 'TRX',
    icon: '🔴',
    type: 'crypto',
    decimals: 6,
    network: 'Tron',
    networkSlug: 'tron',
  },
  {
    code: 'SOL',
    name: 'Solana',
    symbol: 'SOL',
    icon: '🟣',
    type: 'crypto',
    decimals: 9,
    network: 'Solana',
    networkSlug: 'solana',
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

// Network fee helper functions
export function getNetworkFee(networkSlug: string, networks: CoinNetwork[]): number | null {
  const network = networks.find((n) => n.slug === networkSlug)
  return network ? network.baseFee : null
}

export function getNetworkBySlug(networkSlug: string, networks: CoinNetwork[]): CoinNetwork | null {
  return networks.find((n) => n.slug === networkSlug) || null
}

export function getNetworksByNames(networkNames: string[], networks: CoinNetwork[]): CoinNetwork[] {
  return networks.filter((n) => networkNames.includes(n.name))
}

// Backend-to-Frontend Type Mappers

export interface BackendWallet {
  id: string
  playerId: string
  currency: string
  walletType: 'crypto' | 'fiat'
  balance: number
  bonusBalance: number
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BackendTransaction {
  id: string
  walletId: string
  playerId: string
  type: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  bonusBalanceBefore: number
  bonusBalanceAfter: number
  status: string
  currency: string
  txid: string | null
  provider: string | null
  metadata: any
  createdAt: string
}

/**
 * Maps backend wallet data to frontend wallet format
 */
export function mapBackendWalletToFrontend(backendWallet: BackendWallet): Wallet | null {
  const currency = getCurrencyByCode(backendWallet.currency)
  
  if (!currency) {
    console.warn(`Unknown currency code: ${backendWallet.currency}`)
    return null
  }

  return {
    id: String(backendWallet.id), // Ensure ID is always a string
    currency,
    balance: Number(backendWallet.balance),
    lockedBalance: Number(backendWallet.bonusBalance),
    isDefault: backendWallet.isDefault,
    createdAt: backendWallet.createdAt,
  }
}

/**
 * Generate a human-readable description for a transaction
 */
function generateTransactionDescription(type: string, amount: number, currency: string): string {
  const formattedAmount = formatBalance(amount, currency)
  
  switch (type.toLowerCase()) {
    case 'deposit':
    case 'manual_deposit':
      return `Deposited ${formattedAmount}`
    case 'withdraw':
    case 'manual_withdraw':
      return `Withdrew ${formattedAmount}`
    case 'bet':
      return `Bet placed ${formattedAmount}`
    case 'win':
      return `Win ${formattedAmount}`
    case 'bonus_credit':
      return `Bonus credited ${formattedAmount}`
    case 'bonus_release':
      return `Bonus released ${formattedAmount}`
    case 'bonus_forfeit':
      return `Bonus forfeited ${formattedAmount}`
    case 'refund':
      return `Refund ${formattedAmount}`
    default:
      return `Transaction ${formattedAmount}`
  }
}

/**
 * Map backend transaction type to frontend type
 */
function mapTransactionType(backendType: string): Transaction['type'] {
  const type = backendType.toLowerCase()
  
  if (type.includes('deposit')) return 'deposit'
  if (type.includes('withdraw')) return 'withdraw'
  if (type === 'bet') return 'bet'
  if (type === 'win') return 'win'
  if (type.includes('bonus')) return 'bonus'
  
  return 'deposit' // default fallback
}

/**
 * Map backend transaction status to frontend status
 */
function mapTransactionStatus(backendStatus: string): Transaction['status'] {
  const status = backendStatus.toLowerCase()
  
  if (status === 'completed') return 'completed'
  if (status === 'pending' || status === 'confirming' || status === 'init') return 'pending'
  if (status === 'failed' || status === 'expired') return 'failed'
  if (status === 'cancelled' || status === 'refunded') return 'cancelled'
  
  return 'pending' // default fallback
}

/**
 * Maps backend transaction data to frontend transaction format
 */
export function mapBackendTransactionToFrontend(backendTx: BackendTransaction): Transaction {
  return {
    id: backendTx.id,
    walletId: backendTx.walletId,
    type: mapTransactionType(backendTx.type),
    amount: Number(backendTx.amount),
    currency: backendTx.currency,
    status: mapTransactionStatus(backendTx.status),
    timestamp: backendTx.createdAt,
    description: generateTransactionDescription(backendTx.type, backendTx.amount, backendTx.currency),
    txHash: backendTx.txid || undefined,
  }
}

