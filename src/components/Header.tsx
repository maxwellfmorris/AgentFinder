import Link from 'next/link'
import { Search, Bot } from 'lucide-react'
import { NavAuthLinks } from './NavAuthLinks'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-grape/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-ink">
            <div className="bg-gradient-to-br from-coral to-grape text-white rounded-lg p-1.5">
              <Bot size={18} />
            </div>
            AgentFinder
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
