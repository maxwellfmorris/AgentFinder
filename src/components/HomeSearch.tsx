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
      <h2 className="font-display text-2xl font-bold text-ink mb-3">
        Tell us what you&apos;re trying to do
      </h2>
      <p className="text-sm text-muted mb-4">
        We&apos;ll match you to agents that fit. Or browse by category below.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. plan a healthy week of meals, help me write a difficult email, summarize a long article"
          className="flex-1 rounded-2xl border border-grape/15 bg-white px-5 py-4 text-base outline-none focus:ring-2 focus:ring-grape focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-grape text-white font-semibold px-6 rounded-2xl hover:brightness-110 transition"
        >
          Search
        </button>
      </form>
    </div>
  )
}
