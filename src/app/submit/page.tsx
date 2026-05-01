import { SubmitForm } from './SubmitForm'
import { Bot } from 'lucide-react'

export const metadata = {
  title: 'Submit an Agent — AgentFinder',
  description: 'List your AI agent on AgentFinder and reach thousands of business professionals.',
}

export default function SubmitPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-2xl mb-4">
          <Bot size={28} className="text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Submit your AI agent</h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          Get in front of thousands of business professionals looking for tools like yours.
          All submissions are reviewed before going live.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <SubmitForm />
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        Submissions are reviewed within 3–5 business days. We&apos;ll reach out if we need more info.
      </p>
    </div>
  )
}
