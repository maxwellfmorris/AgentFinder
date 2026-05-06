'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function HomeSearch() {
  const router = useRouter()
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) return
    router.push(`/agents?q=${encodeURIComponent(value.trim())}`)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">
        Tell us what you&apos;re trying to do
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        We&apos;ll match you to agents that fit. Or browse by category below.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. summarize meeting notes, write better cold emails, screen resumes"
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-semibold px-6 rounded-2xl hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
      </form>
    </div>
  )
}
