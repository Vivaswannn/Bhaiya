'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Contribution } from '@/lib/types'
import { Button } from '@/components/ui/Button'

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchPending() {
    const { data } = await supabase
      .from('contributions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    if (data) setContributions(data as Contribution[])
    setLoading(false)
  }

  useEffect(() => { fetchPending() }, [])

  async function handleApprove(c: Contribution) {
    const d = c.shop_data as any
    if (!d.lat || !d.lng) {
      alert('Missing lat/lng — cannot approve without location')
      return
    }
    const { error } = await supabase.rpc('insert_shop_from_contribution', {
      p_name: d.name, p_category_id: d.category_id, p_lat: d.lat, p_lng: d.lng,
      p_address: d.address, p_phone: d.phone, p_area: d.area, p_city: d.city ?? 'Lucknow',
    })
    if (!error) {
      await supabase.from('contributions').update({ status: 'approved' }).eq('id', c.id)
      fetchPending()
    }
  }

  async function handleReject(id: string) {
    await supabase.from('contributions').update({ status: 'rejected' }).eq('id', id)
    fetchPending()
  }

  return (
    <main className="min-h-screen bg-bg-dark p-6 font-jakarta">
      <h1 className="font-syne text-xl font-bold text-white mb-4">Pending Contributions ({contributions.length})</h1>
      {loading && <p className="text-white/40 text-sm">Loading...</p>}
      <div className="flex flex-col gap-4">
        {contributions.map(c => {
          const d = c.shop_data as any
          return (
            <div key={c.id} className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-4">
              <p className="text-sm font-bold text-white">{d.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{d.phone} · {d.area} · {d.address}</p>
              <p className="text-[9px] text-white/25 mt-1">Submitted: {new Date(c.created_at).toLocaleDateString('en-IN')}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="primary" size="sm" onClick={() => handleApprove(c)}>Approve ✓</Button>
                <Button variant="ghost" size="sm" onClick={() => handleReject(c.id)}>Reject ✗</Button>
              </div>
            </div>
          )
        })}
        {!loading && contributions.length === 0 && (
          <p className="text-white/30 text-sm text-center py-8">No pending contributions 🎉</p>
        )}
      </div>
    </main>
  )
}
