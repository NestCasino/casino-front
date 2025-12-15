// Mock data generation utilities for Settings page demo features

export interface MockSession {
  id: string
  device: string
  os: string
  browser: string
  ip: string
  location: string
  loginTime: string
  status: 'active' | 'closed'
}

export interface MockCasinoHistory {
  id: string
  date: string
  game: string
  betAmount: number
  winAmount: number
  currency: string
  status: 'win' | 'loss' | 'pending'
}

export interface MockSportsHistory {
  id: string
  date: string
  event: string
  betType: string
  odds: number
  stake: number
  return: number
  currency: string
  status: 'won' | 'lost' | 'pending' | 'void'
}

export interface MockBonusHistory {
  id: string
  date: string
  bonusType: string
  amount: number
  currency: string
  status: 'active' | 'completed' | 'expired' | 'cancelled'
  expiry: string
}

/**
 * Generate a display-friendly account number from playerUuid
 */
export function generateAccountNumber(playerUuid: string): string {
  return `#${playerUuid.slice(0, 8).toUpperCase()}`
}

/**
 * Generate mock active sessions
 */
export function generateMockSessions(): MockSession[] {
  const now = new Date()
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
  
  return [
    {
      id: 'session-1',
      device: 'Windows PC',
      os: 'Windows NT 10.0',
      browser: 'Chrome 120.0',
      ip: '87.253.45.66',
      location: 'Georgia, Tbilisi',
      loginTime: now.toISOString(),
      status: 'active'
    },
    {
      id: 'session-2',
      device: 'Windows PC',
      os: 'Windows NT 10.0',
      browser: 'Chrome 119.0',
      ip: '87.253.45.66',
      location: 'Georgia, Tbilisi',
      loginTime: threeDaysAgo.toISOString(),
      status: 'closed'
    }
  ]
}

/**
 * Generate mock casino game history
 */
export function generateMockCasinoHistory(): MockCasinoHistory[] {
  const now = new Date()
  
  return [
    {
      id: 'casino-1',
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      game: 'Sweet Bonanza',
      betAmount: 50,
      winAmount: 125.50,
      currency: 'USD',
      status: 'win'
    },
    {
      id: 'casino-2',
      date: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      game: 'Book of Dead',
      betAmount: 100,
      winAmount: 0,
      currency: 'USD',
      status: 'loss'
    },
    {
      id: 'casino-3',
      date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      game: 'Starburst',
      betAmount: 25,
      winAmount: 87.75,
      currency: 'USD',
      status: 'win'
    },
    {
      id: 'casino-4',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      game: 'Gonzo\'s Quest',
      betAmount: 75,
      winAmount: 0,
      currency: 'USD',
      status: 'loss'
    },
    {
      id: 'casino-5',
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      game: 'Mega Moolah',
      betAmount: 200,
      winAmount: 450,
      currency: 'USD',
      status: 'win'
    }
  ]
}

/**
 * Generate mock sports betting history
 */
export function generateMockSportsHistory(): MockSportsHistory[] {
  const now = new Date()
  
  return [
    {
      id: 'sports-1',
      date: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      event: 'Manchester United vs Liverpool',
      betType: 'Match Winner',
      odds: 2.50,
      stake: 100,
      return: 250,
      currency: 'USD',
      status: 'won'
    },
    {
      id: 'sports-2',
      date: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      event: 'Real Madrid vs Barcelona',
      betType: 'Over 2.5 Goals',
      odds: 1.85,
      stake: 50,
      return: 0,
      currency: 'USD',
      status: 'lost'
    },
    {
      id: 'sports-3',
      date: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      event: 'Lakers vs Warriors',
      betType: 'Point Spread',
      odds: 1.95,
      stake: 75,
      return: 146.25,
      currency: 'USD',
      status: 'won'
    },
    {
      id: 'sports-4',
      date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      event: 'Bayern Munich vs Dortmund',
      betType: 'Both Teams to Score',
      odds: 1.70,
      stake: 100,
      return: 0,
      currency: 'USD',
      status: 'lost'
    },
    {
      id: 'sports-5',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      event: 'Juventus vs Inter Milan',
      betType: 'Match Winner',
      odds: 3.20,
      stake: 50,
      return: 0,
      currency: 'USD',
      status: 'pending'
    }
  ]
}

/**
 * Generate mock bonus history
 */
export function generateMockBonusHistory(): MockBonusHistory[] {
  const now = new Date()
  
  return [
    {
      id: 'bonus-1',
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      bonusType: 'Welcome Bonus',
      amount: 100,
      currency: 'USD',
      status: 'active',
      expiry: new Date(now.getTime() + 29 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bonus-2',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      bonusType: 'Free Spins',
      amount: 50,
      currency: 'USD',
      status: 'completed',
      expiry: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bonus-3',
      date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      bonusType: 'Reload Bonus',
      amount: 75,
      currency: 'USD',
      status: 'completed',
      expiry: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bonus-4',
      date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      bonusType: 'Cashback',
      amount: 25,
      currency: 'USD',
      status: 'expired',
      expiry: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'bonus-5',
      date: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      bonusType: 'VIP Bonus',
      amount: 200,
      currency: 'USD',
      status: 'cancelled',
      expiry: new Date(now.getTime() - 38 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
}

/**
 * Generate a random base32 secret key for 2FA
 */
export function generate2FASecret(): string {
  const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  for (let i = 0; i < 32; i++) {
    secret += base32chars[Math.floor(Math.random() * base32chars.length)]
  }
  return secret
}

/**
 * Generate a mock QR code data URL for 2FA
 */
export function generate2FAQRCode(username: string, secret: string): string {
  // In a real implementation, this would generate a proper QR code
  // For demo purposes, we'll return a placeholder
  const otpauthUrl = `otpauth://totp/Casino:${username}?secret=${secret}&issuer=Casino`
  // This is a mock - in production you'd use a QR code library
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">QR Code</text>
      <text x="100" y="120" text-anchor="middle" font-size="8" fill="gray">Scan with Auth App</text>
    </svg>
  `)}`
}

















