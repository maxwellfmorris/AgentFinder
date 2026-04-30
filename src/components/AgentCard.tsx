import Image from 'next/image'
import Link from 'next/link'
import { Star, CheckCircle, ExternalLink, Zap } from 'lucide-react'
import type { Agent } from '@/types/database'
import { PRICING_LABELS, COMPLEXITY_LABELS } from '@/types/database'

interface AgentCardProps {
  agent: Agent
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

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
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
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-400">
              {agent.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-slate-900 text-base leading-snug truncate">
              {agent.name}
            </h3>
            {agent.verified && (
              <CheckCircle
                size={15}
                className="flex-shrink-0 text-indigo-500 fill-indigo-100"
                aria-label="Verified"
              />
            )}
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
              <span className="text-xs font-semibold text-slate-700">
                {agent.average_rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">
                ({agent.review_count.toLocaleString()})
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">No reviews yet</span>
          )}
        </div>
      </div>

      {/* Tagline */}
      <p className="text-sm font-semibold text-slate-800 mb-2 line-clamp-2">{agent.tagline}</p>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 flex-1">
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
          <p className="text-xs text-slate-400 mb-1.5">Works with</p>
          <div className="flex flex-wrap gap-1">
            {agent.platform_integrations.slice(0, 4).map((int) => (
              <span
                key={int}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
              >
                {int}
              </span>
            ))}
            {agent.platform_integrations.length > 4 && (
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                +{agent.platform_integrations.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
        <Link
          href={`/agents/${agent.slug}`}
          className="flex-1 text-center text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-full py-2 hover:bg-indigo-50 transition-colors"
        >
          View Details
        </Link>
        {agent.website && (
          <a
            href={agent.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
            aria-label={`Visit ${agent.name} website`}
          >
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  )
}
