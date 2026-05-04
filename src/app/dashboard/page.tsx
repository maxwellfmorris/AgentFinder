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
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Your listings</h1>

      {cardData.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="mb-4">You haven&apos;t submitted any listings yet.</p>
          <Link
            href="/submit"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Submit your first agent →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cardData.map(({ agent, stats, evals, sparkline }) => (
            <DashboardCard
              key={agent.id}
              agent={agent}
              stats={stats}
              evals={evals}
              sparkline={sparkline}
            />
          ))}
        </div>
      )}
    </div>
  )
}
