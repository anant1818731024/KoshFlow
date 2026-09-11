import { useEffect, useMemo, useState } from 'react'
import {
  Radio,
  Pause,
  Play,
  ArrowUpDown,
  Radar,
  BadgeCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { SourcingStatusBadge } from '@/components/shared/StatusBadge'
import { useLiveFeed } from '@/hooks/useLiveFeed'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useAppStore } from '@/hooks/useAppStore'
import { PageLoading, PageError } from '@/components/shared/PageStatus'
import { brands } from '@/data/products'
import type { ListingType, SourcingListing } from '@/types'
import { cn, currencySymbol, timeAgo } from '@/lib/utils'

export default function Source() {
  const { sourcingInitial, loading, error, refetch } = useAppStore()
  const { listings, live, lastEventAt, toggleLive } = useLiveFeed(sourcingInitial)

  const [rawQuery, setRawQuery] = useState('')
  const query = useDebouncedValue(rawQuery, 180)
  const [type, setType] = useState<'all' | ListingType>('all')
  const [brand, setBrand] = useState('all')
  const [condition, setCondition] = useState('all')
  const [priceMax, setPriceMax] = useState('all')

  // Re-render the relative timestamps every few seconds.
  const [, force] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => force((n) => n + 1), 5000)
    return () => window.clearInterval(t)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const max =
      priceMax === 'all' ? Infinity : Number(priceMax)
    return listings.filter((l) => {
      if (q && !`${l.product} ${l.party}`.toLowerCase().includes(q)) return false
      if (type !== 'all' && l.type !== type) return false
      if (brand !== 'all' && l.brand !== brand) return false
      if (condition !== 'all' && l.condition !== condition) return false
      if (l.price > max) return false
      return true
    })
  }, [listings, query, type, brand, condition, priceMax])

  const activeCount = listings.filter((l) => l.status === 'active').length
  const wtsCount = listings.filter((l) => l.type === 'WTS').length
  const wtbCount = listings.filter((l) => l.type === 'WTB').length

  if (error) return <PageError message={error} onRetry={refetch} />
  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Source"
        description="A live feed of what independent sellers and buyers are trading right now."
        actions={
          <Button
            variant={live ? 'secondary' : 'primary'}
            leftIcon={live ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            onClick={toggleLive}
          >
            {live ? 'Pause feed' : 'Resume feed'}
          </Button>
        }
      />

      {/* Live status strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-ink-200/70 bg-white px-5 py-3.5 shadow-card">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {live && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
            )}
            <span
              className={cn(
                'relative inline-flex h-2.5 w-2.5 rounded-full',
                live ? 'bg-accent-500' : 'bg-ink-300',
              )}
            />
          </span>
          <span className="text-[13px] font-semibold text-ink-800">
            {live ? 'Live' : 'Paused'}
          </span>
          <span className="text-xs text-ink-400">
            · updated {timeAgo(lastEventAt)}
          </span>
        </div>
        <div className="hidden items-center gap-5 sm:flex">
          <StripStat label="Active" value={activeCount} tone="accent" />
          <StripStat label="WTS" value={wtsCount} tone="ink" />
          <StripStat label="WTB" value={wtbCount} tone="info" />
        </div>
        <div className="ml-auto hidden items-center gap-1.5 text-xs text-ink-400 lg:flex">
          <Radar className="h-3.5 w-3.5" />
          Simulated real-time — new listings appear automatically
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput
          value={rawQuery}
          onChange={setRawQuery}
          placeholder="Search listings or handles…"
          className="lg:max-w-xs"
          ariaLabel="Search sourcing feed"
        />
        <div className="flex-1" />
        <div className="grid grid-cols-3 gap-2 lg:flex">
          <Select
            aria-label="Filter by brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            options={[
              { value: 'all', label: 'All brands' },
              ...brands.map((b) => ({ value: b, label: b })),
            ]}
            size="sm"
          />
          <Select
            aria-label="Filter by condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            options={[
              { value: 'all', label: 'Condition' },
              { value: 'Pristine', label: 'Pristine' },
              { value: 'Excellent', label: 'Excellent' },
              { value: 'Very Good', label: 'Very Good' },
              { value: 'Good', label: 'Good' },
              { value: 'Any', label: 'Any (WTB)' },
            ]}
            size="sm"
          />
          <Select
            aria-label="Filter by budget"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            options={[
              { value: 'all', label: 'Any price' },
              { value: '2000', label: 'Under 2k' },
              { value: '5000', label: 'Under 5k' },
              { value: '10000', label: 'Under 10k' },
              { value: '25000', label: 'Under 25k' },
            ]}
            size="sm"
          />
        </div>
      </div>

      <Tabs
        variant="pill"
        items={[
          { value: 'all', label: 'All' },
          { value: 'WTS', label: 'Want to sell', count: wtsCount },
          { value: 'WTB', label: 'Want to buy', count: wtbCount },
        ]}
        value={type}
        onChange={(v) => setType(v as 'all' | ListingType)}
      />

      {/* Feed */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Radio className="h-6 w-6" />}
            title="No live listings match"
            description="Nothing on the feed matches your filters yet. New listings arrive every few seconds — adjust your filters or wait for the next drop."
          />
        </Card>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((l) => (
            <FeedRow key={l.id} listing={l} />
          ))}
        </ul>
      )}
    </div>
  )
}

function StripStat({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'accent' | 'ink' | 'info'
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span
        className={cn(
          'font-display text-lg font-medium tabular-nums',
          tone === 'accent' && 'text-accent-700',
          tone === 'ink' && 'text-ink-900',
          tone === 'info' && 'text-[#42506b]',
        )}
      >
        {value}
      </span>
      <span className="text-2xs uppercase tracking-wide text-ink-400">{label}</span>
    </div>
  )
}

function FeedRow({ listing: l }: { listing: SourcingListing }) {
  const isWts = l.type === 'WTS'
  const dimmed = l.status === 'fulfilled' || l.status === 'expired'

  return (
    <li
      className={cn(
        'group flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-card transition-all sm:gap-4',
        l.isNew
          ? 'animate-fade-in-up border-accent-200 ring-1 ring-accent-200'
          : 'border-ink-200/70',
        dimmed && 'opacity-60',
      )}
    >
      {/* Type marker */}
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg text-2xs font-bold',
          isWts
            ? 'bg-accent-50 text-accent-700'
            : 'bg-[#eef1f6] text-[#42506b]',
        )}
      >
        <ArrowUpDown className="mb-0.5 h-3.5 w-3.5" />
        {l.type}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-ink-900">
            {l.product}
          </p>
          {l.isNew && (
            <Badge tone="accent" size="sm" className="animate-fade-in">
              New
            </Badge>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-400">
          <span className="inline-flex items-center gap-1 font-medium text-ink-500">
            {l.party}
            {l.partyVerified && <BadgeCheck className="h-3 w-3 text-gold-500" />}
          </span>
          <span aria-hidden>·</span>
          <span>{l.condition}</span>
          <span aria-hidden>·</span>
          <span>{l.source}</span>
          <span aria-hidden className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">{timeAgo(l.createdAt)}</span>
        </div>
        {l.note && (
          <p className="mt-1 line-clamp-1 text-xs text-ink-400">{l.note}</p>
        )}
      </div>

      {/* Price + status */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="font-display text-[15px] font-medium tabular-nums text-ink-900 sm:text-base">
          {currencySymbol(l.currency)}
          {l.price.toLocaleString()}
        </span>
        <div className="flex items-center gap-1.5">
          {!isWts && (
            <span className="text-2xs text-ink-400">budget</span>
          )}
          <SourcingStatusBadge status={l.status} />
        </div>
      </div>
    </li>
  )
}
