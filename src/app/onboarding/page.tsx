'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useLang } from '@/lib/lang'
import LangToggle from '@/components/layout/LangToggle'

export default function OnboardingPage() {
  const router = useRouter()
  const { lang } = useLang()

  function handleStart() {
    localStorage.setItem('bhaiya_onboarded', '1')
    router.push('/')
  }

  const T = {
    tagline: lang === 'en'
      ? 'New city? Bhaiya is here!'
      : 'Naye sheher mein? Bhaiya hai na!',
    desc: lang === 'en'
      ? 'Find ration, vegetables, dairy, medicines — all the local shops in your new city. Phone numbers, opening hours, audio guide — one place.'
      : 'Aapke naye sheher mein ration, sabzi, doodh, dawai — sab kuch dhundhein. Local shops, numbers, audio guide — sab ek jagah.',
    cta: lang === 'en' ? 'Get Started →' : 'Shuru karo →',
    footer: lang === 'en' ? 'Currently: Lucknow · More cities coming soon' : 'Filhaal: Lucknow · Aur sheher jald hi',
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full -top-20 left-1/2 -translate-x-1/2 bg-violet/20 blur-[100px]" />
        <div className="absolute w-64 h-64 rounded-full bottom-20 -right-10 bg-rose/10 blur-[80px]" />
      </div>

      <div className="absolute top-6 right-6">
        <LangToggle />
      </div>

      <div className="relative z-10 text-center max-w-xs">
        <div className="w-20 h-20 rounded-3xl bg-violet/20 border border-violet/30 flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9b7dff" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>

        <h1 className="font-syne text-3xl font-extrabold leading-tight mb-2 text-gray-900 dark:text-white">
          Bhaiya App
        </h1>
        <p className="text-violet/80 font-semibold text-sm mb-4">
          {T.tagline}
        </p>
        <p className="text-gray-500 dark:text-white/40 text-sm leading-relaxed mb-10">
          {T.desc}
        </p>

        <Button variant="primary" size="lg" className="w-full mb-3" onClick={handleStart}>
          {T.cta}
        </Button>
        <p className="text-[10px] text-gray-400 dark:text-white/25">{T.footer}</p>
      </div>
    </main>
  )
}
