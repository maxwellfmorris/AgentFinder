'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'

export function NavAuthLinks() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <Link
      href="/dashboard"
      className="hidden sm:block text-sm font-semibold text-slate-600 border border-slate-200 px-4 py-2 rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors"
    >
      Dashboard
    </Link>
  )
}
