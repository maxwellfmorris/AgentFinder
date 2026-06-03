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
  Check,
  Info,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { getAgentBySlug, getFeedbackDimensions, getLatestEvalsForAgent, getReviewStatsForAgent, getSimilarAgents, getOutboundUrl } from '@/lib/agents'
import { getSupabaseServer } from '@/lib/supabase-server'
import { PRICING_LABELS, COMPLEXITY_LABELS, COMPLEXITY_DESCRIPTIONS, TIER_DESCRIPTIONS } from '@/types/database'
import { TierChip } from '@/components/TierChip'
import { EvalRow } from '@/components/EvalRow'
import { ReviewsSection } from '@/components/ReviewsSection'
import { OutboundLink } from '@/components/OutboundLink'

// Compact count formatter: 181200 → "181k", 4100000 → "4.1M", 60 → "60"
function formatRatingCount(n: number): string {
  if (n >= 1_000_000) {
    const m = (n / 1_000_000).toFixed(1)
    return `${m.endsWith('.0') ? m.slice(0, -2) : m}M`
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

interface PageProps {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps) {
  const agent = await getAgentBySlug(params.slug)
  if (!agent) return {}

  const title = `${agent.name} Review — ${agent.tagline} | Bindie`
  const description = agent.description.slice(0, 155) + '…'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Bindie',
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

  const [evals, reviewStats, similarAgents, feedbackDimensions] = await Promise.all([
    getLatestEvalsForAgent(agent.id),
    getReviewStatsForAgent(agent.id),
    getSimilarAgents(agent.slug, agent.category, 2),
    getFeedbackDimensions(agent.id),
  ])

  // Workshop user state — only when the agent is enrolled and the user is signed in.
  // Drives the three-way callout (offer / pending / earned).
  const workshopActive = agent.workshop_active && !agent.workshop_paused
  let workshopUserState: 'none' | 'pending' | 'earned' = 'none'
  let earnedCode: string | null = null
  if (workshopActive) {
    const supabase = getSupabaseServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: code } = await supabase
        .from('workshop_credit_codes')
        .select('code')
        .eq('agent_id', agent.id)
        .eq('claimed_by_user_id', user.id)
        .maybeSingle()
      if (code) {
        workshopUserState = 'earned'
        earnedCode = (code as { code: string }).code
      } else {
        const { data: pending } = await supabase
          .from('reviews')
          .select('id')
          .eq('agent_id', agent.id)
          .eq('user_id', user.id)
          .eq('incentivized', true)
          .eq('approved', false)
          .maybeSingle()
        if (pending) workshopUserState = 'pending'
      }
    }
  }

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bindie.ai'

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

  // Defensive: tolerate rows from before the use_cases / limitations columns existed
  const useCases = agent.use_cases ?? []
  const limitations = agent.limitations ?? []
  const outbound = getOutboundUrl(agent)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back */}
      <Link
        href="/agents"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-grape mb-8 font-medium"
      >
        <ArrowLeft size={15} />
        Back to all agents
      </Link>

      <div className="bg-white rounded-2xl border border-grape/10 shadow-[0_8px_20px_rgba(255,107,74,0.06)] overflow-hidden">
        {/* Hero section */}
        <div className="p-6 sm:p-8 border-b border-grape/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-grape/10 flex-shrink-0">
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
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-grape/40 bg-cream">
                  {agent.name[0]}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-bold text-ink">{agent.name}</h1>
                <TierChip tier={agent.trust_tier} size="md" />
              </div>

              <p className="text-muted font-medium mb-3">{agent.tagline}</p>

              {(reviewStats.verifiedCount > 0 || reviewStats.totalCount > 0) ? (() => {
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
                      <span className="font-bold text-ink">{primaryAvg.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted/70 mt-0.5">
                      {reviewStats.verifiedCount > 0
                        ? `Verified-user avg · ${reviewStats.verifiedCount} ${reviewStats.verifiedCount === 1 ? 'review' : 'reviews'} · all reviews avg ${reviewStats.totalAvg!.toFixed(1)} (${reviewStats.totalCount} total)`
                        : `${reviewStats.totalCount} reviews — none from verified users yet`
                      }
                    </p>
                  </div>
                )
              })() : (agent.external_rating !== null && agent.external_rating_url) ? (
                <a
                  href={agent.external_rating_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm hover:text-grape transition-colors"
                  aria-label={`Rated ${agent.external_rating} on ${agent.external_rating_source ?? 'external source'}, opens in new tab`}
                >
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-ink">{agent.external_rating.toFixed(1)}</span>
                  {agent.external_rating_count !== null && (
                    <>
                      <span className="text-muted/40">·</span>
                      <span className="text-muted">{formatRatingCount(agent.external_rating_count)} ratings</span>
                    </>
                  )}
                  {agent.external_rating_source && (
                    <>
                      <span className="text-muted/40">·</span>
                      <span className="text-muted">{agent.external_rating_source}</span>
                    </>
                  )}
                  <ExternalLink size={12} className="text-muted/60 ml-0.5" />
                </a>
              ) : null}
              </div>
            </div>

            {outbound.url !== '#' && (
              <div className="flex-shrink-0 w-full lg:w-auto">
                <OutboundLink
                  agentId={agent.id}
                  url={outbound.url}
                  isAffiliate={outbound.isAffiliate}
                  source="detail"
                  className="inline-flex items-center justify-center gap-2 bg-butter text-ink font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-105 transition shadow-sm shadow-punch/20 w-full lg:w-auto"
                  ariaLabel={`Visit ${agent.name} website${outbound.isAffiliate ? ' (affiliate link)' : ''}`}
                >
                  Visit Website
                  <ExternalLink size={14} />
                </OutboundLink>
                {outbound.isAffiliate && (
                  <p className="text-xs italic text-muted/70 mt-1.5 text-center lg:text-right">
                    Affiliate link ·{' '}
                    <Link href="/disclosure" className="underline hover:text-grape">
                      how this works
                    </Link>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Compare: small inline links right under the hero */}
        {similarAgents.length > 0 && (
          <div className="px-6 sm:px-8 py-3 border-b border-grape/10 text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider text-muted/80 mr-2">Compare:</span>
            {similarAgents.map((other, i) => (
              <span key={other.slug}>
                {i > 0 && <span className="text-muted/40"> · </span>}
                <Link
                  href={`/compare?agents=${agent.slug},${other.slug}`}
                  className="text-grape hover:text-punch font-semibold"
                >
                  vs {other.name}
                </Link>
              </span>
            ))}
            {similarAgents.length > 1 && (
              <>
                <span className="text-muted/40"> · </span>
                <Link
                  href={`/compare?agents=${agent.slug},${similarAgents.map((s) => s.slug).join(',')}`}
                  className="text-grape hover:text-punch font-semibold"
                >
                  Compare all
                </Link>
              </>
            )}
          </div>
        )}

        {/* Workshop campaign callout — three states: offer / pending / earned */}
        {workshopActive && (
          <div className="px-6 sm:px-8 py-4 border-b border-grape/10 bg-grape/5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Sparkles size={18} className="text-grape" />
              </div>
              <div className="flex-1 min-w-0">
                {workshopUserState === 'earned' && earnedCode ? (
                  <>
                    <h3 className="font-display text-sm font-bold text-ink mb-1">
                      You earned {agent.workshop_credit_type ?? 'credit'}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-1.5">
                      Your code:{' '}
                      <code className="px-2 py-0.5 rounded bg-white border border-grape/20 font-mono text-ink text-sm">
                        {earnedCode}
                      </code>
                    </p>
                    {agent.workshop_credit_redemption_url && (
                      <a
                        href={agent.workshop_credit_redemption_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-grape hover:text-punch"
                      >
                        Redeem now <ExternalLink size={11} />
                      </a>
                    )}
                  </>
                ) : workshopUserState === 'pending' ? (
                  <>
                    <h3 className="font-display text-sm font-bold text-ink mb-0.5">
                      Your review is awaiting verification
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      Once approved, your {agent.workshop_credit_type ?? 'credit'} will appear here.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-display text-sm font-bold text-ink mb-0.5">
                      Workshop campaign · Earn {agent.workshop_credit_type ?? 'credits'} for a verified review
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {agent.workshop_credit_redemption_instructions ??
                        'Use the agent, submit an honest review, and earn credits with the developer once verified.'}{' '}
                      <Link href="#reviews" className="font-semibold text-grape hover:text-punch underline">
                        Submit a review →
                      </Link>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Good for — desktop: full-width above the details grid (mobile copy lives inside the grid below) */}
        {useCases.length > 0 && (
          <GoodFor useCases={useCases} className="hidden sm:block p-8 border-b border-grape/10" />
        )}

        {/* Details grid */}
        <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-grape/10">
          {/* About */}
          <div className="p-8">
            <h2 className="text-sm font-bold text-muted uppercase tracking-wider mb-4">
              About
            </h2>
            <p className="text-ink/80 leading-relaxed">{agent.description}</p>
          </div>

          {/* Good for — mobile only: sits between About and At a Glance */}
          {useCases.length > 0 && (
            <GoodFor useCases={useCases} className="sm:hidden p-8" />
          )}

          {/* Quick facts */}
          <div className="p-8">
            <h2 className="text-sm font-bold text-muted uppercase tracking-wider mb-4">
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
                <span className="text-xs text-muted/70 ml-2">
                  {COMPLEXITY_DESCRIPTIONS[agent.setup_complexity]}
                </span>
              </Fact>

              <Fact icon={<Shield size={15} />} label="Trust">
                <TierChip tier={agent.trust_tier} size="md" />
                <span className="text-xs text-muted/70 ml-2">
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
                        className="text-xs bg-grape/5 text-muted px-2.5 py-1 rounded-full"
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
                        className="text-xs bg-grape/5 text-muted px-2.5 py-1 rounded-full"
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

        {/* Things to know — collapsed editorial caveats; native <details> for zero JS */}
        {limitations.length > 0 && (
          <details className="border-t border-grape/10 group">
            <summary className="flex items-center gap-2 cursor-pointer px-6 sm:px-8 py-3 text-xs font-bold text-muted uppercase tracking-wider hover:text-grape transition-colors list-none [&::-webkit-details-marker]:hidden">
              <Info size={14} className="text-muted/60" />
              <span>Things to know</span>
              <ChevronDown size={14} className="ml-auto text-muted/60 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="px-6 sm:px-8 pb-5 pt-1 space-y-1.5">
              {limitations.map((lim) => (
                <li key={lim} className="flex items-start gap-2 text-sm text-muted leading-relaxed">
                  <span className="text-muted/40 flex-shrink-0">·</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {/* Performance */}
      <div className="mt-8 bg-white rounded-2xl border border-grape/10 shadow-[0_8px_20px_rgba(255,107,74,0.06)] p-8">
        <h2 className="font-display text-lg font-bold text-ink mb-6">
          Performance
        </h2>
        {evals.length === 0 ? (
          <p className="text-sm text-muted/70 text-center py-4">
            No published evals yet. Agents reach the Vetted tier by publishing benchmark scores.
          </p>
        ) : (
          <div className="divide-y divide-grape/10">
            {evals.map((e) => (
              <EvalRow key={e.id} eval_={e} />
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <ReviewsSection
          agentId={agent.id}
          workshopActive={workshopActive}
          creditType={agent.workshop_credit_type}
          feedbackDimensions={feedbackDimensions}
        />
      </div>

      {/* Back CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/agents"
          className="text-sm font-semibold text-grape hover:text-punch"
        >
          ← Browse more agents like this one
        </Link>
      </div>
    </div>
  )
}

function GoodFor({ useCases, className }: { useCases: string[]; className: string }) {
  return (
    <div className={className}>
      <h2 className="text-sm font-bold text-muted uppercase tracking-wider mb-4">Good for</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {useCases.map((useCase) => (
          <div
            key={useCase}
            className="flex items-start gap-2.5 bg-grape/5 rounded-2xl px-4 py-3"
          >
            <Check size={16} className="text-grape flex-shrink-0 mt-0.5" />
            <span className="text-sm text-ink/80 leading-snug">{useCase}</span>
          </div>
        ))}
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
      <dt className="flex items-center gap-1.5 text-xs font-semibold text-muted uppercase tracking-wide mb-1">
        {icon}
        {label}
      </dt>
      <dd className="text-sm text-ink/80 pl-5">{children}</dd>
    </div>
  )
}
