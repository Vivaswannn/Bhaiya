'use client'
import { useEffect, useState } from 'react'

export function InstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('bhaiya_install_dismissed')) return
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!prompt || dismissed) return null

  function handleInstall() {
    prompt.prompt()
    prompt.userChoice.then(() => setDismissed(true))
  }

  function handleDismiss() {
    localStorage.setItem('bhaiya_install_dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="mx-5 mt-3 flex items-center gap-3 bg-violet/[0.08] border border-violet/[0.2] rounded-2xl px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-violet/20 flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-violet">
          <path d="M12 2v13M8 11l4 4 4-4"/><path d="M20 17v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-violet">Add to Home Screen</p>
        <p className="text-[9px] text-gray-500 dark:text-white/40">Works offline, opens faster</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={handleDismiss} className="text-[9px] text-gray-400 dark:text-white/30 px-2">Skip</button>
        <button onClick={handleInstall} className="text-[9px] font-bold text-white bg-violet rounded-xl px-3 py-1.5">Install</button>
      </div>
    </div>
  )
}
