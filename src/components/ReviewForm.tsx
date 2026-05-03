'use client'

import { useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { SignInModal } from './SignInModal'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { UsageClaim } from '@/types/database'
import { USAGE_CLAIM_LABELS, isVerifiedUsage } from '@/types/database'

interface ReviewFormProps {
  agentId: string
  onReviewSubmitted: () => void
}

const USAGE_ORDER: UsageClaim[] = ['paying', 'free_trial', 'evaluating', 'none']

export function ReviewForm({ agentId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)
  const [usageClaim, setUsageClaim] = useState<UsageClaim | null>(null)
  const [monthsUsed, setMonthsUsed] = useState('')
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const supabase = getSupabaseBrowser()

  if (!user) {
    return (
      <>
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center">
          <p className="text-slate-600 font-medium mb-1">Have experience with this agent?</p>
          <p className="text-slate-400 text-sm mb-4">Sign in to leave a review — it takes 30 seconds.</p>
          <button
            onClick={() => setShowSignIn(true)}
            className="bg-indigo-600 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Sign in to review
          </button>
        </div>
        {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
      </>
    )
  }

  if (status === 'success') {
    return (
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
    setStatus('loading')
    setErrorMsg('')

    const months = isVerifiedUsage(usageClaim) && monthsUsed !== ''
      ? parseInt(monthsUsed, 10)
      : null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('reviews') as any).insert({
      agent_id: agentId,
      user_id: user!.id,
      user_email: user!.email!,
      rating,
      body,
      usage_claim: usageClaim,
      months_used: months,
    })

    if (error) {
      if (error.code === '23505') {
        setErrorMsg('You have already reviewed this agent.')
      } else {
        setErrorMsg('Something went wrong. Please try again.')
      }
      setStatus('error')
    } else {
      setStatus('success')
      onReviewSubmitted()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <h3 className="font-bold text-slate-900">Write a review</h3>

      {/* Usage claim */}
      <div>
        <p className="text-sm text-slate-500 mb-2">How have you used this agent?</p>
        <div className="flex flex-col gap-2">
          {USAGE_ORDER.map((claim) => (
            <label key={claim} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="usage_claim"
                value={claim}
                checked={usageClaim === claim}
                onChange={() => setUsageClaim(claim)}
                className="accent-indigo-600"
              />
              <span className="text-sm text-slate-700">{USAGE_CLAIM_LABELS[claim]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Months used — only for paying / free_trial */}
      {usageClaim !== null && isVerifiedUsage(usageClaim) && (
        <div>
          <p className="text-sm text-slate-500 mb-2">How many months? <span className="text-slate-400">(optional)</span></p>
          <input
            type="number"
            min={0}
            value={monthsUsed}
            onChange={(e) => setMonthsUsed(e.target.value)}
            placeholder="e.g. 6"
            className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Star picker */}
      <div>
        <p className="text-sm text-slate-500 mb-2">Your rating</p>
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
        <p className="text-sm text-slate-500 mb-2">Your experience</p>
        <textarea
          required
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you use it for? What worked well? What could be better?"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Signed in as {user.email}</p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center gap-2 bg-indigo-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {status === 'loading' ? (
            <><Loader2 size={14} className="animate-spin" /> Submitting...</>
          ) : (
            'Submit review'
          )}
        </button>
      </div>
    </form>
  )
}
