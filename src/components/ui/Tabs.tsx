import { cn } from '@/lib/utils'

export interface TabItem {
  value: string
  label: string
  count?: number
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
  variant?: 'underline' | 'pill'
}

export function Tabs({
  items,
  value,
  onChange,
  className,
  variant = 'underline',
}: TabsProps) {
  if (variant === 'pill') {
    return (
      <div
        role="tablist"
        className={cn(
          'inline-flex items-center gap-1 rounded-lg bg-ink-100 p-1',
          className,
        )}
      >
        {items.map((item) => {
          const active = item.value === value
          return (
            <button
              key={item.value}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(item.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all',
                active
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'text-ink-500 hover:text-ink-800',
              )}
            >
              {item.label}
              {item.count !== undefined && (
                <span
                  className={cn(
                    'text-2xs tabular-nums',
                    active ? 'text-ink-400' : 'text-ink-400',
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-6 border-b border-ink-200 overflow-x-auto',
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'relative -mb-px whitespace-nowrap border-b-2 pb-2.5 pt-1 text-sm font-medium transition-colors',
              active
                ? 'border-ink-900 text-ink-900'
                : 'border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-800',
            )}
          >
            <span className="inline-flex items-center gap-2">
              {item.label}
              {item.count !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-2xs tabular-nums',
                    active ? 'bg-ink-100 text-ink-600' : 'bg-ink-100 text-ink-500',
                  )}
                >
                  {item.count}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
