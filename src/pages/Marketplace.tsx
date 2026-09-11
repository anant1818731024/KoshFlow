import { useEffect, useMemo, useState } from 'react'
import {
  ListPlus,
  MessageSquare,
  Check,
  Store,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Drawer } from '@/components/ui/Drawer'
import { Pagination } from '@/components/ui/Pagination'
import { ProductThumb } from '@/components/shared/ProductThumb'
import { AvailabilityBadge } from '@/components/shared/StatusBadge'
import { VerifiedMark } from '@/components/shared/VerifiedMark'
import { brands, categories } from '@/data/products'
import { useAppStore } from '@/hooks/useAppStore'
import { PageLoading, PageError } from '@/components/shared/PageStatus'
import { useToast } from '@/hooks/useToast'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { MarketplaceListing } from '@/types'
import { cn, formatCurrency } from '@/lib/utils'

const PAGE_SIZE = 12

export default function Marketplace() {
  const { sourcingList, addToSourcingList, marketplaceListings, loading, error, refetch } =
    useAppStore()
  const { toast } = useToast()

  const [rawQuery, setRawQuery] = useState('')
  const query = useDebouncedValue(rawQuery, 200)
  const [brand, setBrand] = useState('all')
  const [category, setCategory] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<MarketplaceListing | null>(null)

  const savedIds = useMemo(
    () => new Set(sourcingList.map((l) => l.id)),
    [sourcingList],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = marketplaceListings.filter((l) => {
      if (q && !`${l.name} ${l.brand} ${l.supplierName}`.toLowerCase().includes(q))
        return false
      if (brand !== 'all' && l.brand !== brand) return false
      if (category !== 'all' && l.category !== category) return false
      if (availability !== 'all' && l.availability !== availability) return false
      if (verifiedOnly && !l.verified) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return 0
    })
    return list
  }, [marketplaceListings, query, brand, category, availability, verifiedOnly, sort])

  useEffect(() => {
    setPage(1)
  }, [query, brand, category, availability, verifiedOnly, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const save = (listing: MarketplaceListing) => {
    const added = addToSourcingList(listing)
    toast({
      title: added ? 'Added to sourcing list' : 'Already on your list',
      description: listing.name,
      tone: added ? 'success' : 'info',
    })
  }

  if (error) return <PageError message={error} onRetry={refetch} />
  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketplace"
        description="Discover authenticated pieces from verified suppliers worldwide."
        actions={
          sourcingList.length > 0 ? (
            <Badge tone="accent" dot>
              {sourcingList.length} on sourcing list
            </Badge>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput
          value={rawQuery}
          onChange={setRawQuery}
          placeholder="Search products or suppliers…"
          className="lg:max-w-xs"
          ariaLabel="Search marketplace"
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:ml-auto lg:flex">
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
            aria-label="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'all', label: 'All categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
            size="sm"
          />
          <Select
            aria-label="Filter by availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            options={[
              { value: 'all', label: 'Availability' },
              { value: 'available', label: 'Available' },
              { value: 'limited', label: 'Limited' },
              { value: 'pre_order', label: 'Pre-order' },
              { value: 'sold', label: 'Sold' },
            ]}
            size="sm"
          />
          <Select
            aria-label="Sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'price-asc', label: 'Price ↑' },
              { value: 'price-desc', label: 'Price ↓' },
            ]}
            size="sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-500">
          <span className="font-medium text-ink-700">{filtered.length}</span>{' '}
          pieces
        </p>
        <button
          onClick={() => setVerifiedOnly((v) => !v)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors',
            verifiedOnly
              ? 'border-gold-300 bg-gold-50 text-gold-700'
              : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50',
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          Verified only
        </button>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Store className="h-6 w-6" />}
            title="No listings match your search"
            description="Try broadening your filters or searching for a different brand."
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((l) => (
              <article
                key={l.id}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-ink-200/70 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                onClick={() => setSelected(l)}
              >
                <div
                  className="relative flex aspect-square items-center justify-center"
                  style={{
                    backgroundImage: `linear-gradient(145deg, hsl(${l.imageHue} 26% 92%), hsl(${(l.imageHue + 28) % 360} 22% 82%))`,
                  }}
                >
                  <ProductThumb
                    brand={l.brand}
                    hue={l.imageHue}
                    size="xl"
                    className="h-16 w-16 bg-transparent ring-0"
                  />
                  {l.verified && (
                    <span className="absolute left-2.5 top-2.5">
                      <VerifiedMark />
                    </span>
                  )}
                  <span className="absolute right-2.5 top-2.5">
                    <AvailabilityBadge status={l.availability} />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-3.5">
                  <p className="text-2xs font-semibold uppercase tracking-wide text-ink-400">
                    {l.brand}
                  </p>
                  <h3 className="mt-0.5 line-clamp-2 text-[13px] font-medium leading-snug text-ink-900">
                    {l.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-xs text-ink-400">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{l.supplierName}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
                    <span className="font-display text-[17px] font-medium tabular-nums text-ink-900">
                      {formatCurrency(l.price, { currency: l.currency, compact: false })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        save(l)
                      }}
                      aria-label="Add to sourcing list"
                      className={cn(
                        'inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                        savedIds.has(l.id)
                          ? 'border-accent-200 bg-accent-50 text-accent-600'
                          : 'border-ink-200 text-ink-500 hover:bg-ink-50 hover:text-ink-800',
                      )}
                    >
                      {savedIds.has(l.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ListPlus className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
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
          eyebrow={selected.brand}
          title={selected.name}
          footer={
            <>
              <Button
                variant="primary"
                className="flex-1"
                leftIcon={
                  savedIds.has(selected.id) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ListPlus className="h-4 w-4" />
                  )
                }
                onClick={() => save(selected)}
              >
                {savedIds.has(selected.id) ? 'On sourcing list' : 'Add to sourcing list'}
              </Button>
              <Button
                variant="secondary"
                leftIcon={<MessageSquare className="h-4 w-4" />}
                onClick={() =>
                  toast({
                    title: 'Message sent',
                    description: `Your enquiry reached ${selected.supplierName}.`,
                    tone: 'success',
                  })
                }
              >
                Contact
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <div
              className="flex aspect-[4/3] w-full items-center justify-center rounded-xl ring-1 ring-inset ring-black/[0.06]"
              style={{
                backgroundImage: `linear-gradient(145deg, hsl(${selected.imageHue} 26% 91%), hsl(${(selected.imageHue + 28) % 360} 22% 80%))`,
              }}
            >
              <ProductThumb brand={selected.brand} hue={selected.imageHue} size="xl" className="h-24 w-24 bg-transparent ring-0" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <AvailabilityBadge status={selected.availability} />
              <Badge tone="neutral">{selected.condition}</Badge>
              <Badge tone="neutral">{selected.category}</Badge>
            </div>

            <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4">
              <p className="text-2xs text-ink-500">Supplier ask</p>
              <p className="font-display text-3xl font-medium tabular-nums text-ink-900">
                {formatCurrency(selected.price, { currency: selected.currency })}
              </p>
              <p className="mt-1 text-xs text-ink-400">
                Listed in {selected.currency} · excludes shipping &amp; duties
              </p>
            </div>

            <div className="rounded-xl border border-ink-100 p-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full font-display font-medium text-ink-700 ring-1 ring-inset ring-black/5"
                  style={{
                    backgroundImage: `linear-gradient(140deg, hsl(${selected.imageHue} 30% 88%), hsl(${(selected.imageHue + 30) % 360} 26% 80%))`,
                  }}
                >
                  {selected.supplierName.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {selected.supplierName}
                    </p>
                    {selected.verified && <VerifiedMark />}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-ink-400">
                    <MapPin className="h-3 w-3" />
                    {selected.location}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[13px] leading-relaxed text-ink-500">
              This piece has been condition-graded{' '}
              <span className="font-medium text-ink-700">{selected.condition}</span> and,
              where verified, is backed by supplier provenance documentation. Add it to
              your sourcing list to track it, or contact{' '}
              {selected.supplierName} directly to negotiate.
            </p>
          </div>
        </Drawer>
      )}
    </div>
  )
}
