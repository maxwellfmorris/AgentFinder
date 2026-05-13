import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Zap, Shield } from 'lucide-react'
import { PLACEHOLDER_AGENTS, getFeaturedAgents } from '@/lib/agents'
import { AgentCard } from '@/components/AgentCard'
import { HomeSearch } from '@/components/HomeSearch'
import { isFeatured } from '@/types/database'
import type { Agent } from '@/types/database'

const CATEGORIES = [
  { label: 'Writing & Communication', emoji: '✍️', href: '/agents?category=Writing+%26+Communication' },
  { label: 'Learning & Skills', emoji: '📚', href: '/agents?category=Learning+%26+Skills' },
  { label: 'Money & Finances', emoji: '💰', href: '/agents?category=Money+%26+Finances' },
  { label: 'Home & Family', emoji: '🏠', href: '/agents?category=Home+%26+Family' },
  { label: 'Health & Wellness', emoji: '💪', href: '/agents?category=Health+%26+Wellness' },
  { label: 'Hobbies & Creative', emoji: '🎨', href: '/agents?category=Hobbies+%26+Creative' },
  { label: 'Travel & Planning', emoji: '✈️', href: '/agents?category=Travel+%26+Planning' },
]

const LIFE_STAGE_CHIPS = [
  { label: 'Parents', emoji: '👨‍👩‍👧' },
  { label: 'Students', emoji: '🎓' },
  { label: 'Renters', emoji: '🏠' },
  { label: 'Job Seekers', emoji: '💼' },
  { label: 'Caregivers', emoji: '🤝' },
  { label: 'Travelers', emoji: '✈️' },
  { label: 'Creators', emoji: '🎨' },
  { label: 'Hobbyists', emoji: '🔧' },
  { label: 'Couples', emoji: '💑' },
  { label: 'Quantified-Self', emoji: '📊' },
]

export default async function HomePage() {
  const homepageFeatured = await getFeaturedAgents({ tier: 'homepage', limit: 3 })

  // Supplement with top-rated placeholders until we have 3 cards
  const featuredIds = new Set(homepageFeatured.map((a) => a.id))
  const topRated = PLACEHOLDER_AGENTS.filter(
    (a) => ['verified', 'vetted', 'audited'].includes(a.trust_tier) && !featuredIds.has(a.id)
  )

  const displayAgents: Array<{ agent: Agent; sponsored: boolean }> = [
    ...homepageFeatured.map((a) => ({ agent: a, sponsored: true })),
    ...topRated.map((a) => ({ agent: a, sponsored: false })),
  ].slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            No sales calls. No enterprise pricing. Just honest reviews.
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight max-w-3xl mx-auto">
            Find AI agents that
            <span className="text-indigo-600"> actually fit your life</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover and compare AI tools for the things you actually do — writing, planning,
            learning, managing the parts of life that aren&apos;t your job. Honest reviews from
            real users, no enterprise jargon.
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
            {['No credit card required', 'Affiliate disclosure on every link', 'Plain-language explanations'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={15} className="text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Task-driven search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <HomeSearch />
      </section>

      {/* Browse by category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">What can we help you with?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
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

      {/* Life-stage chip row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 pb-12">
        <p className="text-sm font-semibold text-slate-500 mb-4">Or browse by who you are</p>
        <div className="flex flex-wrap gap-2">
          {LIFE_STAGE_CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={`/agents?industry=${encodeURIComponent(chip.label)}`}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-full hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              <span>{chip.emoji}</span>
              {chip.label}
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
          {displayAgents.map(({ agent, sponsored }) => (
            <div key={agent.id}>
              <AgentCard agent={agent} />
              {sponsored && isFeatured(agent) && (
                <p className="text-[11px] text-slate-400 mt-1 pl-1">sponsored</p>
              )}
            </div>
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
              Every listing climbs a four-tier ladder — from self-submitted to independently audited — so you always know how much scrutiny an agent has passed before you give it your data.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-indigo-500/20 p-3 rounded-xl">
              <Star size={28} className="text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg">Honest reviews, no kickbacks</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Reviews come from verified users — never paid, never editorialized. We earn a commission when you subscribe to an agent, but that never affects our rankings or trust tiers. Featured placements are clearly labeled &ldquo;sponsored.&rdquo;
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-indigo-500/20 p-3 rounded-xl">
              <Zap size={28} className="text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg">Made for everyday life</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              From drafting a hard message to planning a healthy week, we explain what each agent actually does in plain language — without the enterprise jargon.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
