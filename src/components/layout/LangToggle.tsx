'use client'
import { useLang } from '@/lib/lang'

export default function LangToggle() {
  const { lang, toggleLang } = useLang()
  return (
    <button
      onClick={toggleLang}
      aria-label="Toggle language"
      className="h-8 px-2.5 rounded-xl bg-black/[0.06] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 text-[10px] font-bold text-gray-700 dark:text-white/70 tracking-wide"
    >
      {lang === 'en' ? 'हि' : 'EN'}
    </button>
  )
}
