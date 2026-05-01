'use client'

import { useRef, useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { submitAgent } from './actions'
import { CATEGORIES, PRICING_LABELS, COMPLEXITY_LABELS, POPULAR_INTEGRATIONS } from '@/types/database'
import type { PricingModel, SetupComplexity } from '@/types/database'

export function SubmitForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('loading')
    setErrorMsg('')

    const result = await submitAgent(new FormData(formRef.current))

    if (result.success) {
      setStatus('success')
      formRef.current.reset()
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Submission received!</h2>
        <p className="text-slate-500 mb-6">
          We&apos;ll review your agent and reach out within 3–5 business days.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Submit another agent
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <Section title="Basic Information">
        <Field label="Agent name" required>
          <input
            name="name"
            type="text"
            required
            placeholder="e.g. Draftly"
            className={inputClass}
          />
        </Field>

        <Field label="Tagline" required hint="One sentence that describes what it does">
          <input
            name="tagline"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Turn your bullet points into polished emails in seconds"
            className={inputClass}
          />
        </Field>

        <Field label="Description" required hint="2–4 sentences for business professionals, no jargon">
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Describe what the agent does, who it's for, and what makes it different..."
            className={inputClass}
          />
        </Field>

        <Field label="Website URL" required>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm">
              https://
            </span>
            <input
              name="website"
              type="text"
              required
              placeholder="yourproduct.com"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={(e) => {
                const val = e.target.value.replace(/^https?:\/\//i, '')
                e.target.value = val
              }}
            />
          </div>
        </Field>

        <Field label="Logo URL" hint="Direct link to a square image (optional)">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm">
              https://
            </span>
            <input
              name="logo_url"
              type="text"
              placeholder="yourproduct.com/logo.png"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={(e) => {
                const val = e.target.value.replace(/^https?:\/\//i, '')
                e.target.value = val
              }}
            />
          </div>
        </Field>
      </Section>

      {/* Classification */}
      <Section title="Classification">
        <Field label="Category" required>
          <select name="category" required className={inputClass} defaultValue="">
            <option value="" disabled>Select a category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </Field>

        <Field label="Pricing model" required>
          <select name="pricing_model" required className={inputClass} defaultValue="">
            <option value="" disabled>Select pricing...</option>
            {(Object.entries(PRICING_LABELS) as [PricingModel, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </Field>

        <Field label="Setup complexity" required>
          <select name="setup_complexity" required className={inputClass} defaultValue="">
            <option value="" disabled>Select complexity...</option>
            {(Object.entries(COMPLEXITY_LABELS) as [SetupComplexity, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </Field>
      </Section>

      {/* Tags */}
      <Section title="Integrations &amp; Industries">
        <Field
          label="Platform integrations"
          hint="Comma-separated list of tools this agent connects with"
        >
          <input
            name="platform_integrations"
            type="text"
            placeholder="Gmail, Slack, Salesforce, Notion..."
            className={inputClass}
          />
        </Field>

        <Field
          label="Industry tags"
          hint="Comma-separated list of industries this is best suited for"
        >
          <input
            name="industry_tags"
            type="text"
            placeholder="SaaS, Finance, HR, Marketing..."
            className={inputClass}
          />
        </Field>
      </Section>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Agent for Review'
        )}
      </button>
    </form>
  )
}

const inputClass =
  'w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  )
}
