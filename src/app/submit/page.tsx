import { SubmitForm } from './SubmitForm'
import { Bot } from 'lucide-react'

export const metadata = {
  title: 'Submit an Agent — AgentFinder',
  description: 'List your AI agent on AgentFinder and reach people looking for tools that fit their everyday life.',
}

export default function SubmitPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-grape/10 rounded-2xl mb-4">
          <Bot size={28} className="text-grape" />
        </div>
        <h1 className="font-display text-3xl font-bold text-ink mb-3">Submit your AI agent</h1>
        <p className="text-muted text-lg leading-relaxed">
          Get in front of people looking for tools that fit their everyday life.
          All submissions are reviewed before going live.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-grape/10 shadow-[0_8px_20px_rgba(255,107,74,0.06)] p-8">
        <SubmitForm />
      </div>

      <p className="text-center text-xs text-muted/70 mt-6">
        Submissions are reviewed within 3–5 business days. We&apos;ll reach out if we need more info.
      </p>
    </div>
  )
}
