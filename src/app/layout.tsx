import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'AgentFinder — Discover AI Agents for Your Business',
  description:
    'Browse, compare, and find the right AI agents for your team. Trusted reviews from real professionals.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <Header />
        <main>{children}</main>
        <footer className="border-t border-slate-200 bg-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">AgentFinder</span>
            <span>© 2024 AgentFinder. Find the right AI agent for your team.</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
