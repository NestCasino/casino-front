// Game Types
export interface Game {
  id: number
  gameId: string
  gameTitle: string
  slug: string
  image: string | null
  providerId: number | null
  categoryId: number | null
  providerSlug: string | null
  categorySlug: string | null
  isMobile: boolean
  isDesktop: boolean
  isLive: boolean
  isTrending: boolean
  hasDemo: boolean
  isRestricted: boolean
}

export interface GamesResponse {
  data: Game[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export interface GameQueryParams {
  page?: number
  perPage?: number
  device?: 'mobile' | 'desktop'
  providerId?: number
  categoryId?: number
  search?: string
  isLive?: boolean
  isTrending?: boolean
  showAvailablesOnly?: boolean
  sortBy?: 'sortOrder' | 'gameTitle' | 'launched' | 'popularity'
  sortOrder?: 'ASC' | 'DESC'
}

// Category Types
export interface Category {
  id: number
  slug: string
  title: string
  image: string | null
  isActive: boolean
  sortOrder: number
}

// Provider Types
export interface Provider {
  id: number
  slug: string
  title: string
  image: string | null
  isActive: boolean
  sortOrder: number
}

// Filter Types
export interface GameFilters {
  categoryId?: number
  providerId?: number
  search?: string
  page?: number
  perPage?: number
  isTrending?: boolean
  isLive?: boolean
}

