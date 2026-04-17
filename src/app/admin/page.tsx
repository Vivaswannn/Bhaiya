import Link from 'next/link'
import { getServiceClient } from '@/lib/supabase'

export default async function AdminDashboard() {
  const client = getServiceClient()
  const [{ count: shopsTotal }, { count: pending }, { count: verified }] = await Promise.all([
    client.from('shops').select('*', { count: 'exact', head: true }),
    client.from('contributions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    client.from('shops').select('*', { count: 'exact', head: true }).eq('verified', true),
  ])

  return (
    <main className="min-h-screen bg-bg-dark p-6 font-jakarta">
      <h1 className="font-syne text-2xl font-bold text-white mb-6">Bhaiya App — Admin</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Shops', value: shopsTotal ?? 0 },
          { label: 'Verified', value: verified ?? 0 },
          { label: 'Pending Review', value: pending ?? 0, highlight: true },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl p-4 border ${stat.highlight ? 'bg-violet/10 border-violet/30' : 'bg-white/[0.04] border-white/[0.08]'}`}>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <Link href="/admin/contributions" className="block bg-violet/10 border border-violet/30 rounded-2xl p-4 text-white font-semibold text-sm hover:bg-violet/20 transition-colors">
          Review Contributions →
        </Link>
      </div>
    </main>
  )
}
