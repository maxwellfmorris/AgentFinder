import { Suspense } from 'react'
import Link from 'next/link'
import { Rocket, ArrowRight } from 'lucide-react'
import { getAgents, getFeaturedAgents } from '@/lib/agents'
import { logSearchEvent } from '@/lib/events'
import { AgentCard } from '@/components/AgentCard'
import SearchResultLink from '@/components/SearchResultLink'
import { FilterSidebar } from '@/components/FilterSidebar'
import { MobileFilters } from '@/components/MobileFilters'
import { SearchBar } from '@/components/SearchBar'
import type { PricingModel } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse AI Agents',
  description:
    'Find an AI agent that fits your life. Filter by what you want to do, what it costs, and the tools it works with — honest listings with real reviews.',
  openGraph: {
    title: 'Browse AI Agents — Bindie',
    description:
      'Find an AI agent that fits your life. Filter by what you want to do, what it costs, and the tools it works with.',
  },
}

interface PageProps {
  searchParams: {
    category?: string | string[]
    pricing?: string | string[]
    integration?: string | string[]
    industry?: string | string[]
    q?: string
  }
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

export default async function AgentsPage({ searchParams }: PageProps) {
  const categories = toArray(searchParams.category)
  const pricingModels = toArray(searchParams.pricing) as PricingModel[]
  const integrations = toArray(searchParams.integration)
  const industries = toArray(searchParams.industry)
  const search = searchParams.q

  const [agents, categoryFeatured] = await Promise.all([
    getAgents({ categories, pricingModels, integrations, industries, search }),
    categories.length > 0
      ? getFeaturedAgents({ tier: 'category', category: categories[0], limit: 3 })
      : Promise.resolve([]),
  ])

  const activeFilterCount = categories.length + pricingModels.length + integrations.length + industries.length

  if (search && search.trim()) {
    logSearchEvent({ query: search.trim(), resultCount: agents.length }).catch(() => {})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mb-2">Browse AI Agents</h1>
        <p className="text-muted">
          Filter by what you want to do, what it costs, and the tools it already works with — in plain language.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      {/* Mobile filter trigger + drawer (desktop uses the sidebar below) */}
      <div className="lg:hidden mb-6">
        <Suspense>
          <MobileFilters resultCount={agents.length} />
        </Suspense>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-grape/10 shadow-[0_8px_20px_rgba(255,107,74,0.06)] p-5 sticky top-24">
            <Suspense>
              <FilterSidebar />
            </Suspense>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Sponsored row — only when category filter active and results exist */}
          {categoryFeatured.length > 0 && (
            <div className="mb-8">
              <p className="text-[11px] text-muted/70 mb-2">sponsored</p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {categoryFeatured.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted">
              {agents.length === 0 ? (
                'No agents found'
              ) : (
                <>
                  <span className="font-semibold text-ink">{agents.length}</span>{' '}
                  {agents.length === 1 ? 'agent' : 'agents'} found
                  {activeFilterCount > 0 && (
                    <span className="ml-1 text-muted/70">
                      with {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                    </span>
                  )}
                </>
              )}
            </p>
            {search && (
              <p className="text-sm text-muted">
                Results for <span className="font-semibold text-ink">&ldquo;{search}&rdquo;</span>
              </p>
            )}
          </div>

          {agents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {agents.map((agent, i) => (
                <SearchResultLink
                  key={agent.id}
                  agent={agent}
                  position={i + 1}
                  query={search?.trim() || null}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Self-submission CTA — gentle, founder-facing */}
      <div className="mt-12 bg-gradient-to-r from-cream via-white to-grape/5 border border-grape/15 rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-grape/10 rounded-xl flex items-center justify-center">
            <Rocket size={22} className="text-grape" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-lg font-bold text-ink mb-1">
              Building an AI agent?
            </h2>
            <p className="text-muted text-sm">
              List yours on Bindie — free to submit, reviewed within a few days.
            </p>
          </div>
          <Link
            href="/submit"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-grape text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-110 transition"
          >
            Submit your agent
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-grape/10 shadow-[0_8px_20px_rgba(255,107,74,0.06)]">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="font-display text-lg font-bold text-ink mb-2">No agents match your filters</h3>
      <p className="text-muted text-sm max-w-sm mx-auto">
        Try removing a filter or broadening your search. New agents are added every week.
      </p>
    </div>
  )
}
