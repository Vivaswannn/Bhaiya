export interface CategoryDef {
  slug: string
  name_en: string
  name_hi: string
  color: string
  iconPath: string  // SVG path data (viewBox 0 0 24 24)
}

export const CATEGORY_DEFS: CategoryDef[] = [
  {
    slug: 'ration',
    name_en: 'Ration',
    name_hi: 'राशन',
    color: '#9b7dff',
    iconPath: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0',
  },
  {
    slug: 'vegetables',
    name_en: 'Sabzi',
    name_hi: 'सब्जी',
    color: '#00dc64',
    iconPath: 'M12 22V12M5 12c0-4.4 3.1-8 7-8 3.9 0 7 3.6 7 8H5z',
  },
  {
    slug: 'dairy',
    name_en: 'Milk',
    name_hi: 'दूध',
    color: '#38bdf8',
    iconPath: 'M8 2h8l2 4v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6l2-4zM6 6h12M12 11v6M9 13.5h6',
  },
  {
    slug: 'medical',
    name_en: 'Medical',
    name_hi: 'दवाई',
    color: '#fb7185',
    iconPath: 'M22 12h-4l-3 9L9 3l-3 9H2',
  },
  {
    slug: 'hardware',
    name_en: 'Hardware',
    name_hi: 'हार्डवेयर',
    color: '#fbbf24',
    iconPath: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  },
  {
    slug: 'tailor',
    name_en: 'Tailor',
    name_hi: 'दर्जी',
    color: '#2dd4bf',
    iconPath: 'M6 3a3 3 0 100 6 3 3 0 000-6zm0 12a3 3 0 100 6 3 3 0 000-6zm14-9L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12',
  },
  {
    slug: 'pet',
    name_en: 'Pet Shop',
    name_hi: 'पेट शॉप',
    color: '#fb923c',
    iconPath: 'M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 2.261M14 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 2.261M8 14c.5 2.5 2 4 4 4s3.5-1.5 4-4c.667-3.5-1-6-4-6s-4.667 2.5-4 6z',
  },
  {
    slug: 'more',
    name_en: 'More',
    name_hi: 'और',
    color: 'rgba(255,255,255,0.5)',
    iconPath: 'M12 12h.01M19 12h.01M5 12h.01',
  },
]

export function getCategoryDef(slug: string): CategoryDef | undefined {
  return CATEGORY_DEFS.find(c => c.slug === slug)
}
