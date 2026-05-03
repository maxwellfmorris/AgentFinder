import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Zap, Shield } from 'lucide-react'
import { PLACEHOLDER_AGENTS } from '@/lib/agents'
import { AgentCard } from '@/components/AgentCard'

const CATEGORIES = [
  { label: 'Writing & Communication', emoji: '✍️', href: '/agents?category=Writing+%26+Communication' },
  { label: 'Meetings & Notes', emoji: '📋', href: '/agents?category=Productivity+%26+Meetings' },
  { label: 'Data & Analytics', emoji: '📊', href: '/agents?category=Data+%26+Analytics' },
  { label: 'HR & Recruiting', emoji: '🤝', href: '/agents?category=HR+%26+Recruiting' },
  { label: 'Customer Success', emoji: '💚', href: '/agents?category=Customer+Success' },
  { label: 'Sales', emoji: '📈', href: '/agents?category=Sales' },
]

export default function HomePage() {
  const featured = PLACEHOLDER_AGENTS.filter((a) =>
    ['verified', 'vetted', 'audited'].includes(a.trust_tier)
  ).slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Star size={12} className="fill-indigo-500 text-indigo-500" />
            Trusted by 10,000+ business professionals
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight max-w-3xl mx-auto">
            Find the right AI agent
            <span className="text-indigo-600"> for your team</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AgentFinder helps you discover, compare, and choose AI agents you can trust — without
            needing a tech background. Real reviews from real professionals.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold text-lg px-8 py-4 rounded-full hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              Browse AI Agents
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/agents?pricing=free,freemium"
              className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold text-lg px-8 py-4 rounded-full border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
            >
              Start for Free
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            {['No credit card required', 'Verified agent listings', 'Plain-language explanations'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={15} className="text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">What can we help you with?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group flex flex-col items-center gap-2 bg-white rounded-2xl border border-slate-200 p-4 text-center hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700 leading-snug">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured agents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Top-rated agents this month
          </h2>
          <Link href="/agents" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid sm:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-indigo-500/20 p-3 rounded-xl">
              <Shield size={28} className="text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg">Tiered verification</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every listing climbs a four-tier ladder — from self-submitted to independently audited — so you always know exactly how much scrutiny an agent has passed.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-indigo-500/20 p-3 rounded-xl">
              <Star size={28} className="text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg">Real reviews</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ratings come from verified users — no fake reviews, no paid placements.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-indigo-500/20 p-3 rounded-xl">
              <Zap size={28} className="text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg">Built for non-techies</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We translate setup complexity and pricing into plain language anyone can understand.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
