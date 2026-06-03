import Link from 'next/link'
import { Search } from 'lucide-react'
import { NavAuthLinks } from './NavAuthLinks'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-grape/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-ink">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FF6B4A"/>
                  <stop offset="50%" stopColor="#FF3D77"/>
                  <stop offset="100%" stopColor="#8B2FE6"/>
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="7" fill="url(#logo-grad)"/>
              <text x="16" y="23" textAnchor="middle" fontFamily="'Space Grotesk', system-ui, sans-serif" fontWeight="700" fontSize="18" fill="white">b.</text>
            </svg>
            bindie.ai
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <Link href="/agents" className="hover:text-grape transition-colors">
              Browse Agents
            </Link>
            <Link href="/agents?category=Writing+%26+Communication" className="hover:text-grape transition-colors">
              Writing
            </Link>
            <Link href="/agents?category=Money+%26+Finances" className="hover:text-grape transition-colors">
              Money
            </Link>
            <Link href="/agents?category=Learning+%26+Skills" className="hover:text-grape transition-colors">
              Learning
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/agents"
              className="hidden sm:flex items-center gap-1.5 text-sm text-muted border border-grape/15 rounded-full px-3 py-1.5 hover:border-grape/40 hover:text-grape transition-colors"
            >
              <Search size={14} />
              Search agents…
            </Link>
            <NavAuthLinks />
            <Link
              href="/submit"
              className="hidden sm:block text-sm font-semibold text-grape border border-grape/30 px-4 py-2 rounded-full hover:bg-grape/5 transition-colors"
            >
              Submit an Agent
            </Link>
            <Link
              href="/agents"
              className="bg-grape text-white text-sm font-semibold px-4 py-2 rounded-full hover:brightness-110 transition"
            >
              Browse All
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
