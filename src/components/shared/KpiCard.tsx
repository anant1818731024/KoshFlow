import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Sparkline } from '@/components/charts/Sparkline'
import { cn, formatPercent } from '@/lib/utils'

export interface KpiCardProps {
  label: string
  value: string
  delta: number
  spark: number[]
  caption?: string
  className?: string
}

export function KpiCard({
  label,
  value,
  delta,
  spark,
  caption = 'vs last month',
  className,
}: KpiCardProps) {
  const positive = delta >= 0
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-ink-200/70 bg-white p-5 shadow-card transition-shadow hover:shadow-elevated',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[13px] font-medium text-ink-500">{label}</span>
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-2xs font-semibold tabular-nums',
            positive
              ? 'bg-positive-50 text-positive-700'
              : 'bg-negative-50 text-negative-700',
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {formatPercent(Math.abs(delta), false)}
        </span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="font-display text-[26px] font-medium leading-none tracking-tight text-ink-900 tabular-nums">
            {value}
          </div>
          <div className="mt-2 text-2xs text-ink-400">{caption}</div>
        </div>
        <Sparkline
          values={spark}
          color={positive ? '#2f7d66' : '#c05a45'}
          fill={positive ? '#2f7d66' : '#c05a45'}
          className="mb-0.5"
        />
      </div>
    </div>
  )
}
