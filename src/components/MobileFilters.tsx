'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { FilterSidebar } from './FilterSidebar'

interface MobileFiltersProps {
  resultCount: number
}

export function MobileFilters({ resultCount }: MobileFiltersProps) {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  const activeCount =
    searchParams.getAll('category').length +
    searchParams.getAll('pricing').length +
    searchParams.getAll('integration').length +
    searchParams.getAll('industry').length

  // Lock background scroll while the drawer is open
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-white border border-grape/15 text-ink font-semibold text-sm px-4 py-2.5 rounded-full shadow-[0_8px_20px_rgba(255,107,74,0.06)] hover:border-grape/40 transition-colors"
      >
        <SlidersHorizontal size={16} className="text-grape" />
        Filters
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-grape text-white rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-cream shadow-xl flex flex-col">
            {/* Close bar */}
            <div className="flex items-center justify-end px-4 pt-4 pb-1 flex-shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-muted/60 hover:text-grape transition-colors"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filters (reuses the same component + URL logic as desktop) */}
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              <FilterSidebar />
            </div>

            {/* Footer */}
            <div className="border-t border-grape/10 p-4 flex-shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="w-full bg-grape text-white font-semibold py-3 rounded-full hover:brightness-110 transition"
              >
                View {resultCount} {resultCount === 1 ? 'result' : 'results'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
