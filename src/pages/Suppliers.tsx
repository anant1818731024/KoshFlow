import { useMemo, useState, type ReactNode } from 'react'
import {
  Star,
  MapPin,
  Clock,
  Package,
  MessageSquare,
  Users,
  Check,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Drawer } from '@/components/ui/Drawer'
import { VerifiedMark } from '@/components/shared/VerifiedMark'
import { ProductThumb } from '@/components/shared/ProductThumb'
import { AvailabilityBadge } from '@/components/shared/StatusBadge'
import { useAppStore } from '@/hooks/useAppStore'
import { PageLoading, PageError } from '@/components/shared/PageStatus'
import { useToast } from '@/hooks/useToast'
import type { Supplier } from '@/types'
import { cn, formatCurrency } from '@/lib/utils'

export default function Suppliers() {
  const { toast } = useToast()
  const { suppliers, loading, error, refetch } = useAppStore()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('all')
  const [verified, setVerified] = useState('all')
  const [sort, setSort] = useState('rating')
  const [selected, setSelected] = useState<Supplier | null>(null)

  const regions = useMemo(
    () => Array.from(new Set(suppliers.map((s) => s.country))).sort(),
    [suppliers],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = suppliers.filter((s) => {
      if (q && !`${s.name} ${s.location} ${s.specialties.join(' ')}`.toLowerCase().includes(q))
        return false
      if (region !== 'all' && s.country !== region) return false
      if (verified === 'verified' && !s.verified) return false
      if (verified === 'unverified' && s.verified) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'products') return b.productsAvailable - a.productsAvailable
      if (sort === 'reviews') return b.reviewCount - a.reviewCount
      return b.rating - a.rating
    })
    return list
  }, [suppliers, query, region, verified, sort])

  if (error) return <PageError message={error} onRetry={refetch} />
  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier Hub"
        description="Your network of authenticated sourcing partners across the globe."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search suppliers or specialties…"
          className="lg:max-w-xs"
          ariaLabel="Search suppliers"
        />
        <div className="grid grid-cols-3 gap-2 lg:ml-auto lg:flex">
          <Select
            aria-label="Filter by region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            options={[
              { value: 'all', label: 'All regions' },
              ...regions.map((r) => ({ value: r, label: r })),
            ]}
            size="sm"
          />
          <Select
            aria-label="Filter by verification"
            value={verified}
            onChange={(e) => setVerified(e.target.value)}
            options={[
              { value: 'all', label: 'All' },
              { value: 'verified', label: 'Verified' },
              { value: 'unverified', label: 'Unverified' },
            ]}
            size="sm"
          />
          <Select
            aria-label="Sort suppliers"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={[
              { value: 'rating', label: 'Top rated' },
              { value: 'products', label: 'Most stock' },
              { value: 'reviews', label: 'Most reviews' },
            ]}
            size="sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No suppliers found"
            description="Try a different region or clear the verification filter."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="group flex flex-col rounded-xl border border-ink-200/70 bg-white p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-lg font-medium text-ink-700 ring-1 ring-inset ring-black/5"
                  style={{
                    backgroundImage: `linear-gradient(140deg, hsl(${s.avatarHue} 30% 88%), hsl(${(s.avatarHue + 30) % 360} 26% 80%))`,
                  }}
                >
                  {s.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate font-semibold text-ink-900">
                      {s.name}
                    </h3>
                    {s.verified && <VerifiedMark />}
                  </div>
                  <p className="flex items-center gap-1 text-xs text-ink-400">
                    <MapPin className="h-3 w-3" />
                    {s.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-ink-50 px-2 py-1">
                  <Star className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                  <span className="text-[13px] font-semibold text-ink-800 tabular-nums">
                    {s.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
                {s.bio}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.specialties.map((b) => (
                  <Badge key={b} tone="neutral" size="sm">
                    {b}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink-100 pt-3">
                <MiniStat icon={<Package className="h-3.5 w-3.5" />} label="Stock" value={`${s.productsAvailable}`} />
                <MiniStat icon={<Clock className="h-3.5 w-3.5" />} label="Replies" value={s.responseTime} />
                <MiniStat icon={<Star className="h-3.5 w-3.5" />} label="Reviews" value={`${s.reviewCount}`} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Supplier profile drawer */}
      {selected && (
        <SupplierDrawer
          supplier={selected}
          onClose={() => setSelected(null)}
          onContact={() =>
            toast({
              title: 'Message sent',
              description: `Your enquiry reached ${selected.name}.`,
              tone: 'success',
            })
          }
        />
      )}
    </div>
  )
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 text-ink-400">
        {icon}
      </div>
      <p className="mt-1 text-[13px] font-semibold text-ink-800 tabular-nums">
        {value}
      </p>
      <p className="text-2xs text-ink-400">{label}</p>
    </div>
  )
}

function SupplierDrawer({
  supplier,
  onClose,
  onContact,
}: {
  supplier: Supplier
  onClose: () => void
  onContact: () => void
}) {
  const { marketplaceListings, supplierReviews } = useAppStore()
  const catalog = marketplaceListings
    .filter((l) => l.supplierId === supplier.id)
    .slice(0, 4)
  const reviews = supplierReviews.filter((r) => r.supplierId === supplier.id)

  return (
    <Drawer
      open
      onClose={onClose}
      width="max-w-lg"
      eyebrow="Supplier profile"
      title={supplier.name}
      footer={
        <>
          <Button
            variant="primary"
            className="flex-1"
            leftIcon={<MessageSquare className="h-4 w-4" />}
            onClick={onContact}
          >
            Contact supplier
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-2xl font-medium text-ink-700 ring-1 ring-inset ring-black/5"
            style={{
              backgroundImage: `linear-gradient(140deg, hsl(${supplier.avatarHue} 30% 88%), hsl(${(supplier.avatarHue + 30) % 360} 26% 80%))`,
            }}
          >
            {supplier.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {supplier.verified ? (
                <VerifiedMark withLabel />
              ) : (
                <Badge tone="neutral" size="sm">
                  Verification pending
                </Badge>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1 text-[13px] text-ink-500">
              <MapPin className="h-3.5 w-3.5" />
              {supplier.location} · Member since {supplier.memberSince}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <BigStat label="Rating" value={supplier.rating.toFixed(1)} />
          <BigStat label="Reviews" value={`${supplier.reviewCount}`} />
          <BigStat label="Stock" value={`${supplier.productsAvailable}`} />
          <BigStat label="Fulfil" value={`${supplier.fulfillmentRate}%`} />
        </div>

        <p className="text-[13px] leading-relaxed text-ink-500">{supplier.bio}</p>

        <div>
          <p className="mb-2 text-[13px] font-medium text-ink-700">Specialties</p>
          <div className="flex flex-wrap gap-1.5">
            {supplier.specialties.map((b) => (
              <Badge key={b} tone="accent" size="sm">
                {b}
              </Badge>
            ))}
          </div>
        </div>

        {catalog.length > 0 && (
          <div>
            <p className="mb-2 text-[13px] font-medium text-ink-700">
              Available now
            </p>
            <div className="grid grid-cols-2 gap-3">
              {catalog.map((l) => (
                <div
                  key={l.id}
                  className="overflow-hidden rounded-xl border border-ink-100"
                >
                  <div
                    className="flex aspect-square items-center justify-center"
                    style={{
                      backgroundImage: `linear-gradient(145deg, hsl(${l.imageHue} 26% 92%), hsl(${(l.imageHue + 28) % 360} 22% 82%))`,
                    }}
                  >
                    <ProductThumb brand={l.brand} hue={l.imageHue} className="bg-transparent ring-0" />
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-xs font-medium text-ink-800">
                      {l.name}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[13px] font-semibold tabular-nums text-ink-900">
                        {formatCurrency(l.price, { currency: l.currency })}
                      </span>
                      <AvailabilityBadge status={l.availability} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-[13px] font-medium text-ink-700">
            Recent reviews
          </p>
          {reviews.length === 0 ? (
            <p className="rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-4 text-center text-[13px] text-ink-400">
              No reviews yet for this supplier.
            </p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-xl border border-ink-100 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-ink-800">
                      {r.author}
                    </span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3.5 w-3.5',
                            i < r.rating
                              ? 'fill-gold-400 text-gold-400'
                              : 'text-ink-200',
                          )}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                    {r.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-[13px] text-accent-800">
          <Check className="h-4 w-4 shrink-0" />
          {supplier.fulfillmentRate}% of orders fulfilled without dispute over the
          last 12 months.
        </div>
      </div>
    </Drawer>
  )
}

function BigStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-ink-50/60 px-2 py-2.5 text-center">
      <p className="font-display text-lg font-medium text-ink-900 tabular-nums">
        {value}
      </p>
      <p className="text-2xs text-ink-500">{label}</p>
    </div>
  )
}
