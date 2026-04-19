import type { Metadata } from 'next'
import { getShopById } from '@/lib/geo'
import { ShopDetailClient } from './ShopDetailClient'

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  if (params.id.startsWith('demo-')) {
    return { title: 'Shop — Bhaiya App' }
  }
  const shop = await getShopById(params.id)
  if (!shop) return { title: 'Shop not found — Bhaiya App' }

  const categoryName = (shop.category as any)?.name_en ?? ''
  const description = `${categoryName ? `${categoryName} · ` : ''}${shop.area ?? ''} · Call or WhatsApp directly on Bhaiya App.`

  return {
    title: `${shop.name} — Bhaiya App`,
    description,
    openGraph: {
      title: shop.name,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: shop.name,
      description,
    },
  }
}

export default function ShopDetailPage({ params }: { params: { id: string } }) {
  return <ShopDetailClient id={params.id} />
}
