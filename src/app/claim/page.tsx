'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLang } from '@/lib/lang'
import { BottomNav } from '@/components/layout/BottomNav'

export default function ClaimPage() {
  const router = useRouter()
  const params = useSearchParams()
  const shopName = params.get('shop') ?? ''
  const { lang } = useLang()
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const T = {
    title: lang === 'en' ? 'Claim Your Shop' : 'Apni Dukaan Claim Karein',
    sub: lang === 'en'
      ? 'You\'re listed on Bhaiya App. Claim it to update your info and get more calls.'
      : 'Aapki dukaan Bhaiya App par hai. Claim karein — number update karein, zyada calls paayein.',
    shopLabel: lang === 'en' ? 'Shop name' : 'Dukaan ka naam',
    phoneLabel: lang === 'en' ? 'Your WhatsApp number' : 'Aapka WhatsApp number',
    phonePlaceholder: lang === 'en' ? '98765 43210' : '98765 43210',
    submit: lang === 'en' ? 'Send claim request' : 'Claim request bhejein',
    successTitle: lang === 'en' ? 'Request sent!' : 'Request bhej di!',
    successSub: lang === 'en'
      ? 'We\'ll WhatsApp you within 24 hours to verify.'
      : 'Hum 24 ghante mein aapko WhatsApp karenge.',
    featured: lang === 'en'
      ? 'Featured shops get 5× more calls for ₹299/month'
      : 'Featured dukaanon ko 5× zyada calls milti hain — ₹299/mahina',
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const wa = `https://wa.me/918726234200?text=${encodeURIComponent(
      `Claim request:\nShop: ${shopName}\nPhone: ${phone}`
    )}`
    window.open(wa, '_blank')
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen pb-24 px-5 pt-12">
      <button onClick={() => router.back()} className="text-[11px] text-gray-400 dark:text-white/40 mb-6 flex items-center gap-1.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {submitted ? (
        <div className="flex flex-col items-center gap-4 pt-12 text-center">
          <div className="w-16 h-16 rounded-3xl bg-open-green/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-open-green">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-syne text-xl font-bold text-gray-900 dark:text-white">{T.successTitle}</h1>
          <p className="text-[12px] text-gray-500 dark:text-white/40">{T.successSub}</p>
        </div>
      ) : (
        <>
          <h1 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-2">{T.title}</h1>
          <p className="text-[12px] text-gray-500 dark:text-white/40 mb-6">{T.sub}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1.5 block">{T.shopLabel}</label>
              <input
                type="text"
                defaultValue={shopName}
                readOnly={!!shopName}
                className="w-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl px-4 py-3 text-[12px] text-gray-900 dark:text-white outline-none focus:border-violet/40"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1.5 block">{T.phoneLabel}</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={T.phonePlaceholder}
                required
                className="w-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl px-4 py-3 text-[12px] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:border-violet/40"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet text-white font-bold text-sm rounded-2xl py-4 mt-2"
            >
              {T.submit}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1.5 py-2.5 bg-amber-400/10 border border-amber-400/20 rounded-2xl">
            <span className="text-[10px] text-amber-500">⭐ {T.featured}</span>
          </div>
        </>
      )}
      <BottomNav />
    </main>
  )
}
