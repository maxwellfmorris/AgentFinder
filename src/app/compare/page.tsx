import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, ExternalLink, Check } from 'lucide-react'
import { getAgentsBySlugs, getOutboundUrl } from '@/lib/agents'
import { PRICING_LABELS, COMPLEXITY_LABELS } from '@/types/database'
import type { Agent } from '@/types/database'
import { TierChip } from '@/components/TierChip'
import { OutboundLink } from '@/components/OutboundLink'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare AI Agents',
  description:
    'Compare AI agents side-by-side — pricing, setup, ratings, and what each is good for.',
}

interface PageProps {
  searchParams: { agents?: string }
}

// Semantic chip colors (duplicated from AgentCard for now; small enough not to abstract yet)
const COMPLEXITY_COLOR: Record<string, string> = {
  plug_and_play: 'bg-emerald-100 text-emerald-700',
  low: 'bg-green-100 text-green-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
}

const PRICING_COLOR: Record<string, string> = {
  free: 'bg-emerald-100 text-emerald-700',
  freemium: 'bg-blue-100 text-blue-700',
  subscription: 'bg-violet-100 text-violet-700',
  usage_based: 'bg-orange-100 text-orange-700',
  enterprise: 'bg-slate-100 text-slate-700',
}

// 181200 → "181k", 4100000 → "4.1M", 60 → "60"
function formatRatingCount(n: number): string {
  if (n >= 1_000_000) {
    const m = (n / 1_000_000).toFixed(1)
    return `${m.endsWith('.0') ? m.slice(0, -2) : m}M`
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

export default async function ComparePage({ searchParams }: PageProps) {
  const raw = searchParams.agents ?? ''
  const slugs = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)

  const fetched = slugs.length ? await getAgentsBySlugs(slugs) : []
  // Preserve the order from the URL (the query is unordered)
  const agents = slugs
    .map((slug) => fetched.find((a) => a.slug === slug))
    .filter((a): a is Agent => Boolean(a))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/agents"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-grape mb-6 font-medium"
      >
        <ArrowLeft size={15} />
        Back to all agents
      </Link>

      {agents.length === 0 ? (
        <Suspense>
          <EmptyState />
        </Suspense>
      ) : (
        <>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mb-2">
            {agents.length === 1 ? agents[0].name : 'Compared side-by-side'}
          </h1>
          <p className="text-muted mb-8">
            {agents.length} {agents.length === 1 ? 'agent' : 'agents'}
            {agents.length < 3 && (
              <>
                {' '}·{' '}
                <Link href="/agents" className="text-grape hover:text-punch font-semibold">
                  add another →
                </Link>
              </>
            )}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <CompareColumn key={agent.id} agent={agent} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-grape/10 shadow-[0_8px_20px_rgba(255,107,74,0.06)] text-center py-16 px-6">
      <div className="text-5xl mb-4">⚖️</div>
      <h1 className="font-display text-2xl font-bold text-ink mb-2">Compare AI agents</h1>
      <p className="text-muted text-sm max-w-md mx-auto mb-6">
        Pick a couple of agents and see them side-by-side — pricing, setup, ratings, and what
        each is good for. Start from any agent&apos;s detail page and tap one of the &ldquo;vs&rdquo;
        links.
      </p>
      <Link
        href="/agents"
        className="inline-flex items-center gap-2 bg-grape text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:brightness-110 transition"
      >
        Browse all agents
      </Link>
    </div>
  )
}

function CompareColumn({ agent }: { agent: Agent }) {
  const outbound = getOutboundUrl(agent)
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_14px_34px_rgba(139,47,230,0.10)] flex flex-col">
      {/* Signature top accent */}
      <div className="h-1.5 bg-gradient-to-r from-coral via-punch to-grape" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-grape/10 bg-cream">
            {agent.logo_url ? (
              <Image
                src={agent.logo_url}
                alt={`${agent.name} logo`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-grape/40">
                {agent.name[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <h2 className="font-display font-bold text-ink text-lg leading-snug">
                {agent.name}
              </h2>
              <TierChip tier={agent.trust_tier} />
            </div>
            <p className="text-sm font-semibold text-ink line-clamp-2">{agent.tagline}</p>
          </div>
        </div>

        <Row label="Rating">
          {agent.external_rating !== null && agent.external_rating_url ? (
            <a
              href={agent.external_rating_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-grape transition-colors"
              aria-label={`Rated ${agent.external_rating} on ${agent.external_rating_source ?? 'external source'}, opens in new tab`}
            >
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="font-semibold text-ink/80">{agent.external_rating.toFixed(1)}</span>
              {agent.external_rating_count !== null && (
                <>
                  <span className="text-muted/40">·</span>
                  <span>{formatRatingCount(agent.external_rating_count)}</span>
                </>
              )}
              {agent.external_rating_source && (
                <>
                  <span className="text-muted/40">·</span>
                  <span>{agent.external_rating_source}</span>
                </>
              )}
              <ExternalLink size={11} className="ml-0.5" />
            </a>
          ) : (
            <span className="text-sm text-muted/60">—</span>
          )}
        </Row>

        <Row label="Pricing">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${PRICING_COLOR[agent.pricing_model]}`}
          >
            {PRICING_LABELS[agent.pricing_model]}
          </span>
        </Row>

        <Row label="Setup">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${COMPLEXITY_COLOR[agent.setup_complexity]}`}
          >
            {COMPLEXITY_LABELS[agent.setup_complexity]}
          </span>
        </Row>

        <Row label="Category">
          <span className="text-sm text-ink/80">{agent.category}</span>
        </Row>

        {agent.industry_tags.length > 0 && (
          <Row label="Who it's for">
            <div className="flex flex-wrap gap-1">
              {agent.industry_tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-grape/5 text-muted px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Row>
        )}

        {agent.use_cases.length > 0 && (
          <Row label="Good for">
            <ul className="space-y-1.5">
              {agent.use_cases.map((uc) => (
                <li key={uc} className="flex items-start gap-1.5 text-sm text-ink/80">
                  <Check size={14} className="text-grape flex-shrink-0 mt-0.5" />
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </Row>
        )}

        {agent.platform_integrations.length > 0 && (
          <Row label="Works with">
            <div className="flex flex-wrap gap-1">
              {agent.platform_integrations.slice(0, 4).map((int) => (
                <span
                  key={int}
                  className="text-xs bg-grape/5 text-muted px-2 py-0.5 rounded-full"
                >
                  {int}
                </span>
              ))}
              {agent.platform_integrations.length > 4 && (
                <span className="text-xs bg-grape/5 text-muted px-2 py-0.5 rounded-full">
                  +{agent.platform_integrations.length - 4} more
                </span>
              )}
            </div>
          </Row>
        )}

        {/* CTAs */}
        <div className="mt-auto pt-5 space-y-2.5">
          {outbound.url !== '#' && (
            <div>
              <OutboundLink
                agentId={agent.id}
                url={outbound.url}
                isAffiliate={outbound.isAffiliate}
                source="compare"
                className="w-full inline-flex items-center justify-center gap-2 bg-butter text-ink font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-105 transition shadow-sm shadow-punch/20"
                ariaLabel={`Visit ${agent.name} website${outbound.isAffiliate ? ' (affiliate link)' : ''}`}
              >
                Visit Website
                <ExternalLink size={14} />
              </OutboundLink>
              {outbound.isAffiliate && (
                <p className="text-xs italic text-muted/70 mt-1.5 text-center">
                  Affiliate link ·{' '}
                  <Link href="/disclosure" className="underline hover:text-grape">
                    how this works
                  </Link>
                </p>
              )}
            </div>
          )}
          <Link
            href={`/agents/${agent.slug}`}
            className="w-full inline-flex items-center justify-center text-sm font-bold text-grape border border-grape/30 rounded-full py-2 hover:bg-grape/5 hover:border-grape/50 transition-colors"
          >
            View details →
          </Link>
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-grape/10 py-3 first:border-t-0">
      <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5">{label}</p>
      <div>{children}</div>
    </div>
  )
}
