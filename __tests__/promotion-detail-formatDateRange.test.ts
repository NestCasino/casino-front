import { formatDateRange } from '@/app/promotions/[id]/page'

describe('formatDateRange', () => {
  it('formats ISO date strings into "Month D, YYYY" format in en-US locale', () => {
    expect(formatDateRange('2025-11-20T09:00:00')).toBe('November 20, 2025')
    expect(formatDateRange('2025-01-05T00:00:00')).toBe('January 5, 2025')
  })

  it('handles different times on the same day consistently', () => {
    const morning = formatDateRange('2025-11-20T09:00:00')
    const evening = formatDateRange('2025-11-20T21:30:00')

    expect(morning).toBe('November 20, 2025')
    expect(evening).toBe('November 20, 2025')
  })
})