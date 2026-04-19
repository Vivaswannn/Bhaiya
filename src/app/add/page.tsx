'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { Category } from '@/lib/types'
import { useLang } from '@/lib/lang'

export default function AddShopPage() {
  const router = useRouter()
  const { lang } = useLang()
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

  const T = {
    title: lang === 'en' ? 'Add Your Shop' : 'Dukaan Jodo',
    subtitle: lang === 'en' ? 'List your shop free — be found by thousands of locals' : 'Apne mohalle ki dukaan jodo — kisi ki madad karo',
    nameLabel: lang === 'en' ? 'Shop name *' : 'Dukaan ka naam *',
    namePlaceholder: lang === 'en' ? 'e.g. Sharma General Store' : 'e.g. Sharma General Store',
    catLabel: lang === 'en' ? 'Category *' : 'Category *',
    catPlaceholder: lang === 'en' ? 'Select a category' : 'Category chunein',
    phoneLabel: lang === 'en' ? 'Phone number' : 'Phone number',
    addressLabel: lang === 'en' ? 'Address' : 'Pata (Address)',
    addressPlaceholder: lang === 'en' ? 'e.g. Near Clock Tower, Hazratganj' : 'e.g. Near Clock Tower, Hazratganj',
    areaLabel: lang === 'en' ? 'Area / Locality' : 'Area / Mohalla',
    areaPlaceholder: lang === 'en' ? 'e.g. Hazratganj' : 'e.g. Hazratganj',
    locationDetected: lang === 'en' ? 'Location detected' : 'Location detect ho gayi',
    submit: lang === 'en' ? 'Submit Shop 🙏' : 'Dukaan bhejo 🙏',
    submitting: lang === 'en' ? 'Submitting...' : 'Bhej rahe hain...',
    thanksTitle: lang === 'en' ? 'Thank you!' : 'Shukriya!',
    thanksMsg: lang === 'en'
      ? 'Your shop will be reviewed within 24 hours. You\'re helping your community!'
      : 'Aapki dukaan 24 ghante mein review hogi. Aapki wajah se kisi ki madad hogi!',
    goHome: lang === 'en' ? 'Back to Home' : 'Ghar wapas jaao',
    featuredPromo: lang === 'en'
      ? '⭐ Get Featured — ₹299/month to appear at top of search'
      : '⭐ Featured ban jao — ₹299/mahine mein search mein sabse upar aao',
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center pb-24 px-8 text-center">
        <div className="text-5xl mb-4">🙏</div>
        <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-2">{T.thanksTitle}</h2>
        <p className="text-sm text-gray-500 dark:text-white/50 mb-6 leading-relaxed">{T.thanksMsg}</p>
        <Button variant="primary" onClick={() => router.push('/')}>{T.goHome}</Button>
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-24">
      <div className="px-5 pt-10 pb-6">
        <h2 className="font-syne text-lg font-bold text-gray-900 dark:text-white mb-1">{T.title}</h2>
        <p className="text-[11px] text-gray-500 dark:text-white/40">{T.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-3">
        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 block mb-1.5">{T.nameLabel}</label>
          <input
            required value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder={T.namePlaceholder}
            className="w-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 block mb-1.5">{T.catLabel}</label>
          <select
            required value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            className="w-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet/50 appearance-none"
          >
            <option value="">{T.catPlaceholder}</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name_hi} / {c.name_en}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 block mb-1.5">{T.phoneLabel}</label>
          <input
            type="tel" value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="9876543210"
            className="w-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 block mb-1.5">{T.addressLabel}</label>
          <input value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            placeholder={T.addressPlaceholder}
            className="w-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 block mb-1.5">{T.areaLabel}</label>
          <input value={form.area}
            onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
            placeholder={T.areaPlaceholder}
            className="w-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.1] rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-violet/50"
          />
        </div>

        {form.lat && (
          <p className="text-[9px] text-gray-400 dark:text-white/30 flex items-center gap-1">
            <svg width="9" height="11" viewBox="0 0 12 14" fill="#7B5BFF"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z"/></svg>
            {T.locationDetected}: {form.lat}, {form.lng}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" className="mt-2 w-full" disabled={submitting}>
          {submitting ? T.submitting : T.submit}
        </Button>

        <div className="mt-1 py-3 px-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl text-center">
          <p className="text-[9px] text-amber-500 font-semibold">{T.featuredPromo}</p>
        </div>
      </form>
      <BottomNav />
    </main>
  )
}
