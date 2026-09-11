import { useId, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

export interface AreaSeries {
  key: string
  label: string
  color: string
  fill: string
  values: number[]
}

export interface AreaChartProps {
  labels: string[]
  series: AreaSeries[]
  height?: number
  className?: string
  valueFormatter?: (v: number) => string
  showGrid?: boolean
}

/**
 * A lightweight, dependency-free area/line chart drawn with SVG paths.
 * Supports multiple series, a smooth catmull-rom-ish curve, hover crosshair
 * and an accessible tooltip.
 */
export function AreaChart({
  labels,
  series,
  height = 240,
  className,
  valueFormatter = (v) => `${v}`,
  showGrid = true,
}: AreaChartProps) {
  const uid = useId()
  const width = 720
  const padX = 8
  const padTop = 12
  const padBottom = 24
  const [hover, setHover] = useState<number | null>(null)

  const max = useMemo(() => {
    const all = series.flatMap((s) => s.values)
    return Math.max(1, ...all) * 1.12
  }, [series])

  const n = labels.length
  const stepX = (width - padX * 2) / Math.max(1, n - 1)
  const chartH = height - padTop - padBottom

  const xFor = (i: number) => padX + i * stepX
  const yFor = (v: number) => padTop + chartH - (v / max) * chartH

  function linePath(values: number[]) {
    return values
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i).toFixed(1)} ${yFor(v).toFixed(1)}`)
      .join(' ')
  }

  function areaPath(values: number[]) {
    const line = linePath(values)
    return `${line} L ${xFor(n - 1).toFixed(1)} ${(padTop + chartH).toFixed(
      1,
    )} L ${xFor(0).toFixed(1)} ${(padTop + chartH).toFixed(1)} Z`
  }

  const gridLines = [0.25, 0.5, 0.75, 1]

  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        role="img"
        preserveAspectRatio="none"
        aria-label={`Area chart of ${series.map((s) => s.label).join(', ')}`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
          const ratio = (e.clientX - rect.left) / rect.width
          const i = Math.round(ratio * (n - 1))
          setHover(Math.max(0, Math.min(n - 1, i)))
        }}
      >
        <defs>
          {series.map((s) => (
            <linearGradient
              key={s.key}
              id={`${uid}-${s.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={s.fill} stopOpacity="0.9" />
              <stop offset="100%" stopColor={s.fill} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {showGrid &&
          gridLines.map((g) => (
            <line
              key={g}
              x1={padX}
              x2={width - padX}
              y1={padTop + chartH * g}
              y2={padTop + chartH * g}
              stroke="#e9e7e2"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          ))}

        {series.map((s) => (
          <path
            key={`area-${s.key}`}
            d={areaPath(s.values)}
            fill={`url(#${uid}-${s.key})`}
            opacity={0.5}
          />
        ))}
        {series.map((s) => (
          <path
            key={`line-${s.key}`}
            d={linePath(s.values)}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {hover !== null && (
          <line
            x1={xFor(hover)}
            x2={xFor(hover)}
            y1={padTop}
            y2={padTop + chartH}
            stroke="#b7b0a2"
            strokeWidth="1"
          />
        )}
        {hover !== null &&
          series.map((s) => (
            <circle
              key={`dot-${s.key}`}
              cx={xFor(hover)}
              cy={yFor(s.values[hover])}
              r="3.5"
              fill="#fff"
              stroke={s.color}
              strokeWidth="2"
            />
          ))}

        {labels.map((label, i) => {
          // Thin out x labels when crowded.
          const show = n <= 8 || i % Math.ceil(n / 8) === 0 || i === n - 1
          if (!show) return null
          return (
            <text
              key={i}
              x={xFor(i)}
              y={height - 6}
              textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
              className="fill-ink-400 text-[10px]"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {label}
            </text>
          )
        })}
      </svg>

      {hover !== null && (
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs">
          <span className="font-medium text-ink-500">{labels[hover]}</span>
          {series.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-ink-500">{s.label}</span>
              <span className="font-semibold text-ink-800 tabular-nums">
                {valueFormatter(s.values[hover])}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
