import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { Header } from '@/components/Header'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: {
    default: 'AgentFinder — Discover AI Agents for Your Business',
    template: '%s | AgentFinder',
  },
  description:
    'Browse, compare, and find the right AI agents for your team. Verified listings and real reviews from business professionals.',
  openGraph: {
    siteName: 'AgentFinder',
    type: 'website',
    title: 'AgentFinder — Discover AI Agents for Your Business',
    description:
      'Browse, compare, and find the right AI agents for your team. Verified listings and real reviews from business professionals.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgentFinder — Discover AI Agents for Your Business',
    description:
      'Browse, compare, and find the right AI agents for your team. Verified listings and real reviews from business professionals.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <footer className="border-t border-slate-200 bg-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">AgentFinder</span>
              <div className="flex items-center gap-5">
                <Link href="/feedback" className="hover:text-indigo-600 transition-colors">
                  Send feedback
                </Link>
                <span>© 2026 AgentFinder · Find AI agents that fit your life.</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
