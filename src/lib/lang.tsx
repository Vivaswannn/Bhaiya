'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'en' | 'hi'

interface LangContextType {
  lang: Lang
  toggleLang: () => void
}

const LangContext = createContext<LangContextType>({ lang: 'en', toggleLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('bhaiya_lang') as Lang | null
    if (saved === 'hi') setLang('hi')
  }, [])

  function toggleLang() {
    setLang(prev => {
      const next = prev === 'en' ? 'hi' : 'en'
      localStorage.setItem('bhaiya_lang', next)
      return next
    })
  }

  return <LangContext.Provider value={{ lang, toggleLang }}>{children}</LangContext.Provider>
}

export function useLang() { return useContext(LangContext) }
