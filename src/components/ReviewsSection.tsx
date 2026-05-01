'use client'

import { useState } from 'react'
import { ReviewForm } from './ReviewForm'
import { ReviewsList } from './ReviewsList'

interface ReviewsSectionProps {
  agentId: string
}

export function ReviewsSection({ agentId }: ReviewsSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Reviews</h2>
      <div className="space-y-6">
        <ReviewForm
          agentId={agentId}
          onReviewSubmitted={() => setRefreshKey((k) => k + 1)}
        />
        <ReviewsList agentId={agentId} refreshKey={refreshKey} />
      </div>
    </div>
  )
}
