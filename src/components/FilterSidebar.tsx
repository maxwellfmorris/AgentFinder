'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { CATEGORIES, POPULAR_INTEGRATIONS } from '@/types/database'
import type { PricingModel } from '@/types/database'

const PRICING_OPTIONS: { value: PricingModel; label: string; description: string }[] = [
  { value: 'free', label: 'Free', description: 'No cost, ever' },
  { value: 'freemium', label: 'Freemium', description: 'Free tier available' },
  { value: 'subscription', label: 'Subscription', description: 'Monthly/annual plan' },
  { value: 'usage_based', label: 'Pay-as-you-go', description: 'Pay for what you use' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom pricing' },
]

export function FilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedCategories = searchParams.getAll('category')
  const selectedPricing = searchParams.getAll('pricing') as PricingModel[]
  const selectedIntegrations = searchParams.getAll('integration')

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedPricing.length > 0 ||
    selectedIntegrations.length > 0

  const updateParams = useCallback(
    (key: string, value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString())
      const existing = params.getAll(key)

      if (checked) {
        if (!existing.includes(value)) {
          params.append(key, value)
        }
      } else {
        const updated = existing.filter((v) => v !== value)
        params.delete(key)
        updated.forEach((v) => params.append(key, v))
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('pricing')
    params.delete('integration')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2 font-bold text-slate-900 text-sm uppercase tracking-wide">
          <SlidersHorizontal size={15} />
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-indigo-600 font-semibold hover:text-indigo-800"
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        {CATEGORIES.map((cat) => (
          <FilterCheckbox
            key={cat}
            label={cat}
            checked={selectedCategories.includes(cat)}
            onChange={(checked) => updateParams('category', cat, checked)}
          />
        ))}
      </FilterSection>

      {/* Pricing */}
      <FilterSection title="Pricing">
        {PRICING_OPTIONS.map(({ value, label, description }) => (
          <FilterCheckbox
            key={value}
            label={label}
            sublabel={description}
            checked={selectedPricing.includes(value)}
            onChange={(checked) => updateParams('pricing', value, checked)}
          />
        ))}
      </FilterSection>

      {/* Integrations */}
      <FilterSection title="Works With">
        <p className="text-xs text-slate-400 mb-2">
          Filter agents that connect to tools you already use
        </p>
        {POPULAR_INTEGRATIONS.map((int) => (
          <FilterCheckbox
            key={int}
            label={int}
            checked={selectedIntegrations.includes(int)}
            onChange={(checked) => updateParams('integration', int, checked)}
          />
        ))}
      </FilterSection>
    </aside>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 pb-6 border-b border-slate-100 last:border-0 last:mb-0">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function FilterCheckbox({
  label,
  sublabel,
  checked,
  onChange,
}: {
  label: string
  sublabel?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
      />
      <div>
        <span className="text-sm text-slate-700 group-hover:text-slate-900 leading-snug">
          {label}
        </span>
        {sublabel && <p className="text-xs text-slate-400 leading-snug">{sublabel}</p>}
      </div>
    </label>
  )
}
