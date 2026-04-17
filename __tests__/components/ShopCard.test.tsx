import { render, screen } from '@testing-library/react'
import { ShopCard } from '@/components/shop/ShopCard'
import { Shop } from '@/lib/types'

const mockShop: Shop = {
  id: '1',
  name: 'Sharma General Store',
  category_id: 'cat-1',
  address: 'Hazratganj',
  phone: '9876543210',
  opening_hours: { mon: { open: '08:00', close: '21:00' } },
  area: 'Hazratganj',
  city: 'Lucknow',
  audio_guide: null,
  rating: 4.8,
  review_count: 42,
  verified: true,
  lat: 26.85,
  lng: 80.94,
  dist_m: 120,
}

describe('ShopCard', () => {
  it('renders shop name', () => {
    render(<ShopCard shop={mockShop} categorySlug="ration" />)
    expect(screen.getByText('Sharma General Store')).toBeInTheDocument()
  })
  it('renders distance label', () => {
    render(<ShopCard shop={mockShop} categorySlug="ration" />)
    expect(screen.getByText(/120m/)).toBeInTheDocument()
  })
  it('renders phone number', () => {
    render(<ShopCard shop={mockShop} categorySlug="ration" />)
    expect(screen.getByText(/9876543210/)).toBeInTheDocument()
  })
})
