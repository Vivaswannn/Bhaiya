import Link from 'next/link'
import { getServiceClient } from '@/lib/supabase'

export default async function AdminDashboard() {
  const client = getServiceClient()
  const [{ count: shopsTotal }, { count: pending }, { count: verified }, { data: hotShops }] = await Promise.all([
    client.from('shops').select('*', { count: 'exact', head: true }),
    client.from('contributions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    client.from('shops').select('*', { count: 'exact', head: true }).eq('verified', true),
    client.from('shops_with_call_counts').select('*').gte('call_count', 3).order('call_count', { ascending: false }).limit(10),
  ])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-bg-dark p-6 font-jakarta">
      <h1 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-6">Bhaiya App — Admin</h1>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Shops', value: shopsTotal ?? 0 },
          { label: 'Verified', value: verified ?? 0 },
          { label: 'Pending Review', value: pending ?? 0, highlight: true },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl p-4 border ${stat.highlight && (pending ?? 0) > 0 ? 'bg-violet/10 border-violet/30' : 'bg-black/[0.04] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08]'}`}>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-[10px] text-gray-400 dark:text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <Link href="/admin/contributions" className="block bg-violet/10 border border-violet/30 rounded-2xl p-4 text-violet font-semibold text-sm hover:bg-violet/20 transition-colors">
          Review Contributions →
        </Link>
      </div>

      {hotShops && hotShops.length > 0 && (
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">
            Featured Outreach — 3+ Calls
          </p>
          <div className="flex flex-col gap-2">
            {hotShops.map((shop: any) => (
              <div key={shop.id} className="flex items-center justify-between bg-amber-400/10 border border-amber-400/30 rounded-2xl px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{shop.name}</p>
                  <p className="text-[10px] text-gray-400 dark:text-white/40 mt-0.5">{shop.area} · {shop.phone}</p>
                </div>
                <div className="text-right">
                  <p className="font-syne text-lg font-bold text-amber-500">{shop.call_count}</p>
                  <p className="text-[8px] text-amber-500/60">calls</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-gray-400 dark:text-white/30 mt-3 text-center">
            Call these shops and offer Featured listing at ₹299/month
          </p>
        </div>
      )}
    </main>
  )
}
