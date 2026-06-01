'use client'

import { useEffect, useState } from 'react'
import { Star, Sparkles } from 'lucide-react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { UsageClaim } from '@/types/database'
import { isVerifiedUsage } from '@/types/database'

interface Review {
  id: string
  created_at: string
  user_email: string
  rating: number
  body: string
  usage_claim: UsageClaim
  months_used: number | null
  incentivized: boolean
}

interface ReviewsListProps {
  agentId: string
  refreshKey: number
}

function VerifiedChip({ claim, months }: { claim: UsageClaim; months: number | null }) {
  if (!isVerifiedUsage(claim)) return null
  const label = claim === 'paying' ? 'paying' : 'on free trial'
  const text = months !== null ? `Verified user · ${label} · ${months} months` : `Verified user · ${label}`
  return (
    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-grape/10 text-grape">
      {text}
    </span>
  )
}

function IncentivizedChip() {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-butter/30 text-ink/80"
      title="Submitted through the Workshop program — reviewer earned credits"
    >
      <Sparkles size={10} />
      Incentivized · Workshop
    </span>
  )
}

export function ReviewsList({ agentId, refreshKey }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    supabase
      .from('reviews')
      .select('id, created_at, user_email, rating, body, usage_claim, months_used, incentivized')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews((data as Review[]) ?? [])
        setLoading(false)
      })
  }, [agentId, refreshKey])

  if (loading) {
    return <div className="text-sm text-muted/70 py-4">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted/70 text-sm">
        No reviews yet — be the first to share your experience.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-cream rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm font-semibold text-ink/80">
                {review.user_email.split('@')[0]}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <p className="text-xs text-muted/70">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <VerifiedChip claim={review.usage_claim} months={review.months_used} />
                {review.incentivized && <IncentivizedChip />}
              </div>
            </div>
            <div className="flex gap-0.5 flex-shrink-0">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={14}
                  className={
                    n <= review.rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200 fill-slate-200'
                  }
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted leading-relaxed">{review.body}</p>
        </div>
      ))}
    </div>
  )
}
