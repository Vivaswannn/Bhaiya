import { Shop } from './types'

export const DEMO_SHOPS: Shop[] = [
  {
    id: 'demo-1',
    name: 'Ram Lal Kirana Store',
    category_id: null,
    address: 'Hazratganj Market',
    phone: '+91 94150 12345',
    opening_hours: {
      mon: { open: '07:00', close: '21:00' }, tue: { open: '07:00', close: '21:00' },
      wed: { open: '07:00', close: '21:00' }, thu: { open: '07:00', close: '21:00' },
      fri: { open: '07:00', close: '21:00' }, sat: { open: '07:00', close: '21:00' },
    },
    area: 'Hazratganj', city: 'Lucknow', audio_guide: null,
    rating: 4.2, review_count: 18, verified: true, lat: 26.8467, lng: 80.9462, dist_m: 320,
  },
  {
    id: 'demo-2',
    name: 'Shyam Sabzi Wale',
    category_id: null,
    address: 'Gomti Nagar Crossing',
    phone: '+91 98390 55432',
    opening_hours: {
      mon: { open: '06:00', close: '13:00' }, tue: { open: '06:00', close: '13:00' },
      wed: { open: '06:00', close: '13:00' }, thu: { open: '06:00', close: '13:00' },
      fri: { open: '06:00', close: '13:00' }, sat: { open: '06:00', close: '13:00' },
      sun: { open: '06:00', close: '11:00' },
    },
    area: 'Gomti Nagar', city: 'Lucknow', audio_guide: null,
    rating: 4.5, review_count: 34, verified: true, lat: 26.852, lng: 80.999, dist_m: 680,
  },
  {
    id: 'demo-3',
    name: 'Gopal Dairy',
    category_id: null,
    address: 'Near Indira Nagar Chowk',
    phone: '+91 75231 88901',
    opening_hours: {
      mon: { open: '05:30', close: '10:00' }, tue: { open: '05:30', close: '10:00' },
      wed: { open: '05:30', close: '10:00' }, thu: { open: '05:30', close: '10:00' },
      fri: { open: '05:30', close: '10:00' }, sat: { open: '05:30', close: '10:00' },
      sun: { open: '05:30', close: '09:00' },
    },
    area: 'Indira Nagar', city: 'Lucknow', audio_guide: null,
    rating: 4.0, review_count: 12, verified: false, lat: 26.875, lng: 81.002, dist_m: 1100,
  },
  {
    id: 'demo-4',
    name: 'City Medical Store',
    category_id: null,
    address: 'Alambagh, Near Bus Stand',
    phone: '+91 52220 44321',
    opening_hours: {
      mon: { open: '08:00', close: '22:00' }, tue: { open: '08:00', close: '22:00' },
      wed: { open: '08:00', close: '22:00' }, thu: { open: '08:00', close: '22:00' },
      fri: { open: '08:00', close: '22:00' }, sat: { open: '08:00', close: '22:00' },
      sun: { open: '09:00', close: '20:00' },
    },
    area: 'Alambagh', city: 'Lucknow', audio_guide: null,
    rating: 4.3, review_count: 27, verified: true, lat: 26.831, lng: 80.921, dist_m: 1450,
  },
  {
    id: 'demo-5',
    name: 'Mukesh Hardware',
    category_id: null,
    address: 'Aishbagh Road',
    phone: '+91 94500 77623',
    opening_hours: {
      mon: { open: '09:00', close: '19:30' }, tue: { open: '09:00', close: '19:30' },
      wed: { open: '09:00', close: '19:30' }, thu: { open: '09:00', close: '19:30' },
      fri: { open: '09:00', close: '19:30' }, sat: { open: '09:00', close: '19:30' },
    },
    area: 'Aishbagh', city: 'Lucknow', audio_guide: null,
    rating: 3.8, review_count: 9, verified: false, lat: 26.861, lng: 80.924, dist_m: 1820,
  },
]

export function getDemoShop(id: string): Shop | undefined {
  return DEMO_SHOPS.find(s => s.id === id)
}
