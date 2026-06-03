import type { Metadata } from 'next'
import Link from 'next/link'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Bindie — Find AI That Fits Your Life',
    template: '%s | Bindie',
  },
  description:
    'Discover and compare AI agents for everyday life — writing, money, learning, home, health, and travel. Real reviews and honest listings to help you find the right fit.',
  openGraph: {
    siteName: 'Bindie',
    type: 'website',
    title: 'Bindie — Find AI That Fits Your Life',
    description:
      'Discover and compare AI agents for everyday life — writing, money, learning, home, health, and travel. Real reviews and honest listings to help you find the right fit.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bindie — Find AI That Fits Your Life',
    description:
      'Discover and compare AI agents for everyday life — writing, money, learning, home, health, and travel. Real reviews and honest listings to help you find the right fit.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-cream text-ink font-sans">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <footer className="border-t border-grape/10 bg-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted">
              <span className="font-display font-semibold text-ink">Bindie</span>
              <div className="flex items-center gap-5">
                <Link href="/feedback" className="hover:text-grape transition-colors">
                  Send feedback
                </Link>
                <Link href="/disclosure" className="hover:text-grape transition-colors">
                  Affiliate disclosure
                </Link>
                <span>© 2026 Bindie · Find AI that fits your life.</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
