import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  Download,
  Package,
  Radio,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { KpiCard } from '@/components/shared/KpiCard'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { ProductThumb } from '@/components/shared/ProductThumb'
import { OrderStatusBadge } from '@/components/shared/StatusBadge'
import { AreaChart } from '@/components/charts/AreaChart'
import type { AreaSeries } from '@/components/charts/AreaChart'
import { rangeOptions } from '@/data/analytics'
import type { RangeKey } from '@/data/analytics'
import { PageLoading, PageError } from '@/components/shared/PageStatus'
import { useAppStore } from '@/hooks/useAppStore'
import { useToast } from '@/hooks/useToast'
import {
  cn,
  currencySymbol,
  formatCurrency,
  formatDateShort,
  timeAgo,
} from '@/lib/utils'

export default function Dashboard() {
  const { orders, products, analytics, sourcingInitial, loading, error, refetch } =
    useAppStore()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [range, setRange] = useState<RangeKey>('30d')

  const topProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.soldUnits30d - a.soldUnits30d)
        .slice(0, 5),
    [products],
  )

  if (error) return <PageError message={error} onRetry={refetch} />
  if (loading || !analytics) return <PageLoading />

  const { kpis, inventoryAlerts } = analytics
  const series = analytics.series[range]
  const chartSeries: AreaSeries[] = [
    {
      key: 'revenue',
      label: 'Revenue',
      color: '#2f7d66',
      fill: '#2f7d66',
      values: series.map((p) => p.revenue),
    },
    {
      key: 'profit',
      label: 'Profit',
      color: '#bd8730',
      fill: '#bd8730',
      values: series.map((p) => p.profit),
    },
  ]

  const recentOrders = orders.slice(0, 5)
  const sourcing = sourcingInitial.slice(0, 4)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good afternoon, Riya"
        description="Here's how Aarohi Collective is performing today."
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() =>
                toast({
                  title: 'Export started',
                  description: 'Your performance report is being prepared.',
                  tone: 'info',
                })
              }
            >
              Export
            </Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            spark={k.spark}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader
              title="Revenue & profit"
              subtitle="Gross revenue against realised profit"
              action={
                <Tabs
                  variant="pill"
                  items={rangeOptions.map((r) => ({
                    value: r.key,
                    label: r.label,
                  }))}
                  value={range}
                  onChange={(v) => setRange(v as RangeKey)}
                />
              }
            />
            <CardBody>
              <div className="mb-4 flex flex-wrap gap-6">
                <LegendStat
                  color="#2f7d66"
                  label="Revenue"
                  value={formatCurrency(
                    series.reduce((a, p) => a + p.revenue, 0),
                    { compact: true },
                  )}
                />
                <LegendStat
                  color="#bd8730"
                  label="Profit"
                  value={formatCurrency(
                    series.reduce((a, p) => a + p.profit, 0),
                    { compact: true },
                  )}
                />
              </div>
              <AreaChart
                labels={series.map((p) => p.label)}
                series={chartSeries}
                valueFormatter={(v) => formatCurrency(v, { compact: true })}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Recent orders"
              action={
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-600 hover:text-ink-900"
                >
                  View all
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              }
            />
            <CardBody className="px-0 pb-0">
              <div className="divide-y divide-ink-100 border-t border-ink-100">
                {recentOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => navigate('/orders')}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-ink-50"
                  >
                    <ProductThumb brand={o.brand} hue={o.imageHue} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-ink-800">
                        {o.productName}
                      </p>
                      <p className="truncate text-xs text-ink-400">
                        {o.customer} · {o.id}
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-[13px] font-semibold text-ink-900 tabular-nums">
                        {formatCurrency(o.amount)}
                      </p>
                      <p className="text-2xs text-positive-600 tabular-nums">
                        +{formatCurrency(o.profit)} profit
                      </p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Inventory alerts"
              action={
                <span className="inline-flex h-6 items-center rounded-full bg-warn-50 px-2 text-2xs font-semibold text-warn-600">
                  {inventoryAlerts.length} to review
                </span>
              }
            />
            <CardBody className="space-y-2.5">
              {inventoryAlerts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2.5"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warn-50 text-warn-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink-800">
                      {a.productName}
                    </p>
                    <p className="text-xs text-ink-500">{a.detail}</p>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<Package className="h-4 w-4" />}
                onClick={() => navigate('/inventory')}
              >
                Manage inventory
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Top selling" subtitle="Last 30 days" />
            <CardBody className="space-y-1">
              {topProducts.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg px-1 py-2"
                >
                  <span className="w-4 text-center text-[13px] font-semibold text-ink-300 tabular-nums">
                    {i + 1}
                  </span>
                  <ProductThumb brand={p.brand} hue={p.imageHue} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-ink-800">
                      {p.name}
                    </p>
                    <p className="text-xs text-ink-400">{p.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-ink-900 tabular-nums">
                      {p.soldUnits30d}
                    </p>
                    <p className="text-2xs text-ink-400">sold</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Sourcing opportunities"
              action={
                <Link
                  to="/source"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-accent-600 hover:text-accent-700"
                >
                  <Radio className="h-3.5 w-3.5" />
                  Live
                </Link>
              }
            />
            <CardBody className="space-y-2.5">
              {sourcing.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg border border-ink-100 px-3 py-2.5"
                >
                  <Badge tone={s.type === 'WTS' ? 'accent' : 'info'} size="sm">
                    {s.type}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-ink-800">
                      {s.product}
                    </p>
                    <p className="text-2xs text-ink-400">
                      {s.party} · {timeAgo(s.createdAt)}
                    </p>
                  </div>
                  <span className="text-[13px] font-semibold text-ink-900 tabular-nums">
                    {currencySymbol(s.currency)}
                    {s.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      <p className="pt-2 text-center text-2xs text-ink-400">
        <TrendingUp className="mr-1 inline h-3 w-3" />
        Figures reflect demo data · KoshFlow is a personal concept project
      </p>
    </div>
  )
}

function LegendStat({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-2.5 w-2.5 rounded-full')} style={{ backgroundColor: color }} />
      <span className="text-[13px] text-ink-500">{label}</span>
      <span className="text-[15px] font-semibold text-ink-900 tabular-nums">
        {value}
      </span>
    </div>
  )
}
