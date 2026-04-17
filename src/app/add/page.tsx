'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { Category } from '@/lib/types'

export default function AddShopPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    phone: '',
    address: '',
    area: '',
    lat: '',
    lng: '',
  })

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data)
    })
    navigator.geolocation?.getCurrentPosition(pos => {
      setForm(f => ({
        ...f,
        lat: pos.coords.latitude.toFixed(6),
        lng: pos.coords.longitude.toFixed(6),
      }))
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.category_id) return
    setSubmitting(true)
    try {
      await supabase.from('contributions').insert({
        shop_data: {
          name: form.name,
          category_id: form.category_id,
          phone: form.phone || null,
          address: form.address || null,
          area: form.area || null,
          city: 'Lucknow',
          lat: form.lat ? parseFloat(form.lat) : null,
          lng: form.lng ? parseFloat(form.lng) : null,
        },
        submitted_by: null,
        status: 'pending',
      })
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-bg-dark flex flex-col items-center justify-center pb-24 px-8 text-center">
        <div className="text-4xl mb-4">🙏</div>
        <h2 className="font-syne text-xl font-bold text-white mb-2">Shukriya!</h2>
        <p className="text-sm text-white/50 mb-6">
          Aapki dukaan 24 ghante mein review hogi.<br />Aapki wajah se kisi ki madad hogi!
        </p>
        <Button variant="primary" onClick={() => router.push('/')}>Ghar wapas jaao</Button>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg-dark pb-24">
      <div className="px-5 pt-10 pb-6">
        <h2 className="font-syne text-lg font-bold text-white mb-1">Dukaan Jodo</h2>
        <p className="text-[11px] text-white/40">Apne mohalle ki dukaan jodo — kisi ki madad karo</p>
      </div>

      <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-3">
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1.5">Dukaan ka naam *</label>
          <input
            required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Sharma General Store"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1.5">Category *</label>
          <select
            required value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet/50 appearance-none"
          >
            <option value="">Category chunein</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name_hi} / {c.name_en}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1.5">Phone number</label>
          <input
            type="tel" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="9876543210"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1.5">Pata (Address)</label>
          <input value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            placeholder="e.g. Near Clock Tower, Hazratganj"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1.5">Area / Mohalla</label>
          <input value={form.area}
            onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
            placeholder="e.g. Hazratganj"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        {form.lat && (
          <p className="text-[9px] text-white/30 flex items-center gap-1">
            <svg width="9" height="11" viewBox="0 0 12 14" fill="#7B5BFF"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"/></svg>
            Location detect ho gayi: {form.lat}, {form.lng}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" className="mt-2 w-full" disabled={submitting}>
          {submitting ? 'Bhej rahe hain...' : 'Dukaan bhejo 🙏'}
        </Button>
      </form>
      <BottomNav />
    </main>
  )
}
