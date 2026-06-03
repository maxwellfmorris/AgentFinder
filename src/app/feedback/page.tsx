import type { Metadata } from 'next'
import { FeedbackForm } from './FeedbackForm'

export const metadata: Metadata = {
  title: 'Send Feedback',
  description: 'Tell us what is working and what could be better on Bindie.',
}

export default function FeedbackPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-2">Send feedback</h1>
      <p className="text-muted mb-8">
        Bindie is in early beta. Your input genuinely shapes what we build next —
        tell us what&apos;s useful, what&apos;s confusing, or what&apos;s missing.
      </p>
      <FeedbackForm />
    </div>
  )
}
