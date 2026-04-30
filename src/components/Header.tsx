import Link from 'next/link'
import { Search, Bot } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="bg-indigo-600 text-white rounded-lg p-1.5">
              <Bot size={18} />
            </div>
            AgentFinder
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/agents" className="hover:text-indigo-600 transition-colors">
              Browse Agents
            </Link>
            <Link href="/agents?category=Writing+%26+Communication" className="hover:text-indigo-600 transition-colors">
              Writing
            </Link>
            <Link href="/agents?category=Productivity+%26+Meetings" className="hover:text-indigo-600 transition-colors">
              Meetings
            </Link>
            <Link href="/agents?category=Data+%26+Analytics" className="hover:text-indigo-600 transition-colors">
              Analytics
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/agents"
              className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 border border-slate-200 rounded-full px-3 py-1.5 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              <Search size={14} />
              Search agents…
            </Link>
            <Link
              href="/agents"
              className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Browse All
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
