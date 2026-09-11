import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Download, ReceiptText, MapPin, CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/SearchInput'
import { Tabs } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { Drawer } from '@/components/ui/Drawer'
import { Avatar } from '@/components/ui/Avatar'
import { ProductThumb } from '@/components/shared/ProductThumb'
import { OrderStatusBadge } from '@/components/shared/StatusBadge'
import { orderStatuses } from '@/data/orders'
import { useAppStore } from '@/hooks/useAppStore'
import { PageLoading, PageError } from '@/components/shared/PageStatus'
import { useToast } from '@/hooks/useToast'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { Order, OrderStatus } from '@/types'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

const PAGE_SIZE = 9
const NOW = new Date('2026-09-11T00:00:00')

const dateRanges = [
  { value: 'all', label: 'All time' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
]

export default function Orders() {
  const { orders, updateOrderStatus, loading, error, refetch } = useAppStore()
  const { toast } = useToast()

  const [rawQuery, setRawQuery] = useState('')
  const query = useDebouncedValue(rawQuery, 200)
  const [status, setStatus] = useState<'all' | OrderStatus>('all')
  const [channel, setChannel] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Order | null>(null)

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length }
    for (const o of orders) counts[o.status] = (counts[o.status] ?? 0) + 1
    return counts
  }, [orders])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const dayLimit = dateRange === 'all' ? Infinity : Number(dateRange)
    return orders.filter((o) => {
      if (q && !`${o.id} ${o.customer} ${o.productName} ${o.city}`.toLowerCase().includes(q))
        return false
      if (status !== 'all' && o.status !== status) return false
      if (channel !== 'all' && o.channel !== channel) return false
      if (dayLimit !== Infinity) {
        const days = (NOW.getTime() - new Date(o.date).getTime()) / 86_400_000
        if (days > dayLimit) return false
      }
      return true
    })
  }, [orders, query, status, channel, dateRange])

  useEffect(() => {
    setPage(1)
  }, [query, status, channel, dateRange])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const revenue = filtered.reduce((a, o) => a + (o.status !== 'cancelled' ? o.amount : 0), 0)

  const changeStatus = (order: Order, next: OrderStatus) => {
    updateOrderStatus(order.id, next)
    setSelected((prev) => (prev && prev.id === order.id ? { ...prev, status: next } : prev))
    toast({
      title: 'Order updated',
      description: `${order.id} marked as ${next}`,
      tone: 'success',
    })
  }

  if (error) return <PageError message={error} onRetry={refetch} />
  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description={`${filtered.length} orders · ${formatCurrency(revenue, { compact: true })} in revenue`}
        actions={
          <Button
            variant="secondary"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() =>
              toast({ title: 'Export started', description: 'Generating orders CSV…', tone: 'info' })
            }
          >
            Export CSV
          </Button>
        }
      />

      <Tabs
        items={[
          { value: 'all', label: 'All', count: statusCounts.all },
          { value: 'pending', label: 'Pending', count: statusCounts.pending ?? 0 },
          { value: 'paid', label: 'Paid', count: statusCounts.paid ?? 0 },
          { value: 'processing', label: 'Processing', count: statusCounts.processing ?? 0 },
          { value: 'shipped', label: 'Shipped', count: statusCounts.shipped ?? 0 },
          { value: 'completed', label: 'Completed', count: statusCounts.completed ?? 0 },
          { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled ?? 0 },
        ]}
        value={status}
        onChange={(v) => setStatus(v as 'all' | OrderStatus)}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={rawQuery}
          onChange={setRawQuery}
          placeholder="Search order, customer, city…"
          className="sm:max-w-sm"
          ariaLabel="Search orders"
        />
        <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:flex sm:w-auto">
          <div className="w-full sm:w-40">
            <Select
              aria-label="Filter by channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              options={[
                { value: 'all', label: 'All channels' },
                { value: 'Website', label: 'Website' },
                { value: 'Instagram', label: 'Instagram' },
                { value: 'WhatsApp', label: 'WhatsApp' },
                { value: 'Marketplace', label: 'Marketplace' },
              ]}
              size="sm"
            />
          </div>
          <div className="w-full sm:w-40">
            <Select
              aria-label="Filter by date"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={dateRanges}
              size="sm"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ReceiptText className="h-6 w-6" />}
            title="No orders found"
            description="No orders match your current filters. Try a different status or date range."
          />
        </Card>
      ) : (
        <>
          <Card className="hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-2xs font-semibold uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-3">Order</th>
                    <th className="px-3 py-3">Customer</th>
                    <th className="px-3 py-3">Product</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3 text-right">Amount</th>
                    <th className="px-3 py-3 text-right">Profit</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {pageItems.map((o) => (
                    <tr
                      key={o.id}
                      className="cursor-pointer transition-colors hover:bg-ink-50/70"
                      onClick={() => setSelected(o)}
                    >
                      <td className="px-5 py-3 font-mono text-xs font-medium text-ink-700">
                        {o.id}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={o.customer} hue={o.imageHue} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-ink-900">
                              {o.customer}
                            </p>
                            <p className="truncate text-xs text-ink-400">{o.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <p className="max-w-[200px] truncate text-ink-700">
                          {o.productName}
                        </p>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-ink-500">
                        {formatDate(o.date)}
                      </td>
                      <td className="px-3 py-3 text-right font-medium tabular-nums text-ink-900">
                        {formatCurrency(o.amount)}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums font-medium text-positive-600">
                        +{formatCurrency(o.profit)}
                      </td>
                      <td className="px-5 py-3">
                        <OrderStatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {pageItems.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelected(o)}
                className="w-full rounded-xl border border-ink-200/70 bg-white p-4 text-left shadow-card active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={o.customer} hue={o.imageHue} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {o.customer}
                      </p>
                      <p className="font-mono text-2xs text-ink-400">{o.id}</p>
                    </div>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </div>
                <p className="mt-3 truncate text-[13px] text-ink-600">
                  {o.productName}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-ink-400">{formatDate(o.date)}</span>
                  <span className="text-sm font-semibold tabular-nums text-ink-900">
                    {formatCurrency(o.amount)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <Pagination
            page={page}
            pageCount={pageCount}
            onPage={setPage}
            total={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </>
      )}

      {/* Detail drawer */}
      {selected && (
        <Drawer
          open={!!selected}
          onClose={() => setSelected(null)}
          eyebrow={`Order ${selected.id}`}
          title={selected.customer}
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <OrderStatusBadge status={selected.status} />
              <Badge tone="neutral">{selected.channel}</Badge>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
              <ProductThumb brand={selected.brand} hue={selected.imageHue} size="lg" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink-900">
                  {selected.productName}
                </p>
                <p className="text-xs text-ink-400">{selected.brand}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Order total" value={formatCurrency(selected.amount)} />
              <Stat label="Profit" value={`+${formatCurrency(selected.profit)}`} accent />
            </div>

            <dl className="space-y-2.5 text-[13px]">
              <DRow
                icon={<Avatar name={selected.customer} hue={selected.imageHue} size="sm" />}
                label="Customer"
                value={
                  <div className="text-right">
                    <p className="font-medium text-ink-800">{selected.customer}</p>
                    <p className="text-xs text-ink-400">{selected.customerHandle}</p>
                  </div>
                }
              />
              <DRow
                icon={<MapPin className="h-4 w-4 text-ink-400" />}
                label="Destination"
                value={selected.city}
              />
              <DRow
                icon={<CreditCard className="h-4 w-4 text-ink-400" />}
                label="Channel"
                value={selected.channel}
              />
              <DRow
                icon={<ReceiptText className="h-4 w-4 text-ink-400" />}
                label="Placed"
                value={formatDate(selected.date)}
              />
            </dl>

            <div>
              <p className="mb-2 text-[13px] font-medium text-ink-700">
                Update status
              </p>
              <div className="flex flex-wrap gap-2">
                {orderStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(selected, s)}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-[13px] font-medium capitalize transition-colors',
                      selected.status === s
                        ? 'border-ink-900 bg-ink-900 text-ink-50'
                        : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Simple timeline */}
            <div className="rounded-xl border border-ink-100 p-4">
              <p className="mb-3 text-[13px] font-medium text-ink-700">Timeline</p>
              <ol className="space-y-3">
                {['Order placed', 'Payment received', 'Prepared for shipment', 'Handed to courier'].map(
                  (step, i) => {
                    const reached =
                      ['pending', 'paid', 'processing', 'shipped', 'completed'].indexOf(
                        selected.status,
                      ) >= i
                    return (
                      <li key={step} className="flex items-center gap-3">
                        <span
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full text-2xs font-semibold',
                            reached
                              ? 'bg-accent-600 text-white'
                              : 'bg-ink-100 text-ink-400',
                          )}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={cn(
                            'text-[13px]',
                            reached ? 'font-medium text-ink-800' : 'text-ink-400',
                          )}
                        >
                          {step}
                        </span>
                      </li>
                    )
                  },
                )}
              </ol>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2.5">
      <p className="text-2xs text-ink-500">{label}</p>
      <p className={cn('mt-0.5 text-[15px] font-semibold tabular-nums', accent ? 'text-accent-700' : 'text-ink-900')}>
        {value}
      </p>
    </div>
  )
}

function DRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-ink-100 pb-2.5 last:border-0">
      <dt className="flex items-center gap-2 text-ink-500">
        {icon}
        {label}
      </dt>
      <dd className="font-medium text-ink-800">{value}</dd>
    </div>
  )
}
