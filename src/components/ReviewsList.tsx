'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

interface Review {
  id: string
  created_at: string
  user_email: string
  rating: number
  body: string
}

interface ReviewsListProps {
  agentId: string
  refreshKey: number
}

export function ReviewsList({ agentId, refreshKey }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    supabase
      .from('reviews')
      .select('id, created_at, user_email, rating, body')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews((data as Review[]) ?? [])
        setLoading(false)
      })
  }, [agentId, refreshKey])

  if (loading) {
    return <div className="text-sm text-slate-400 py-4">Loading reviews...</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        No reviews yet — be the first to share your experience.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-slate-50 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {review.user_email.split('@')[0]}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(review.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
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
          <p className="text-sm text-slate-600 leading-relaxed">{review.body}</p>
        </div>
      ))}
    </div>
  )
}
