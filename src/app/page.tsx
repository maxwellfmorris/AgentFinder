import Link from 'next/link'
import { ArrowRight, CheckCircle, Star, Zap, Shield } from 'lucide-react'
import { getAgents, getFeaturedAgents } from '@/lib/agents'
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

  // Supplement with other published agents until we have 3 cards
  const featuredIds = new Set(homepageFeatured.map((a) => a.id))
  const others = (await getAgents()).filter((a) => !featuredIds.has(a.id))

  const displayAgents: Array<{ agent: Agent; sponsored: boolean }> = [
    ...homepageFeatured.map((a) => ({ agent: a, sponsored: true })),
    ...others.map((a) => ({ agent: a, sponsored: false })),
  ].slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-coral via-punch to-grape text-white rounded-b-[44px]">
        <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 left-[6%] w-44 h-44 rounded-full bg-white/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-7">
            No sales calls. No enterprise pricing. Just honest reviews.
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.03] tracking-tight max-w-3xl mx-auto">
            Find AI agents that
            <span className="text-butter"> fit your life</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Discover and compare AI tools for the things you actually do — writing, planning,
            learning, managing the parts of life that aren&apos;t your job. Honest reviews from
            real people, no enterprise jargon.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/agents"
              className="inline-flex items-center justify-center gap-2 bg-butter text-ink font-bold text-lg px-8 py-4 rounded-full hover:brightness-105 transition shadow-lg shadow-punch/30"
            >
              Browse AI Agents
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/agents?pricing=free,freemium"
              className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold text-lg px-8 py-4 rounded-full border border-white/40 hover:bg-white/25 transition-colors"
            >
              Start for Free
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/85">
            {['No credit card required', 'Affiliate disclosure on every link', 'Plain-language explanations'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={15} className="text-butter" />
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
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-8">What can we help you with?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group flex flex-col items-center gap-2 bg-white rounded-2xl p-4 text-center shadow-[0_8px_20px_rgba(255,107,74,0.08)] hover:shadow-[0_12px_28px_rgba(139,47,230,0.14)] hover:-translate-y-0.5 transition-all"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-ink/80 group-hover:text-grape leading-snug">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Life-stage chip row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 pb-12">
        <p className="text-sm font-semibold text-muted mb-4">Or browse by who you are</p>
        <div className="flex flex-wrap gap-2">
          {LIFE_STAGE_CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={`/agents?industry=${encodeURIComponent(chip.label)}`}
              className="inline-flex items-center gap-1.5 bg-white border border-grape/15 text-ink/80 text-sm font-medium px-4 py-2 rounded-full hover:border-grape/40 hover:text-grape hover:bg-grape/5 transition-colors"
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
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            A few to get you started
          </h2>
          <Link href="/agents" className="text-sm font-semibold text-grape hover:text-punch flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAgents.map(({ agent, sponsored }) => (
            <div key={agent.id}>
              <AgentCard agent={agent} />
              {sponsored && isFeatured(agent) && (
                <p className="text-[11px] text-muted/70 mt-1 pl-1">sponsored</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-ink text-white rounded-t-[44px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid sm:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white/10 p-3 rounded-xl">
              <Shield size={28} className="text-butter" />
            </div>
            <h3 className="font-display font-bold text-lg">Tiered verification</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Every listing climbs a four-tier ladder — from self-submitted to independently audited — so you always know how much scrutiny an agent has passed before you give it your data.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white/10 p-3 rounded-xl">
              <Star size={28} className="text-butter" />
            </div>
            <h3 className="font-display font-bold text-lg">Honest reviews, no kickbacks</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Reviews come from verified users — never paid, never editorialized. We earn a commission when you subscribe to an agent, but that never affects our rankings or trust tiers. Featured placements are clearly labeled &ldquo;sponsored.&rdquo;
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white/10 p-3 rounded-xl">
              <Zap size={28} className="text-butter" />
            </div>
            <h3 className="font-display font-bold text-lg">Made for everyday life</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              From drafting a hard message to planning a healthy week, we explain what each agent actually does in plain language — without the enterprise jargon.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
