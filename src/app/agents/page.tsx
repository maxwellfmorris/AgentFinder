import { Suspense } from 'react'
import { getAgents, getFeaturedAgents } from '@/lib/agents'
import { logSearchEvent } from '@/lib/events'
import { AgentCard } from '@/components/AgentCard'
import SearchResultLink from '@/components/SearchResultLink'
import { FilterSidebar } from '@/components/FilterSidebar'
import { SearchBar } from '@/components/SearchBar'
import type { PricingModel } from '@/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse AI Agents for Business',
  description:
    'Find the right AI agent for your team. Filter by category, pricing, and integrations. Verified listings with real user reviews.',
  openGraph: {
    title: 'Browse AI Agents for Business — AgentFinder',
    description:
      'Find the right AI agent for your team. Filter by category, pricing, and integrations.',
  },
}

interface PageProps {
  searchParams: {
    category?: string | string[]
    pricing?: string | string[]
    integration?: string | string[]
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
  const search = searchParams.q

  const [agents, categoryFeatured] = await Promise.all([
    getAgents({ categories, pricingModels, integrations, search }),
    categories.length > 0
      ? getFeaturedAgents({ tier: 'category', category: categories[0], limit: 3 })
      : Promise.resolve([]),
  ])

  const activeFilterCount = categories.length + pricingModels.length + integrations.length

  if (search && search.trim()) {
    logSearchEvent({ query: search.trim(), resultCount: agents.length }).catch(() => {})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse AI Agents</h1>
        <p className="text-slate-500">
          Discover agents that work the way your team already works — no technical setup required.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24">
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
              <p className="text-[11px] text-slate-400 mb-2">sponsored</p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {categoryFeatured.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          )}

          {/* Results count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-500">
              {agents.length === 0 ? (
                'No agents found'
              ) : (
                <>
                  <span className="font-semibold text-slate-900">{agents.length}</span>{' '}
                  {agents.length === 1 ? 'agent' : 'agents'} found
                  {activeFilterCount > 0 && (
                    <span className="ml-1 text-slate-400">
                      with {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                    </span>
                  )}
                </>
              )}
            </p>
            {search && (
              <p className="text-sm text-slate-500">
                Results for <span className="font-semibold text-slate-700">&ldquo;{search}&rdquo;</span>
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
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">No agents match your filters</h3>
      <p className="text-slate-500 text-sm max-w-sm mx-auto">
        Try removing a filter or broadening your search. New agents are added every week.
      </p>
    </div>
  )
}
