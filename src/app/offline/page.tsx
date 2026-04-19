'use client'
export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5 px-8 text-center">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-30">
        <path d="M32 8C18.75 8 8 18.75 8 32s10.75 24 24 24 24-10.75 24-24S45.25 8 32 8z" stroke="currentColor" strokeWidth="2"/>
        <path d="M20 44c0-6.63 5.37-12 12-12s12 5.37 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26 36c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="44" r="2" fill="currentColor"/>
        <line x1="10" y1="10" x2="54" y2="54" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <div>
        <h1 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-2">You're offline</h1>
        <p className="text-[12px] text-gray-500 dark:text-white/40">
          No internet connection. Open the app again when you're back online.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 bg-violet text-white font-semibold text-sm px-6 py-3 rounded-2xl"
      >
        Try again
      </button>
    </main>
  )
}
