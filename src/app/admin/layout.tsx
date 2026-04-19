'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/admin/login')
      setChecking(false)
    })
  }, [])

  if (checking) {
    return <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex items-center justify-center text-gray-400 dark:text-white/40 text-sm">Loading...</div>
  }

  return <>{children}</>
}
