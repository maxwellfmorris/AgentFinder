'use client'

import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { joinWaitlist } from '@/app/waitlist/actions'

export function WaitlistStrip() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const result = await joinWaitlist(email)

    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? 'Something went wrong.')
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="relative overflow-hidden bg-gradient-to-br from-grape to-punch rounded-3xl px-8 py-12 text-center text-white">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10" />

        <div className="relative">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle size={36} className="text-butter" />
              <p className="font-display text-2xl font-bold">You&apos;re on the list.</p>
              <p className="text-white/80 text-sm max-w-sm mx-auto">
                We&apos;ll reach out when we launch. No spam, no newsletters — just the one email.
              </p>
            </div>
          ) : (
            <>
              <p className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
                Coming soon
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">
                Get notified when we launch
              </h2>
              <p className="text-white/80 text-base max-w-md mx-auto mb-8">
                We&apos;re building the most honest directory of consumer AI tools. Drop your email and we&apos;ll let you know when it&apos;s ready.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 px-5 py-3 rounded-full bg-white/15 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-butter focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2 bg-butter text-ink font-bold text-sm px-7 py-3 rounded-full hover:brightness-105 transition disabled:opacity-60 flex-shrink-0"
                >
                  {status === 'loading' ? (
                    <><Loader2 size={14} className="animate-spin" /> Joining...</>
                  ) : (
                    'Notify me'
                  )}
                </button>
              </form>

              {status === 'error' && (
                <p className="mt-3 text-sm text-white/80">{errorMsg}</p>
              )}

              <p className="mt-4 text-xs text-white/50">
                One email. No spam. Unsubscribe any time.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
