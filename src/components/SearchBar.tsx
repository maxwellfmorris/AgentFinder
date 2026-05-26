'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, X } from 'lucide-react'

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')

  const submit = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (q.trim()) {
        params.set('q', q.trim())
      } else {
        params.delete('q')
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  return (
    <div className="relative">
      <Search
        size={17}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/60 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        placeholder="Search by name, task, or tool…"
        className="w-full pl-10 pr-10 py-3 bg-white border border-grape/15 rounded-2xl text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-grape focus:border-transparent"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit(value)
        }}
      />
      {value && (
        <button
          onClick={() => {
            setValue('')
            submit('')
          }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted/60 hover:text-grape"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}
