import Link from 'next/link'
import { getSupabaseServer } from '@/lib/supabase-server'
import { getReviewStatsForAgent, getLatestEvalsForAgent, getReviewCountSparkline } from '@/lib/agents'
import type { Agent } from '@/types/database'
import { DashboardCard } from '@/components/DashboardCard'
import { DashboardSignInGate } from '@/components/DashboardSignInGate'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DashboardSignInGate />
      </div>
    )
  }

  const { data } = await supabase
    .from('agents')
    .select('*')
    .eq('submitted_by_user_id', user.id)
    .order('created_at', { ascending: false })

  const agents = (data ?? []) as Agent[]

  const cardData = await Promise.all(
    agents.map(async (agent) => {
      const [stats, evals, sparkline] = await Promise.all([
        getReviewStatsForAgent(agent.id),
        getLatestEvalsForAgent(agent.id),
        getReviewCountSparkline(agent.id),
      ])
      return { agent, stats, evals, sparkline }
    })
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-2xl font-bold text-ink mb-8">Your listings</h1>

      {cardData.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="mb-4">You haven&apos;t submitted any listings yet.</p>
          <Link
            href="/submit"
            className="text-sm font-semibold text-grape hover:text-punch"
          >
            Submit your first agent →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cardData.map(({ agent, stats, evals, sparkline }) => (
            <div key={agent.id}>
              <div className="mb-2">
                {agent.status === 'published' ? (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Published · live in the catalog
                  </span>
                ) : agent.status === 'pending' ? (
                  <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                    Pending review · not yet public
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                    Not approved
                  </span>
                )}
              </div>
              <DashboardCard
                agent={agent}
                stats={stats}
                evals={evals}
                sparkline={sparkline}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
