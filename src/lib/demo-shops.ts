import { Shop, Category } from './types'

function cat(slug: string, name_en: string, name_hi: string, color: string): Category {
  return { id: `demo-cat-${slug}`, name_en, name_hi, slug, color, sort_order: 0 }
}

const RATION   = cat('ration',     'Ration',    'राशन',      '#9b7dff')
const SABZI    = cat('vegetables', 'Sabzi',     'सब्जी',     '#00dc64')
const DAIRY    = cat('dairy',      'Milk',      'दूध',       '#38bdf8')
const MEDICAL  = cat('medical',    'Medical',   'दवाई',      '#fb7185')
const HARDWARE = cat('hardware',   'Hardware',  'हार्डवेयर', '#fbbf24')
const TAILOR   = cat('tailor',     'Tailor',    'दर्जी',     '#2dd4bf')
const PET      = cat('pet',        'Pet Shop',  'पेट शॉप',   '#fb923c')

export const DEMO_SHOPS: Shop[] = [
  // === RATION ===
  {
    id: 'demo-1', name: 'Ram Lal Kirana Store',
    category_id: RATION.id, category: RATION,
    address: 'Hazratganj Market, Near GPO', phone: '+91 94150 12345',
    opening_hours: {
      mon: { open: '07:00', close: '21:00' }, tue: { open: '07:00', close: '21:00' },
      wed: { open: '07:00', close: '21:00' }, thu: { open: '07:00', close: '21:00' },
      fri: { open: '07:00', close: '21:00' }, sat: { open: '07:00', close: '21:00' },
    },
    area: 'Hazratganj', city: 'Lucknow', audio_guide: 'Ram Lal Kirana has everything you need — atta, dal, rice, oil, spices. Open every day seven AM to nine PM. Just 320 metres away.',
    rating: 4.2, review_count: 18, verified: true, featured: true,
    lat: 26.8467, lng: 80.9462, dist_m: 320,
  },
  {
    id: 'demo-2', name: 'Sharma General Store',
    category_id: RATION.id, category: RATION,
    address: 'Sector 14, Indira Nagar', phone: '+91 98765 43210',
    opening_hours: {
      mon: { open: '08:00', close: '22:00' }, tue: { open: '08:00', close: '22:00' },
      wed: { open: '08:00', close: '22:00' }, thu: { open: '08:00', close: '22:00' },
      fri: { open: '08:00', close: '22:00' }, sat: { open: '08:00', close: '22:00' },
      sun: { open: '09:00', close: '20:00' },
    },
    area: 'Indira Nagar', city: 'Lucknow', audio_guide: null,
    rating: 4.0, review_count: 31, verified: true, featured: false,
    lat: 26.875, lng: 81.002, dist_m: 540,
  },
  {
    id: 'demo-3', name: 'Babu Ji Provision Store',
    category_id: RATION.id, category: RATION,
    address: 'Aminabad Road, Opp. Cinema Hall', phone: '+91 75231 09876',
    opening_hours: {
      mon: { open: '07:30', close: '20:30' }, tue: { open: '07:30', close: '20:30' },
      wed: { open: '07:30', close: '20:30' }, thu: { open: '07:30', close: '20:30' },
      fri: { open: '07:30', close: '20:30' }, sat: { open: '07:30', close: '20:30' },
    },
    area: 'Aminabad', city: 'Lucknow', audio_guide: null,
    rating: 3.9, review_count: 14, verified: false, featured: false,
    lat: 26.856, lng: 80.934, dist_m: 890,
  },
  // === SABZI ===
  {
    id: 'demo-4', name: 'Shyam Sabzi Wale',
    category_id: SABZI.id, category: SABZI,
    address: 'Gomti Nagar Crossing, Near Park', phone: '+91 98390 55432',
    opening_hours: {
      mon: { open: '06:00', close: '13:00' }, tue: { open: '06:00', close: '13:00' },
      wed: { open: '06:00', close: '13:00' }, thu: { open: '06:00', close: '13:00' },
      fri: { open: '06:00', close: '13:00' }, sat: { open: '06:00', close: '13:00' },
      sun: { open: '06:00', close: '11:00' },
    },
    area: 'Gomti Nagar', city: 'Lucknow', audio_guide: 'Shyam Sabzi Wale brings fresh vegetables every morning from Lucknow Mandi. Tomatoes, onions, seasonal veggies at the best price.',
    rating: 4.5, review_count: 34, verified: true, featured: true,
    lat: 26.852, lng: 80.999, dist_m: 680,
  },
  {
    id: 'demo-5', name: 'Hari Om Fresh Vegetables',
    category_id: SABZI.id, category: SABZI,
    address: 'Aliganj, Near Temple', phone: '+91 94501 23456',
    opening_hours: {
      mon: { open: '06:30', close: '12:30' }, tue: { open: '06:30', close: '12:30' },
      wed: { open: '06:30', close: '12:30' }, thu: { open: '06:30', close: '12:30' },
      fri: { open: '06:30', close: '12:30' }, sat: { open: '06:30', close: '12:30' },
      sun: { open: '07:00', close: '11:00' },
    },
    area: 'Aliganj', city: 'Lucknow', audio_guide: null,
    rating: 4.1, review_count: 22, verified: true, featured: false,
    lat: 26.889, lng: 80.964, dist_m: 1020,
  },
  // === DAIRY ===
  {
    id: 'demo-6', name: 'Gopal Dairy',
    category_id: DAIRY.id, category: DAIRY,
    address: 'Near Indira Nagar Chowk', phone: '+91 75231 88901',
    opening_hours: {
      mon: { open: '05:30', close: '10:00' }, tue: { open: '05:30', close: '10:00' },
      wed: { open: '05:30', close: '10:00' }, thu: { open: '05:30', close: '10:00' },
      fri: { open: '05:30', close: '10:00' }, sat: { open: '05:30', close: '10:00' },
      sun: { open: '05:30', close: '09:00' },
    },
    area: 'Indira Nagar', city: 'Lucknow', audio_guide: null,
    rating: 4.0, review_count: 12, verified: false, featured: false,
    lat: 26.875, lng: 81.002, dist_m: 1100,
  },
  {
    id: 'demo-7', name: 'Mother Dairy Booth',
    category_id: DAIRY.id, category: DAIRY,
    address: 'Sector 9, Vikas Nagar', phone: '+91 52223 11122',
    opening_hours: {
      mon: { open: '06:00', close: '10:00' }, tue: { open: '06:00', close: '10:00' },
      wed: { open: '06:00', close: '10:00' }, thu: { open: '06:00', close: '10:00' },
      fri: { open: '06:00', close: '10:00' }, sat: { open: '06:00', close: '10:00' },
      sun: { open: '06:30', close: '09:30' },
    },
    area: 'Vikas Nagar', city: 'Lucknow', audio_guide: null,
    rating: 4.3, review_count: 47, verified: true, featured: false,
    lat: 26.868, lng: 80.956, dist_m: 1250,
  },
  // === MEDICAL ===
  {
    id: 'demo-8', name: 'City Medical Store',
    category_id: MEDICAL.id, category: MEDICAL,
    address: 'Alambagh, Near Bus Stand', phone: '+91 52220 44321',
    opening_hours: {
      mon: { open: '08:00', close: '22:00' }, tue: { open: '08:00', close: '22:00' },
      wed: { open: '08:00', close: '22:00' }, thu: { open: '08:00', close: '22:00' },
      fri: { open: '08:00', close: '22:00' }, sat: { open: '08:00', close: '22:00' },
      sun: { open: '09:00', close: '20:00' },
    },
    area: 'Alambagh', city: 'Lucknow', audio_guide: null,
    rating: 4.3, review_count: 27, verified: true, featured: true,
    lat: 26.831, lng: 80.921, dist_m: 1450,
  },
  {
    id: 'demo-9', name: 'Arogya Medical Hall',
    category_id: MEDICAL.id, category: MEDICAL,
    address: 'Charbagh, Near Railway Station', phone: '+91 94159 67890',
    opening_hours: {
      mon: { open: '07:00', close: '23:00' }, tue: { open: '07:00', close: '23:00' },
      wed: { open: '07:00', close: '23:00' }, thu: { open: '07:00', close: '23:00' },
      fri: { open: '07:00', close: '23:00' }, sat: { open: '07:00', close: '23:00' },
      sun: { open: '08:00', close: '22:00' },
    },
    area: 'Charbagh', city: 'Lucknow', audio_guide: null,
    rating: 4.1, review_count: 39, verified: true, featured: false,
    lat: 26.844, lng: 80.919, dist_m: 1680,
  },
  // === HARDWARE ===
  {
    id: 'demo-10', name: 'Mukesh Hardware',
    category_id: HARDWARE.id, category: HARDWARE,
    address: 'Aishbagh Road', phone: '+91 94500 77623',
    opening_hours: {
      mon: { open: '09:00', close: '19:30' }, tue: { open: '09:00', close: '19:30' },
      wed: { open: '09:00', close: '19:30' }, thu: { open: '09:00', close: '19:30' },
      fri: { open: '09:00', close: '19:30' }, sat: { open: '09:00', close: '19:30' },
    },
    area: 'Aishbagh', city: 'Lucknow', audio_guide: null,
    rating: 3.8, review_count: 9, verified: false, featured: false,
    lat: 26.861, lng: 80.924, dist_m: 1820,
  },
  {
    id: 'demo-11', name: 'Rajesh Iron & Hardware',
    category_id: HARDWARE.id, category: HARDWARE,
    address: 'Kaiserbagh, Main Road', phone: '+91 98391 44500',
    opening_hours: {
      mon: { open: '09:30', close: '19:00' }, tue: { open: '09:30', close: '19:00' },
      wed: { open: '09:30', close: '19:00' }, thu: { open: '09:30', close: '19:00' },
      fri: { open: '09:30', close: '19:00' }, sat: { open: '09:30', close: '19:00' },
    },
    area: 'Kaiserbagh', city: 'Lucknow', audio_guide: null,
    rating: 4.0, review_count: 16, verified: true, featured: false,
    lat: 26.853, lng: 80.932, dist_m: 1960,
  },
  // === TAILOR ===
  {
    id: 'demo-12', name: 'Sita Tailoring Centre',
    category_id: TAILOR.id, category: TAILOR,
    address: 'Mahanagar, Near Bus Stop', phone: '+91 75232 00345',
    opening_hours: {
      mon: { open: '10:00', close: '20:00' }, tue: { open: '10:00', close: '20:00' },
      wed: { open: '10:00', close: '20:00' }, thu: { open: '10:00', close: '20:00' },
      fri: { open: '10:00', close: '20:00' }, sat: { open: '10:00', close: '20:00' },
    },
    area: 'Mahanagar', city: 'Lucknow', audio_guide: null,
    rating: 4.4, review_count: 21, verified: true, featured: false,
    lat: 26.877, lng: 80.947, dist_m: 2100,
  },
  {
    id: 'demo-13', name: 'Master Ji Tailor',
    category_id: TAILOR.id, category: TAILOR,
    address: 'Narhi, Near Degree College', phone: '+91 94153 56789',
    opening_hours: {
      mon: { open: '09:00', close: '19:00' }, tue: { open: '09:00', close: '19:00' },
      wed: { open: '09:00', close: '19:00' }, thu: { open: '09:00', close: '19:00' },
      fri: { open: '09:00', close: '19:00' }, sat: { open: '09:00', close: '21:00' },
    },
    area: 'Narhi', city: 'Lucknow', audio_guide: null,
    rating: 4.6, review_count: 58, verified: true, featured: false,
    lat: 26.849, lng: 80.941, dist_m: 2300,
  },
  // === PET ===
  {
    id: 'demo-14', name: 'Lucky Pet Shop',
    category_id: PET.id, category: PET,
    address: 'Gomti Nagar Ext., Block C', phone: '+91 98765 11100',
    opening_hours: {
      mon: { open: '10:00', close: '20:00' }, tue: { open: '10:00', close: '20:00' },
      wed: { open: '10:00', close: '20:00' }, thu: { open: '10:00', close: '20:00' },
      fri: { open: '10:00', close: '20:00' }, sat: { open: '10:00', close: '20:00' },
      sun: { open: '11:00', close: '18:00' },
    },
    area: 'Gomti Nagar', city: 'Lucknow', audio_guide: null,
    rating: 4.7, review_count: 13, verified: true, featured: false,
    lat: 26.858, lng: 81.011, dist_m: 2600,
  },
  // === MORE ===
  {
    id: 'demo-15', name: 'Anmol Dry Cleaning',
    category_id: null, category: undefined,
    address: 'Hazratganj, Near Hotel Clarks', phone: '+91 94154 99900',
    opening_hours: {
      mon: { open: '08:00', close: '20:00' }, tue: { open: '08:00', close: '20:00' },
      wed: { open: '08:00', close: '20:00' }, thu: { open: '08:00', close: '20:00' },
      fri: { open: '08:00', close: '20:00' }, sat: { open: '08:00', close: '20:00' },
    },
    area: 'Hazratganj', city: 'Lucknow', audio_guide: null,
    rating: 4.2, review_count: 8, verified: false, featured: false,
    lat: 26.847, lng: 80.948, dist_m: 410,
  },
]

export function getDemoShop(id: string): Shop | undefined {
  return DEMO_SHOPS.find(s => s.id === id)
}
