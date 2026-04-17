import { distanceLabel, isOpenNow, formatPhone } from '@/lib/geo'

describe('distanceLabel', () => {
  it('returns metres for distances under 1km', () => {
    expect(distanceLabel(120)).toBe('120m')
  })
  it('rounds metres to nearest 10', () => {
    expect(distanceLabel(124)).toBe('120m')
  })
  it('returns km for distances 1000m and over', () => {
    expect(distanceLabel(1500)).toBe('1.5 km')
  })
  it('returns 1 decimal place for km', () => {
    expect(distanceLabel(2340)).toBe('2.3 km')
  })
})

describe('isOpenNow', () => {
  it('returns false for null opening_hours', () => {
    expect(isOpenNow(null)).toBe(false)
  })
  it('returns false for empty opening_hours', () => {
    expect(isOpenNow({})).toBe(false)
  })
  it('returns true when current time is within hours', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-03T10:00:00'))
    const hours = { wed: { open: '08:00', close: '21:00' } }
    expect(isOpenNow(hours)).toBe(true)
    jest.useRealTimers()
  })
  it('returns false when current time is outside hours', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-03T22:00:00'))
    const hours = { wed: { open: '08:00', close: '21:00' } }
    expect(isOpenNow(hours)).toBe(false)
    jest.useRealTimers()
  })
})

describe('formatPhone', () => {
  it('returns null for null input', () => {
    expect(formatPhone(null)).toBe(null)
  })
  it('returns the phone string as-is if already formatted', () => {
    expect(formatPhone('9876543210')).toBe('9876543210')
  })
})
