import { cn } from '@/lib/utils'

export function Logo({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-ink-50">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M22 11.4c-1.1-1.1-2.6-1.8-4.4-1.8-3.5 0-6.1 2.7-6.1 6.6s2.6 6.6 6.1 6.6c1.8 0 3.3-.7 4.4-1.8"
            stroke="#489a80"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-[19px] font-medium tracking-tight text-ink-900">
          KoshFlow
        </span>
      )}
    </span>
  )
}
