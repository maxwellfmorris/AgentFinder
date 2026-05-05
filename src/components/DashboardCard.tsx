'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Loader2 } from 'lucide-react'
import type { Agent, AgentEval } from '@/types/database'
import { getLetterGrade, GRADE_COLORS, isFeatured } from '@/types/database'
import type { ReviewStats } from '@/lib/agents'
import { TierChip } from './TierChip'
import { HowToClimbModal } from './HowToClimbModal'
import { purchaseFeature } from '@/app/dashboard/feature-actions'

interface DashboardCardProps {
  agent: Agent
  stats: ReviewStats
  evals: AgentEval[]
  sparkline: number[]
}

function Sparkline({ data }: { data: number[] }) {
  const total = data.reduce((s, v) => s + v, 0)
  if (total < 2) {
    return (
      <p className="text-xs text-slate-400 italic">
        Sparkline appears once you have multiple reviews
      </p>
    )
  }
  const W = 120
  const H = 24
  const max = Math.max(...data, 1)
  const n = data.length
  const pts = data
    .map((v, i) => {
      const x = n === 1 ? W / 2 : (i / (n - 1)) * W
      const y = H - (v / max) * (H - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline
        points={pts}
        fill="none"
        stroke="rgb(99 102 241)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

interface Issue {
  key: string
  text: string
}

function buildIssues(agent: Agent, stats: ReviewStats, evals: AgentEval[]): Issue[] {
  const issues: Issue[] = []

  if (agent.review_count < 5) {
    issues.push({
      key: 'reviews',
      text: 'Reach 5 verified-user reviews to qualify for the Vetted tier.',
    })
  }

  for (const e of evals) {
    const grade = getLetterGrade(e.score)
    if (grade === 'D' || grade === 'F') {
      issues.push({
        key: `eval-${e.id}`,
        text: `Your eval score on ${e.benchmark_name} is below B — re-running may help.`,
      })
    }
  }

  const ageDays = (Date.now() - new Date(agent.created_at).getTime()) / 86_400_000
  if (ageDays > 90 && agent.trust_tier === 'listed') {
    issues.push({
      key: 'age',
      text: 'Submit ownership verification to reach Verified tier.',
    })
  }

  if (agent.platform_integrations.length < 2) {
    issues.push({
      key: 'integrations',
      text: "Listings with 3+ integrations tend to get more click-throughs. (Placeholder copy — we'll source real numbers later.)",
    })
  }

  return issues
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function DashboardCard({ agent, stats, evals, sparkline }: DashboardCardProps) {
  const router = useRouter()
  const [showClimb, setShowClimb] = useState(false)
  const [promoting, setPromoting] = useState(false)
  const [promoteError, setPromoteError] = useState<string | null>(null)
  const issues = buildIssues(agent, stats, evals)
  const featured = isFeatured(agent)

  async function handlePromote() {
    setPromoting(true)
    setPromoteError(null)
    const result = await purchaseFeature(agent.id, 'homepage', 30)
    setPromoting(false)
    if (!result.success) {
      setPromoteError(result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <Link
          href={`/agents/${agent.slug}`}
          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-lg leading-snug"
        >
          {agent.name}
        </Link>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <TierChip tier={agent.trust_tier} size="md" />
          <button
            onClick={() => setShowClimb(true)}
            className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            How to climb →
          </button>
          {featured && agent.featured_until ? (
            <p className="text-xs text-amber-700">
              Featured on {agent.featured_tier} until {formatDate(agent.featured_until)}
            </p>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handlePromote}
                disabled={promoting}
                className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs hover:bg-amber-200 transition-colors disabled:opacity-60"
              >
                {promoting && <Loader2 size={10} className="animate-spin" />}
                Promote this listing
              </button>
              {promoteError && (
                <p className="text-xs text-red-600">{promoteError}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-2xl font-bold text-slate-900">{agent.review_count}</p>
          <p className="text-xs text-slate-400 mt-0.5">reviews</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">
            {stats.verifiedAvg !== null ? stats.verifiedAvg.toFixed(1) : '—'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">verified-user avg</p>
        </div>
        <div>
          {evals.length === 0 ? (
            <p className="text-2xl font-bold text-slate-400">—</p>
          ) : (
            <div className="flex flex-wrap gap-1 pt-1">
              {evals.map((e) => {
                const grade = getLetterGrade(e.score)
                return (
                  <span
                    key={e.id}
                    title={e.benchmark_name}
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${GRADE_COLORS[grade]}`}
                  >
                    {grade}
                  </span>
                )
              })}
            </div>
          )}
          <p className="text-xs text-slate-400 mt-0.5">latest evals</p>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mb-4">
        <Sparkline data={sparkline} />
      </div>

      {/* What's hurting you */}
      {issues.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2 space-y-2">
          {issues.map((issue) => (
            <div key={issue.key} className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-snug">{issue.text}</p>
            </div>
          ))}
        </div>
      )}

      {showClimb && (
        <HowToClimbModal
          currentTier={agent.trust_tier}
          onClose={() => setShowClimb(false)}
        />
      )}
    </div>
  )
}
