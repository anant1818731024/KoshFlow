import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

export interface BarDatum {
  label: string
  value: number
  hint?: string
}

export interface BarChartProps {
  data: BarDatum[]
  height?: number
  color?: string
  className?: string
  valueFormatter?: (v: number) => string
  horizontal?: boolean
}

export function BarChart({
  data,
  height = 240,
  color = '#2f7d66',
  className,
  valueFormatter = (v) => `${v}`,
  horizontal = false,
}: BarChartProps) {
  const max = useMemo(
    () => Math.max(1, ...data.map((d) => d.value)) * 1.05,
    [data],
  )
  const [hover, setHover] = useState<number | null>(null)

  if (horizontal) {
    return (
      <div className={cn('space-y-3', className)}>
        {data.map((d, i) => (
          <div key={d.label} className="group">
            <div className="mb-1 flex items-center justify-between text-[13px]">
              <span className="font-medium text-ink-700">{d.label}</span>
              <span className="tabular-nums text-ink-500">
                {valueFormatter(d.value)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  backgroundColor: color,
                  opacity: 0.55 + 0.45 * (1 - i / data.length),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const width = 720
  const padX = 8
  const padBottom = 26
  const chartH = height - padBottom - 8
  const slot = (width - padX * 2) / data.length
  const barW = Math.min(46, slot * 0.6)

  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        role="img"
        aria-label="Bar chart"
        preserveAspectRatio="none"
      >
        {data.map((d, i) => {
          const x = padX + i * slot + (slot - barW) / 2
          const h = (d.value / max) * chartH
          const y = 8 + chartH - h
          const active = hover === i
          return (
            <g
              key={d.label}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <rect
                x={padX + i * slot}
                y={8}
                width={slot}
                height={chartH}
                fill="transparent"
              />
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(2, h)}
                rx={5}
                fill={color}
                opacity={active ? 1 : 0.82}
                className="transition-opacity"
              />
              {active && (
                <text
                  x={x + barW / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-ink-800 text-[11px] font-semibold"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {valueFormatter(d.value)}
                </text>
              )}
              <text
                x={padX + i * slot + slot / 2}
                y={height - 8}
                textAnchor="middle"
                className="fill-ink-400 text-[10px]"
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
