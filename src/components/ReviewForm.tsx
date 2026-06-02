'use client'

import { useState } from 'react'
import { Star, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { SignInModal } from './SignInModal'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { FeedbackDimension, UsageClaim } from '@/types/database'
import { USAGE_CLAIM_LABELS, isVerifiedUsage } from '@/types/database'

interface DimensionResponse {
  dimensionId: string
  rating: number
  comment: string
}

interface ReviewFormProps {
  agentId: string
  workshopActive?: boolean
  creditType?: string | null
  feedbackDimensions?: FeedbackDimension[]
  onReviewSubmitted: () => void
}

const USAGE_ORDER: UsageClaim[] = ['paying', 'free_trial', 'evaluating', 'none']

export function ReviewForm({
  agentId,
  workshopActive = false,
  creditType = null,
  feedbackDimensions = [],
  onReviewSubmitted,
}: ReviewFormProps) {
  const { user } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)
  const [usageClaim, setUsageClaim] = useState<UsageClaim | null>(null)
  const [monthsUsed, setMonthsUsed] = useState('')
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [body, setBody] = useState('')
  const [usageProof, setUsageProof] = useState('')
  const [usageProofUrl, setUsageProofUrl] = useState('')
  const [dimensionResponses, setDimensionResponses] = useState<Record<string, DimensionResponse>>(
    () => Object.fromEntries(
      feedbackDimensions.map((d) => [d.id, { dimensionId: d.id, rating: 0, comment: '' }])
    )
  )
  const [hoveredDimension, setHoveredDimension] = useState<Record<string, number>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const supabase = getSupabaseBrowser()

  if (!user) {
    return (
      <>
        <div className="bg-cream rounded-2xl border border-grape/10 p-6 text-center">
          <p className="text-ink/80 font-medium mb-1">
            {workshopActive
              ? `Have you tried this agent? Sign in to review and earn ${creditType ?? 'credit'}.`
              : 'Have experience with this agent?'}
          </p>
          <p className="text-muted/70 text-sm mb-4">
            {workshopActive
              ? 'Verified reviews earn credits with the developer once approved.'
              : 'Sign in to leave a review — it takes 30 seconds.'}
          </p>
          <button
            onClick={() => setShowSignIn(true)}
            className="bg-grape text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:brightness-110 transition"
          >
            Sign in to review
          </button>
        </div>
        {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
      </>
    )
  }

  if (status === 'success') {
    return workshopActive ? (
      <div className="bg-grape/5 border border-grape/20 rounded-2xl p-6 text-center">
        <Sparkles size={20} className="text-grape mx-auto mb-2" />
        <p className="font-semibold text-ink">Submitted — your review is pending verification.</p>
        <p className="text-muted text-sm mt-1">
          Once approved, your {creditType ?? 'credit'} will appear on this page.
        </p>
      </div>
    ) : (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
        <p className="font-semibold text-emerald-800">Thanks for your review!</p>
        <p className="text-emerald-600 text-sm mt-1">It&apos;s now live on this page.</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!usageClaim) {
      setErrorMsg('Please select how you have used this agent.')
      return
    }
    if (rating === 0) {
      setErrorMsg('Please select a star rating.')
      return
    }
    if (workshopActive && !usageProof.trim()) {
      setErrorMsg('Please describe how you used the agent — this helps us verify your review.')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    const months =
      isVerifiedUsage(usageClaim) && monthsUsed !== '' ? parseInt(monthsUsed, 10) : null

    const payload: Record<string, unknown> = {
      agent_id: agentId,
      user_id: user!.id,
      user_email: user!.email!,
      rating,
      body,
      usage_claim: usageClaim,
      months_used: months,
    }
    if (workshopActive) {
      payload.incentivized = true
      payload.approved = false
      payload.usage_proof = usageProof.trim()
      payload.usage_proof_url = usageProofUrl.trim() || null
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: reviewData, error } = await (supabase.from('reviews') as any)
      .insert(payload)
      .select('id')
      .single()

    if (error) {
      if (error.code === '23505') {
        setErrorMsg('You have already reviewed this agent.')
      } else {
        setErrorMsg('Something went wrong. Please try again.')
      }
      setStatus('error')
      return
    }

    // Insert feedback dimension responses (only rated dimensions, rating > 0)
    const responsesToInsert = Object.values(dimensionResponses)
      .filter((r) => r.rating > 0)
      .map((r) => ({
        review_id: (reviewData as { id: string }).id,
        agent_id: agentId,
        user_id: user!.id,
        dimension_id: r.dimensionId,
        rating: r.rating,
        comment: r.comment.trim() || null,
      }))

    if (responsesToInsert.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('feedback_responses') as any).insert(responsesToInsert)
      // Non-fatal: if this insert fails the review is still submitted
    }

    setStatus('success')
    onReviewSubmitted()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-grape/10 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-ink">
          {workshopActive ? `Earn ${creditType ?? 'credit'} for a review` : 'Write a review'}
        </h3>
        {workshopActive && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-grape/10 text-grape">
            <Sparkles size={10} />
            Workshop
          </span>
        )}
      </div>

      {/* Usage claim */}
      <div>
        <p className="text-sm text-muted mb-2">How have you used this agent?</p>
        <div className="flex flex-col gap-2">
          {USAGE_ORDER.map((claim) => (
            <label key={claim} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="usage_claim"
                value={claim}
                checked={usageClaim === claim}
                onChange={() => setUsageClaim(claim)}
                className="accent-grape"
              />
              <span className="text-sm text-ink/80">{USAGE_CLAIM_LABELS[claim]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Months used — only for paying / free_trial */}
      {usageClaim !== null && isVerifiedUsage(usageClaim) && (
        <div>
          <p className="text-sm text-muted mb-2">How many months? <span className="text-muted/70">(optional)</span></p>
          <input
            type="number"
            min={0}
            value={monthsUsed}
            onChange={(e) => setMonthsUsed(e.target.value)}
            placeholder="e.g. 6"
            className="w-28 px-3 py-2 bg-cream border border-grape/15 rounded-lg text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-grape focus:border-transparent"
          />
        </div>
      )}

      {/* Star picker */}
      <div>
        <p className="text-sm text-muted mb-2">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              className="p-0.5"
            >
              <Star
                size={28}
                className={
                  n <= (hovered || rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 fill-slate-200'
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review text */}
      <div>
        <p className="text-sm text-muted mb-2">Your experience</p>
        <textarea
          required
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you use it for? What worked well? What could be better?"
          className="w-full px-4 py-3 bg-cream border border-grape/15 rounded-xl text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-grape focus:border-transparent resize-none"
        />
      </div>

      {/* Workshop-only usage proof fields */}
      {workshopActive && (
        <>
          <div>
            <p className="text-sm text-muted mb-2">
              How did you use this agent? <span className="text-red-500">*</span>
            </p>
            <textarea
              required
              rows={2}
              value={usageProof}
              onChange={(e) => setUsageProof(e.target.value)}
              placeholder="A short, specific description of what you actually did with it — this helps us verify you really used it before sending your credit."
              className="w-full px-4 py-3 bg-cream border border-grape/15 rounded-xl text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-grape focus:border-transparent resize-none"
            />
          </div>

          <div>
            <p className="text-sm text-muted mb-2">
              Link to a screenshot or confirmation email <span className="text-muted/70">(optional)</span>
            </p>
            <input
              type="url"
              value={usageProofUrl}
              onChange={(e) => setUsageProofUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-cream border border-grape/15 rounded-xl text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-grape focus:border-transparent"
            />
          </div>
        </>
      )}

      {/* Feedback dimensions — shown for all Workshop submissions when dimensions exist */}
      {workshopActive && feedbackDimensions.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-grape/10">
          <p className="text-sm font-medium text-ink">
            Rate specific areas <span className="text-muted/70 font-normal">(optional — helps the developer improve)</span>
          </p>
          {feedbackDimensions.map((dim) => {
            const resp = dimensionResponses[dim.id] ?? { dimensionId: dim.id, rating: 0, comment: '' }
            const dimHovered = hoveredDimension[dim.id] ?? 0
            return (
              <div key={dim.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-ink">{dim.label}</span>
                    {dim.description && (
                      <span className="text-xs text-muted ml-2">{dim.description}</span>
                    )}
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() =>
                          setDimensionResponses((prev) => ({
                            ...prev,
                            [dim.id]: { ...resp, rating: n },
                          }))
                        }
                        onMouseEnter={() =>
                          setHoveredDimension((prev) => ({ ...prev, [dim.id]: n }))
                        }
                        onMouseLeave={() =>
                          setHoveredDimension((prev) => ({ ...prev, [dim.id]: 0 }))
                        }
                        className="p-0.5"
                      >
                        <Star
                          size={18}
                          className={
                            n <= (dimHovered || resp.rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 fill-slate-200'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                {resp.rating > 0 && (
                  <input
                    type="text"
                    value={resp.comment}
                    onChange={(e) =>
                      setDimensionResponses((prev) => ({
                        ...prev,
                        [dim.id]: { ...resp, comment: e.target.value },
                      }))
                    }
                    placeholder={`Any specific feedback on ${dim.label.toLowerCase()}? (optional)`}
                    className="w-full px-3 py-2 bg-cream border border-grape/15 rounded-lg text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-grape focus:border-transparent"
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted/70">Signed in as {user.email}</p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center gap-2 bg-grape text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-110 transition disabled:opacity-60"
        >
          {status === 'loading' ? (
            <><Loader2 size={14} className="animate-spin" /> Submitting...</>
          ) : workshopActive ? (
            `Submit for ${creditType ?? 'credit'}`
          ) : (
            'Submit review'
          )}
        </button>
      </div>
    </form>
  )
}
