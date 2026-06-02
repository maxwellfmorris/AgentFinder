'use client'

import { useState } from 'react'
import { ReviewForm } from './ReviewForm'
import { ReviewsList } from './ReviewsList'
import type { FeedbackDimension } from '@/types/database'

interface ReviewsSectionProps {
  agentId: string
  workshopActive?: boolean
  creditType?: string | null
  feedbackDimensions?: FeedbackDimension[]
}

export function ReviewsSection({
  agentId,
  workshopActive = false,
  creditType = null,
  feedbackDimensions = [],
}: ReviewsSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div id="reviews" className="bg-white rounded-2xl border border-grape/10 shadow-[0_8px_20px_rgba(255,107,74,0.06)] p-8 scroll-mt-24">
      <h2 className="font-display text-lg font-bold text-ink mb-6">Reviews</h2>
      <div className="space-y-6">
        <ReviewForm
          agentId={agentId}
          workshopActive={workshopActive}
          creditType={creditType}
          feedbackDimensions={feedbackDimensions}
          onReviewSubmitted={() => setRefreshKey((k) => k + 1)}
        />
        <ReviewsList agentId={agentId} refreshKey={refreshKey} />
      </div>
    </div>
  )
}
