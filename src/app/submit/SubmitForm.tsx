'use client'

import { useRef, useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { submitAgent, prefillFromUrl } from './actions'
import type { PrefillField } from './actions'
import { CATEGORIES, PRICING_LABELS, COMPLEXITY_LABELS } from '@/types/database'
import type { PricingModel, SetupComplexity } from '@/types/database'

export function SubmitForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Controlled values for the 5 prefillable fields
  const [nameVal, setNameVal] = useState('')
  const [taglineVal, setTaglineVal] = useState('')
  const [descriptionVal, setDescriptionVal] = useState('')
  const [websiteVal, setWebsiteVal] = useState('')
  const [logoVal, setLogoVal] = useState('')
  const [autoFilled, setAutoFilled] = useState<Set<PrefillField>>(new Set())

  // Smart import state
  const [importUrl, setImportUrl] = useState('')
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [importError, setImportError] = useState('')
  const [importWarnings, setImportWarnings] = useState<string[]>([])

  function clearAutoFill(field: PrefillField) {
    setAutoFilled((prev) => {
      if (!prev.has(field)) return prev
      const next = new Set(prev)
      next.delete(field)
      return next
    })
  }

  async function handleImport() {
    setImportStatus('loading')
    setImportError('')
    setImportWarnings([])

    const result = await prefillFromUrl(importUrl)

    if (!result.ok) {
      setImportStatus('error')
      setImportError(result.error)
      return
    }

    setImportStatus('idle')
    const filled = new Set<PrefillField>()

    if (result.fields.name) { setNameVal(result.fields.name); filled.add('name') }
    if (result.fields.tagline) { setTaglineVal(result.fields.tagline); filled.add('tagline') }
    if (result.fields.description) { setDescriptionVal(result.fields.description); filled.add('description') }
    if (result.fields.website) {
      setWebsiteVal(result.fields.website.replace(/^https?:\/\//i, ''))
      filled.add('website')
    }
    if (result.fields.logo_url) {
      setLogoVal(result.fields.logo_url.replace(/^https?:\/\//i, ''))
      filled.add('logo_url')
    }

    setAutoFilled(filled)
    if (result.warnings.length > 0) setImportWarnings(result.warnings)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('loading')
    setErrorMsg('')

    const result = await submitAgent(new FormData(formRef.current))

    if (result.success) {
      setStatus('success')
      formRef.current.reset()
      setNameVal('')
      setTaglineVal('')
      setDescriptionVal('')
      setWebsiteVal('')
      setLogoVal('')
      setAutoFilled(new Set())
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
      {/* Smart import */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          Smart import <span className="normal-case font-normal text-slate-400">(optional)</span>
        </h3>
        <p className="text-sm text-slate-500 mb-3">
          Paste your homepage URL and we&apos;ll fill in what we can.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder="https://yourproduct.com"
            className={inputClass + ' flex-1'}
          />
          <button
            type="button"
            disabled={importStatus === 'loading' || !importUrl.trim()}
            onClick={handleImport}
            className="flex items-center gap-1.5 bg-slate-900 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-slate-700 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            {importStatus === 'loading' ? (
              <><Loader2 size={14} className="animate-spin" /> Importing...</>
            ) : (
              'Import'
            )}
          </button>
        </div>
        {importStatus === 'error' && (
          <p className="text-sm text-slate-500 mt-2">{importError}</p>
        )}
        {importWarnings.length > 0 && (
          <ul className="mt-2 space-y-0.5">
            {importWarnings.map((w) => (
              <li key={w} className="text-xs text-slate-400 before:content-['·'] before:mr-1">{w}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Basic info */}
      <Section title="Basic Information">
        <Field label="Agent name" required chip={autoFilled.has('name') ? <AutoFilledChip /> : undefined}>
          <input
            name="name"
            type="text"
            required
            placeholder="e.g. Draftly"
            value={nameVal}
            onChange={(e) => { setNameVal(e.target.value); clearAutoFill('name') }}
            className={inputClass}
          />
        </Field>

        <Field label="Tagline" required hint="One sentence that describes what it does" chip={autoFilled.has('tagline') ? <AutoFilledChip /> : undefined}>
          <input
            name="tagline"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Turn your bullet points into polished emails in seconds"
            value={taglineVal}
            onChange={(e) => { setTaglineVal(e.target.value); clearAutoFill('tagline') }}
            className={inputClass}
          />
        </Field>

        <Field label="Description" required hint="2–4 sentences for business professionals, no jargon" chip={autoFilled.has('description') ? <AutoFilledChip /> : undefined}>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Describe what the agent does, who it's for, and what makes it different..."
            value={descriptionVal}
            onChange={(e) => { setDescriptionVal(e.target.value); clearAutoFill('description') }}
            className={inputClass}
          />
        </Field>

        <Field label="Website URL" required chip={autoFilled.has('website') ? <AutoFilledChip /> : undefined}>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm">
              https://
            </span>
            <input
              name="website"
              type="text"
              required
              placeholder="yourproduct.com"
              value={websiteVal}
              onChange={(e) => {
                setWebsiteVal(e.target.value.replace(/^https?:\/\//i, ''))
                clearAutoFill('website')
              }}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </Field>

        <Field label="Logo URL" hint="Direct link to a square image (optional)" chip={autoFilled.has('logo_url') ? <AutoFilledChip /> : undefined}>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 text-sm">
              https://
            </span>
            <input
              name="logo_url"
              type="text"
              placeholder="yourproduct.com/logo.png"
              value={logoVal}
              onChange={(e) => {
                setLogoVal(e.target.value.replace(/^https?:\/\//i, ''))
                clearAutoFill('logo_url')
              }}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

function AutoFilledChip() {
  return (
    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full ml-2">
      from your site
    </span>
  )
}

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
  chip,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  chip?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {chip}
      </label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  )
}
