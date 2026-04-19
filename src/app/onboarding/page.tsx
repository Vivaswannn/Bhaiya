'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useLang } from '@/lib/lang'
import LangToggle from '@/components/layout/LangToggle'

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9b7dff" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    en: 'Find any shop near you instantly',
    hi: 'Aas-paas ki koi bhi dukaan turant dhundho',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.8" strokeLinecap="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.61 19.79 19.79 0 01.09 1a2 2 0 012-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 6.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    en: 'Call or WhatsApp directly from the app',
    hi: 'App se seedha call ya WhatsApp karo',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    ),
    en: 'Get directions to any shop in one tap',
    hi: 'Ek tap mein kisi bhi dukaan ka raasta pao',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { lang } = useLang()

  function handleStart() {
    localStorage.setItem('bhaiya_onboarded', '1')
    router.push('/')
  }

  const T = {
    tagline: lang === 'en' ? 'New city? Bhaiya is here!' : 'Naye sheher mein? Bhaiya hai na!',
    desc: lang === 'en'
      ? 'Find ration, vegetables, dairy, medicines — all local shops. Phone numbers, opening hours, audio guide.'
      : 'Ration, sabzi, doodh, dawai — sab kuch dhundhen. Numbers, khulne ka waqt, audio guide — sab ek jagah.',
    cta: lang === 'en' ? 'Get Started →' : 'Shuru karo →',
    footer: lang === 'en' ? 'Currently: Lucknow · More cities coming soon' : 'Filhaal: Lucknow · Aur sheher jald hi',
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full -top-20 left-1/2 -translate-x-1/2 bg-violet/[0.08] dark:bg-violet/20 blur-[100px]" />
        <div className="absolute w-64 h-64 rounded-full bottom-20 -right-10 bg-rose/[0.05] dark:bg-rose/10 blur-[80px]" />
      </div>

      <div className="absolute top-6 right-6">
        <LangToggle />
      </div>

      <div className="relative z-10 text-center max-w-xs w-full">
        <div className="w-20 h-20 rounded-3xl bg-violet/20 border border-violet/30 flex items-center justify-center mx-auto mb-5">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9b7dff" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>

        <h1 className="font-syne text-3xl font-extrabold leading-tight mb-1 text-gray-900 dark:text-white">
          Bhaiya App
        </h1>
        <p className="text-violet/80 font-semibold text-sm mb-3">{T.tagline}</p>
        <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed mb-6">{T.desc}</p>

        {/* Feature highlights */}
        <div className="flex flex-col gap-2.5 mb-8 text-left">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl px-4 py-3">
              <div className="shrink-0">{f.icon}</div>
              <p className="text-[11px] text-gray-700 dark:text-white/80 font-medium">
                {lang === 'en' ? f.en : f.hi}
              </p>
            </div>
          ))}
        </div>

        <Button variant="primary" size="lg" className="w-full mb-3" onClick={handleStart}>
          {T.cta}
        </Button>
        <p className="text-[10px] text-gray-400 dark:text-white/25">{T.footer}</p>
      </div>
    </main>
  )
}
