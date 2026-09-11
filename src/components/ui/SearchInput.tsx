import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  ariaLabel?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  ariaLabel = 'Search',
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-[38px] w-full rounded-lg border border-ink-200 bg-white pl-9 pr-9 text-sm text-ink-900 placeholder:text-ink-400 transition-colors hover:border-ink-300 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/15 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
