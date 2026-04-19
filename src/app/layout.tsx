import type { Metadata, Viewport } from 'next'
import { Syne, Plus_Jakarta_Sans } from 'next/font/google'
import { LangProvider } from '@/lib/lang'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'Bhaiya App — Find Local Shops Near You',
  description: 'Find ration, sabzi, dairy, medical and hardware shops near you in Lucknow. Call or WhatsApp directly.',
  manifest: '/manifest.json',
  keywords: ['local shops', 'kirana', 'sabzi', 'Lucknow', 'nearby shops', 'bhaiya app'],
  openGraph: {
    title: 'Bhaiya App',
    description: 'Naye sheher mein? Bhaiya hai na! Find local shops near you.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary',
    title: 'Bhaiya App',
    description: 'Find local shops near you in Lucknow.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bhaiya App',
  },
}

export const viewport: Viewport = {
  themeColor: '#7B5BFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${jakarta.variable} dark`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="font-jakarta text-white antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  )
}
