import Image from 'next/image'
import Link from 'next/link'
import { Star, ExternalLink, Zap, Sparkles } from 'lucide-react'
import type { Agent } from '@/types/database'
import { PRICING_LABELS, COMPLEXITY_LABELS } from '@/types/database'
import { getOutboundUrl } from '@/lib/agents'
import { TierChip } from './TierChip'
import { OutboundLink } from './OutboundLink'

interface AgentCardProps {
  agent: Agent
  onView?: () => void
}

const COMPLEXITY_COLOR = {
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

// Compact count formatter: 181200 → "181k", 4100000 → "4.1M", 60 → "60"
function formatRatingCount(n: number): string {
  if (n >= 1_000_000) {
    const m = (n / 1_000_000).toFixed(1)
    return `${m.endsWith('.0') ? m.slice(0, -2) : m}M`
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

export function AgentCard({ agent, onView }: AgentCardProps) {
  const outbound = getOutboundUrl(agent)
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_14px_34px_rgba(139,47,230,0.10)] hover:shadow-[0_20px_44px_rgba(139,47,230,0.16)] hover:-translate-y-0.5 transition-all flex flex-col">
      {/* Signature top accent */}
      <div className="h-1.5 bg-gradient-to-r from-coral via-punch to-grape" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden border border-grape/10 bg-cream">
            {agent.logo_url ? (
              <Image
                src={agent.logo_url}
                alt={`${agent.name} logo`}
                width={56}
                height={56}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-grape/40">
                {agent.name[0]}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-display font-bold text-ink text-base leading-snug truncate">
                {agent.name}
              </h3>
              <TierChip tier={agent.trust_tier} />
            </div>

            {/* Rating */}
            {agent.average_rating !== null ? (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={12}
                      className={
                        n <= Math.round(agent.average_rating!)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-200'
                      }
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-ink/80">
                  {agent.average_rating.toFixed(1)}
                </span>
                <span className="text-xs text-muted/70">
                  ({agent.review_count.toLocaleString()})
                </span>
              </div>
            ) : agent.external_rating !== null && agent.external_rating_url ? (
              <a
                href={agent.external_rating_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-1 text-xs text-muted hover:text-grape transition-colors"
                aria-label={`Rated ${agent.external_rating} on ${agent.external_rating_source ?? 'external source'}, opens in new tab`}
              >
                <Star size={12} className="text-amber-400 fill-amber-400" />
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
                <ExternalLink size={10} className="ml-0.5" />
              </a>
            ) : null}
          </div>
        </div>

        {/* Workshop campaign signal */}
        {agent.workshop_active && !agent.workshop_paused && (
          <div className="inline-flex items-center gap-1.5 bg-grape/10 text-grape rounded-full px-2.5 py-1 mb-2 text-xs font-semibold w-fit">
            <Sparkles size={10} />
            Workshop · Earn {agent.workshop_credit_type ?? 'credit'}
          </div>
        )}

        {/* Tagline */}
        <p className="text-sm font-semibold text-ink mb-2 line-clamp-2">{agent.tagline}</p>

        {/* Description */}
        <p className="text-sm text-muted leading-relaxed line-clamp-3 flex-1">
          {agent.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${PRICING_COLOR[agent.pricing_model]}`}
          >
            {PRICING_LABELS[agent.pricing_model]}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${COMPLEXITY_COLOR[agent.setup_complexity]}`}
          >
            <Zap size={10} />
            {COMPLEXITY_LABELS[agent.setup_complexity]}
          </span>
        </div>

        {/* Integrations */}
        {agent.platform_integrations.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted/70 mb-1.5">Works with</p>
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
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-grape/10 flex items-center gap-3">
          <Link
            href={`/agents/${agent.slug}`}
            onClick={onView}
            aria-label={`View details for ${agent.name}`}
            className="flex-1 text-center text-sm font-bold text-grape border border-grape/30 rounded-full py-2 hover:bg-grape/5 hover:border-grape/50 transition-colors after:absolute after:inset-0 after:content-[''] lg:after:content-none"
          >
            View Details
          </Link>
          {outbound.url !== '#' && (
            <OutboundLink
              agentId={agent.id}
              url={outbound.url}
              isAffiliate={outbound.isAffiliate}
              source="card"
              className="relative z-10 flex-shrink-0 p-2 text-muted hover:text-grape border border-grape/15 rounded-full hover:bg-grape/5 transition-colors"
              ariaLabel={`Visit ${agent.name} website${outbound.isAffiliate ? ' (affiliate link)' : ''}`}
            >
              <span className="relative inline-flex">
                <ExternalLink size={15} />
                {outbound.isAffiliate && (
                  <span
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-grape rounded-full"
                    aria-hidden="true"
                  />
                )}
              </span>
            </OutboundLink>
          )}
        </div>
      </div>
    </div>
  )
}
