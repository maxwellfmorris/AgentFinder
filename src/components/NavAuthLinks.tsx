'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'

export function NavAuthLinks() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <Link
      href="/dashboard"
      className="hidden sm:block text-sm font-semibold text-muted border border-grape/15 px-4 py-2 rounded-full hover:border-grape/40 hover:text-grape transition-colors"
    >
      Dashboard
    </Link>
  )
}
