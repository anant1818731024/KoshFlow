import { useMemo, useState } from 'react'
import { TrendingUp, TrendingDown, Repeat, Target } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { AreaChart } from '@/components/charts/AreaChart'
import type { AreaSeries } from '@/components/charts/AreaChart'
import { BarChart } from '@/components/charts/BarChart'
import { DonutChart } from '@/components/charts/DonutChart'
import { rangeOptions } from '@/data/analytics'
import type { RangeKey } from '@/data/analytics'
import { useAppStore } from '@/hooks/useAppStore'
import { PageLoading, PageError } from '@/components/shared/PageStatus'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

const donutColors = [
  '#1e5043',
  '#2f7d66',
  '#76bba2',
  '#bd8730',
  '#d9b662',
  '#b7b0a2',
]

export default function Analytics() {
  const { analytics, loading, error, refetch } = useAppStore()
  const [range, setRange] = useState<RangeKey>('30d')
  const series = analytics ? analytics.series[range] : []

  const totals = useMemo(() => {
    const revenue = series.reduce((a, p) => a + p.revenue, 0)
    const profit = series.reduce((a, p) => a + p.profit, 0)
    const orders = series.reduce((a, p) => a + p.orders, 0)
    return {
      revenue,
      profit,
      orders,
      margin: revenue ? (profit / revenue) * 100 : 0,
      aov: orders ? Math.round(revenue / orders) : 0,
    }
  }, [series])

  if (error) return <PageError message={error} onRetry={refetch} />
  if (loading || !analytics) return <PageLoading />

  const { brandPerformance, categoryDistribution, avgOrderValue, inventoryTurnover } =
    analytics

  const revenueSeries: AreaSeries[] = [
    {
      key: 'revenue',
      label: 'Revenue',
      color: '#2f7d66',
      fill: '#2f7d66',
      values: series.map((p) => p.revenue),
    },
  ]
  const profitSeries: AreaSeries[] = [
    {
      key: 'profit',
      label: 'Profit',
      color: '#bd8730',
      fill: '#bd8730',
      values: series.map((p) => p.profit),
    },
  ]

  const inventoryValue = categoryDistribution.reduce((a, c) => a + c.value, 0)

  const stats = [
    { label: 'Revenue', value: formatCurrency(totals.revenue, { compact: true }), delta: 12.4 },
    { label: 'Profit', value: formatCurrency(totals.profit, { compact: true }), delta: 8.7 },
    { label: 'Orders', value: `${totals.orders}`, delta: 5.2 },
    { label: 'Avg order value', value: formatCurrency(totals.aov || avgOrderValue), delta: 3.1 },
    { label: 'Gross margin', value: `${totals.margin.toFixed(1)}%`, delta: 1.4, icon: Target },
    { label: 'Inventory turnover', value: `${inventoryTurnover}×`, delta: -0.6, icon: Repeat },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Understand what's driving revenue, profit and sell-through."
        actions={
          <Tabs
            variant="pill"
            items={rangeOptions.map((r) => ({ value: r.key, label: r.label }))}
            value={range}
            onChange={(v) => setRange(v as RangeKey)}
          />
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => {
          const positive = s.delta >= 0
          return (
            <Card key={s.label} className="p-4">
              <p className="text-[13px] font-medium text-ink-500">{s.label}</p>
              <p className="mt-1.5 font-display text-xl font-medium tabular-nums text-ink-900">
                {s.value}
              </p>
              <p
                className={cn(
                  'mt-1 inline-flex items-center gap-0.5 text-2xs font-semibold tabular-nums',
                  positive ? 'text-positive-600' : 'text-negative-600',
                )}
              >
                {positive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercent(s.delta)}
              </p>
            </Card>
          )
        })}
      </div>

      {/* Revenue + profit over time */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Revenue over time"
            subtitle={rangeOptions.find((r) => r.key === range)?.label}
          />
          <CardBody>
            <AreaChart
              labels={series.map((p) => p.label)}
              series={revenueSeries}
              valueFormatter={(v) => formatCurrency(v, { compact: true })}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Profit over time"
            subtitle={`${totals.margin.toFixed(1)}% average margin`}
          />
          <CardBody>
            <AreaChart
              labels={series.map((p) => p.label)}
              series={profitSeries}
              valueFormatter={(v) => formatCurrency(v, { compact: true })}
            />
          </CardBody>
        </Card>
      </div>

      {/* Sales by brand + inventory distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader
            title="Sales by brand"
            subtitle="Revenue contribution over the period"
          />
          <CardBody>
            <BarChart
              horizontal
              data={brandPerformance.map((b) => ({
                label: b.brand,
                value: b.revenue,
              }))}
              valueFormatter={(v) => formatCurrency(v, { compact: true })}
            />
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Inventory distribution"
            subtitle="By category value"
          />
          <CardBody>
            <DonutChart
              data={categoryDistribution.map((c, i) => ({
                label: c.category,
                value: c.value,
                color: donutColors[i % donutColors.length],
              }))}
              centerLabel="Inventory value"
              centerValue={formatCurrency(inventoryValue, { compact: true })}
              valueFormatter={(v) => formatCurrency(v, { compact: true })}
            />
          </CardBody>
        </Card>
      </div>

      {/* Best performing brands table */}
      <Card>
        <CardHeader
          title="Best performing brands"
          subtitle="Ranked by revenue, with unit velocity and margin"
        />
        <CardBody className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-ink-100 text-left text-2xs font-semibold uppercase tracking-wider text-ink-400">
                  <th className="px-5 py-2.5">Brand</th>
                  <th className="px-3 py-2.5 text-right">Revenue</th>
                  <th className="px-3 py-2.5 text-right">Units</th>
                  <th className="px-3 py-2.5 text-right">Margin</th>
                  <th className="px-5 py-2.5">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {brandPerformance.map((b) => {
                  const share =
                    (b.revenue /
                      brandPerformance.reduce((a, x) => a + x.revenue, 0)) *
                    100
                  return (
                    <tr key={b.brand} className="hover:bg-ink-50/60">
                      <td className="px-5 py-3 font-medium text-ink-900">
                        {b.brand}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-ink-800">
                        {formatCurrency(b.revenue, { compact: true })}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-ink-600">
                        {b.units}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums font-medium text-accent-700">
                        {b.margin.toFixed(1)}%
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-100">
                            <div
                              className="h-full rounded-full bg-accent-500"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                          <span className="text-2xs tabular-nums text-ink-400">
                            {share.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
