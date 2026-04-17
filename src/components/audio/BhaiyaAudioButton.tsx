'use client'
import { useState, useEffect } from 'react'
import { speakGuide, stopGuide, isSpeaking, isSpeechSupported } from '@/lib/audio'
import { cn } from '@/lib/utils'

interface BhaiyaAudioButtonProps {
  text: string
  className?: string
}

export function BhaiyaAudioButton({ text, className }: BhaiyaAudioButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(isSpeechSupported())
  }, [])

  function handleToggle() {
    if (speaking) {
      stopGuide()
      setSpeaking(false)
    } else {
      speakGuide(text)
      setSpeaking(true)
      const interval = setInterval(() => {
        if (!isSpeaking()) {
          setSpeaking(false)
          clearInterval(interval)
        }
      }, 300)
    }
  }

  if (!supported) return null

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'w-full flex items-center gap-3 rounded-2xl p-3 border transition-all active:scale-[0.98]',
        speaking
          ? 'bg-violet/20 border-violet/40'
          : 'bg-gradient-to-r from-violet/15 to-rose/10 border-violet/25',
        className
      )}
    >
      <div className="w-8 h-8 rounded-xl bg-violet/25 border border-violet/40 flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4b0ff" strokeWidth="2.5" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 010 7.07"/>
          {speaking && <path d="M19.07 4.93a10 10 0 010 14.14"/>}
        </svg>
      </div>
      <div className="text-left">
        <p className="text-[10px] font-bold text-violet/90">
          {speaking ? 'Bhaiya bol raha hai...' : 'Bhaiya se puchho 🔊'}
        </p>
        <p className="text-[8px] text-white/30">Audio guide suniye — Hindi mein</p>
      </div>
      <div className="ml-auto w-6 h-6 rounded-full bg-violet/30 border border-violet/45 flex items-center justify-center shrink-0">
        {speaking ? (
          <svg width="8" height="8" viewBox="0 0 10 10" fill="#c4b0ff">
            <rect x="1" y="1" width="3" height="8" rx="1"/>
            <rect x="6" y="1" width="3" height="8" rx="1"/>
          </svg>
        ) : (
          <svg width="8" height="10" viewBox="0 0 10 12" fill="#c4b0ff">
            <path d="M1 1l8 5-8 5V1z"/>
          </svg>
        )}
      </div>
    </button>
  )
}
