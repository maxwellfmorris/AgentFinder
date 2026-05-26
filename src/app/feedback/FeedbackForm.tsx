'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { submitFeedback } from './actions'

export function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [pagePath, setPagePath] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    // Capture where the visitor came from, for context (optional).
    setPagePath(document.referrer || '')
  }, [])

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
        <p className="font-semibold text-emerald-800">Thanks for the feedback!</p>
        <p className="text-emerald-600 text-sm mt-1">It really helps shape what comes next.</p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) {
      setErrorMsg('Please enter a message.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    const result = await submitFeedback({ message, email, pagePath })
    if (result.success) {
      setStatus('success')
    } else {
      setErrorMsg(result.error ?? 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-grape/10 shadow-[0_8px_20px_rgba(255,107,74,0.06)] p-6 space-y-4">
      <div>
        <p className="text-sm text-muted mb-2">Your feedback</p>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's working? What's confusing? What would make this more useful for you?"
          className="w-full px-4 py-3 bg-cream border border-grape/15 rounded-xl text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-grape focus:border-transparent resize-none"
        />
      </div>

      <div>
        <p className="text-sm text-muted mb-2">
          Email <span className="text-muted/70">(optional, if you&apos;d like a reply)</span>
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 bg-cream border border-grape/15 rounded-xl text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-grape focus:border-transparent"
        />
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex items-center gap-2 bg-grape text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-110 transition disabled:opacity-60"
      >
        {status === 'loading' ? (
          <><Loader2 size={14} className="animate-spin" /> Sending…</>
        ) : (
          'Send feedback'
        )}
      </button>
    </form>
  )
}
