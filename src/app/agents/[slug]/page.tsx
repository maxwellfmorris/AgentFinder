import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  ExternalLink,
  ArrowLeft,
  Zap,
  Tag,
  Puzzle,
  Building2,
  Shield,
} from 'lucide-react'
import { getAgentBySlug, getLatestEvalsForAgent, getReviewStatsForAgent, getTasksForAgent } from '@/lib/agents'
import { PRICING_LABELS, COMPLEXITY_LABELS, COMPLEXITY_DESCRIPTIONS, TIER_DESCRIPTIONS } from '@/types/database'
import { TierChip } from '@/components/TierChip'
import { EvalRow } from '@/components/EvalRow'
import { ReviewsSection } from '@/components/ReviewsSection'
import { QuickTaskCard } from '@/components/QuickTaskCard'

interface PageProps {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps) {
  const agent = await getAgentBySlug(params.slug)
  if (!agent) return {}

  const title = `${agent.name} Review — ${agent.tagline} | AgentFinder`
  const description = agent.description.slice(0, 155) + '…'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'AgentFinder',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function AgentDetailPage({ params }: PageProps) {
  const agent = await getAgentBySlug(params.slug)
  if (!agent) notFound()

  const [evals, reviewStats, tasks] = await Promise.all([
    getLatestEvalsForAgent(agent.id),
    getReviewStatsForAgent(agent.id),
    getTasksForAgent(agent.id),
  ])

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://agentfinder.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: agent.name,
    description: agent.description,
    url: agent.website ?? `${BASE_URL}/agents/${agent.slug}`,
    applicationCategory: 'BusinessApplication',
    ...(agent.average_rating !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: agent.average_rating,
        reviewCount: agent.review_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    offers: {
      '@type': 'Offer',
      price: agent.pricing_model === 'free' ? '0' : undefined,
      priceCurrency: 'USD',
    },
  }

  const complexityColor = {
    plug_and_play: 'bg-emerald-100 text-emerald-800',
    low: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-red-100 text-red-800',
  }[agent.setup_complexity]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back */}
      <Link
        href="/agents"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-8 font-medium"
      >
        <ArrowLeft size={15} />
        Back to all agents
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Hero section */}
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
              {agent.logo_url ? (
                <Image
                  src={agent.logo_url}
                  alt={`${agent.name} logo`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-300 bg-slate-50">
                  {agent.name[0]}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{agent.name}</h1>
                <TierChip tier={agent.trust_tier} size="md" />
              </div>

              <p className="text-slate-600 font-medium mb-3">{agent.tagline}</p>

              {(reviewStats.verifiedCount > 0 || reviewStats.totalCount > 0) && (() => {
                const primaryAvg = reviewStats.verifiedCount > 0
                  ? reviewStats.verifiedAvg!
                  : reviewStats.totalAvg!
                return (
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={16}
                            className={
                              n <= Math.round(primaryAvg)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200 fill-slate-200'
                            }
                          />
                        ))}
                      </div>
                      <span className="font-bold text-slate-900">{primaryAvg.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {reviewStats.verifiedCount > 0
                        ? `Verified-user avg · ${reviewStats.verifiedCount} ${reviewStats.verifiedCount === 1 ? 'review' : 'reviews'} · all reviews avg ${reviewStats.totalAvg!.toFixed(1)} (${reviewStats.totalCount} total)`
                        : `${reviewStats.totalCount} reviews — none from verified users yet`
                      }
                    </p>
                  </div>
                )
              })()}
            </div>

            {agent.website && (
              <a
                href={agent.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors"
              >
                Visit Website
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Tasks — only rendered when at least one task exists */}
        {tasks.length > 0 && (
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              Quick Tasks
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {tasks.map((task) => (
                <QuickTaskCard key={task.id} task={task} agentWebsite={agent.website} />
              ))}
            </div>
          </div>
        )}

        {/* Details grid */}
        <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* About */}
          <div className="p-8">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              About
            </h2>
            <p className="text-slate-700 leading-relaxed">{agent.description}</p>
          </div>

          {/* Quick facts */}
          <div className="p-8">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              At a Glance
            </h2>
            <dl className="space-y-4">
              <Fact icon={<Tag size={15} />} label="Category">
                {agent.category}
              </Fact>

              <Fact icon={<Zap size={15} />} label="Setup">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${complexityColor}`}>
                  {COMPLEXITY_LABELS[agent.setup_complexity]}
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  {COMPLEXITY_DESCRIPTIONS[agent.setup_complexity]}
                </span>
              </Fact>

              <Fact icon={<Shield size={15} />} label="Trust">
                <TierChip tier={agent.trust_tier} size="md" />
                <span className="text-xs text-slate-400 ml-2">
                  {TIER_DESCRIPTIONS[agent.trust_tier]}
                </span>
              </Fact>

              <Fact icon={<Tag size={15} />} label="Pricing">
                {PRICING_LABELS[agent.pricing_model]}
              </Fact>

              {agent.industry_tags.length > 0 && (
                <Fact icon={<Building2 size={15} />} label="Best for">
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {agent.industry_tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Fact>
              )}

              {agent.platform_integrations.length > 0 && (
                <Fact icon={<Puzzle size={15} />} label="Integrations">
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {agent.platform_integrations.map((int) => (
                      <span
                        key={int}
                        className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </Fact>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6">
          Performance
        </h2>
        {evals.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">
            No published evals yet. Agents reach the Vetted tier by publishing benchmark scores.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {evals.map((e) => (
              <EvalRow key={e.id} eval_={e} />
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <ReviewsSection agentId={agent.id} />
      </div>

      {/* Back CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/agents"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          ← Browse more agents like this one
        </Link>
      </div>
    </div>
  )
}

function Fact({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
        {icon}
        {label}
      </dt>
      <dd className="text-sm text-slate-700 pl-5">{children}</dd>
    </div>
  )
}
