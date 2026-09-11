import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface DonutSlice {
  label: string
  value: number
  color: string
}

export interface DonutChartProps {
  data: DonutSlice[]
  size?: number
  thickness?: number
  className?: string
  centerLabel?: string
  centerValue?: string
  valueFormatter?: (v: number) => string
}

export function DonutChart({
  data,
  size = 180,
  thickness = 26,
  className,
  centerLabel,
  centerValue,
  valueFormatter = (v) => `${v}`,
}: DonutChartProps) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const [hover, setHover] = useState<number | null>(null)

  let offset = 0
  const segments = data.map((d) => {
    const fraction = d.value / total
    const seg = { ...d, fraction, dash: fraction * circumference, offset }
    offset += fraction * circumference
    return seg
  })

  return (
    <div className={cn('flex flex-col items-center gap-5 sm:flex-row sm:gap-7', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label="Distribution donut chart"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e9e7e2"
            strokeWidth={thickness}
          />
          {segments.map((s, i) => (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={hover === i ? thickness + 3 : thickness}
              strokeDasharray={`${s.dash} ${circumference - s.dash}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="butt"
              className="transition-all duration-200"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-2xl font-medium text-ink-900 tabular-nums">
            {hover !== null ? `${Math.round(segments[hover].fraction * 100)}%` : centerValue}
          </span>
          <span className="mt-0.5 max-w-[80%] text-2xs text-ink-500">
            {hover !== null ? data[hover].label : centerLabel}
          </span>
        </div>
      </div>
      <ul className="w-full space-y-2">
        {data.map((d, i) => (
          <li
            key={d.label}
            className={cn(
              'flex items-center justify-between gap-3 rounded-lg px-2 py-1 text-[13px] transition-colors',
              hover === i && 'bg-ink-50',
            )}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="inline-flex items-center gap-2 text-ink-600">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: d.color }}
              />
              {d.label}
            </span>
            <span className="font-medium text-ink-800 tabular-nums">
              {valueFormatter(d.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
