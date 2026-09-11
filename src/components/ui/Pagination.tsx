import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  page: number
  pageCount: number
  onPage: (page: number) => void
  total?: number
  pageSize?: number
  className?: string
}

function pageRange(current: number, count: number): (number | '…')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(count - 1, current + 1)
  if (start > 2) pages.push('…')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < count - 1) pages.push('…')
  pages.push(count)
  return pages
}

export function Pagination({
  page,
  pageCount,
  onPage,
  total,
  pageSize,
  className,
}: PaginationProps) {
  if (pageCount <= 1 && !total) return null
  const from = total && pageSize ? (page - 1) * pageSize + 1 : 0
  const to = total && pageSize ? Math.min(page * pageSize, total) : 0

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-3 sm:flex-row',
        className,
      )}
    >
      {total !== undefined && (
        <p className="text-[13px] text-ink-500 tabular-nums">
          Showing <span className="font-medium text-ink-700">{from}</span>–
          <span className="font-medium text-ink-700">{to}</span> of{' '}
          <span className="font-medium text-ink-700">{total}</span>
        </p>
      )}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-600 transition-colors hover:bg-ink-50 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pageRange(page, pageCount).map((p, i) =>
          p === '…' ? (
            <span
              key={`gap-${i}`}
              className="px-1.5 text-sm text-ink-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg px-2 text-[13px] font-medium tabular-nums transition-colors',
                p === page
                  ? 'bg-ink-950 text-ink-50'
                  : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50',
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-600 transition-colors hover:bg-ink-50 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
