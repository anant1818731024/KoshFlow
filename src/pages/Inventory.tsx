import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Plus,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Minus,
  PackageOpen,
  X,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import { Drawer } from '@/components/ui/Drawer'
import { Modal } from '@/components/ui/Modal'
import { ProductThumb } from '@/components/shared/ProductThumb'
import { StockStatusBadge } from '@/components/shared/StatusBadge'
import { ProductFormModal } from '@/components/shared/ProductFormModal'
import { PageLoading, PageError } from '@/components/shared/PageStatus'
import { brands, categories } from '@/data/products'
import { useAppStore } from '@/hooks/useAppStore'
import { useToast } from '@/hooks/useToast'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import type { Product } from '@/types'
import { cn, formatCurrency, formatDate } from '@/lib/utils'

const PAGE_SIZE = 8

const priceBuckets = [
  { value: 'all', label: 'Any price' },
  { value: '0-1000', label: 'Under $1,000' },
  { value: '1000-3000', label: '$1,000 – $3,000' },
  { value: '3000-8000', label: '$3,000 – $8,000' },
  { value: '8000-', label: '$8,000+' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'profit-desc', label: 'Profit: high to low' },
  { value: 'stock-asc', label: 'Stock: low to high' },
]

export default function Inventory() {
  const { products, deleteProduct, adjustStock, loading, error, refetch } =
    useAppStore()
  const { toast } = useToast()

  const [rawQuery, setRawQuery] = useState('')
  const query = useDebouncedValue(rawQuery, 200)
  const [brand, setBrand] = useState('all')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [price, setPrice] = useState('all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [selected, setSelected] = useState<Product | null>(null)
  const [editing, setEditing] = useState<Product | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const [min, max] = price === 'all' ? [0, Infinity] : price.split('-').map((n) => (n === '' ? Infinity : Number(n)))

    let list = products.filter((p) => {
      if (q && !`${p.name} ${p.sku} ${p.color}`.toLowerCase().includes(q))
        return false
      if (brand !== 'all' && p.brand !== brand) return false
      if (category !== 'all' && p.category !== category) return false
      if (status !== 'all' && p.status !== status) return false
      if (p.sellingPrice < min || p.sellingPrice > max) return false
      return true
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price-desc':
          return b.sellingPrice - a.sellingPrice
        case 'price-asc':
          return a.sellingPrice - b.sellingPrice
        case 'profit-desc':
          return (
            b.sellingPrice - b.purchasePrice - (a.sellingPrice - a.purchasePrice)
          )
        case 'stock-asc':
          return a.stock - b.stock
        default:
          return +new Date(b.addedAt) - +new Date(a.addedAt)
      }
    })
    return list
  }, [products, query, brand, category, status, price, sort])

  // Reset to first page whenever filters change.
  useEffect(() => {
    setPage(1)
  }, [query, brand, category, status, price, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeFilterCount =
    (brand !== 'all' ? 1 : 0) +
    (category !== 'all' ? 1 : 0) +
    (status !== 'all' ? 1 : 0) +
    (price !== 'all' ? 1 : 0)

  const clearFilters = () => {
    setBrand('all')
    setCategory('all')
    setStatus('all')
    setPrice('all')
  }

  const confirmDelete = () => {
    if (!deleting) return
    deleteProduct(deleting.id)
    toast({ title: 'Product removed', description: deleting.name, tone: 'info' })
    if (selected?.id === deleting.id) setSelected(null)
    setDeleting(null)
  }

  const totalValue = filtered.reduce((a, p) => a + p.sellingPrice * p.stock, 0)

  if (error) return <PageError message={error} onRetry={refetch} />
  if (loading) return <PageLoading />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description={`${products.length} pieces · ${formatCurrency(totalValue, { compact: true })} in filtered value`}
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setAddOpen(true)}
          >
            Add product
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={rawQuery}
            onChange={setRawQuery}
            placeholder="Search by name, SKU, or colour…"
            className="sm:max-w-sm"
            ariaLabel="Search inventory"
          />
          <div className="flex items-center gap-2 sm:ml-auto">
            <Button
              variant="secondary"
              size="sm"
              className="lg:hidden"
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              onClick={() => setShowFilters((v) => !v)}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-ink-900 px-1.5 text-2xs text-ink-50">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <div className="hidden w-44 lg:block">
              <Select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                options={sortOptions}
                size="sm"
              />
            </div>
          </div>
        </div>

        <div
          className={cn(
            'grid-cols-2 gap-2 sm:grid-cols-4 lg:grid',
            showFilters ? 'grid' : 'hidden lg:grid',
          )}
        >
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
            aria-label="Filter by stock status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'all', label: 'Any status' },
              { value: 'in_stock', label: 'In stock' },
              { value: 'low_stock', label: 'Low stock' },
              { value: 'reserved', label: 'Reserved' },
              { value: 'out_of_stock', label: 'Out of stock' },
            ]}
            size="sm"
          />
          <Select
            aria-label="Filter by price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            options={priceBuckets}
            size="sm"
          />
          <div className="lg:hidden">
            <Select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              options={sortOptions}
              size="sm"
            />
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-500 hover:text-ink-800"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<PackageOpen className="h-6 w-6" />}
            title="No products match your filters"
            description="Try adjusting your search terms or clearing a filter to see more of your inventory."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-left text-2xs font-semibold uppercase tracking-wider text-ink-400">
                    <th className="px-5 py-3 font-semibold">Product</th>
                    <th className="px-3 py-3 font-semibold">SKU</th>
                    <th className="px-3 py-3 text-right font-semibold">Purchase</th>
                    <th className="px-3 py-3 text-right font-semibold">Selling</th>
                    <th className="px-3 py-3 text-right font-semibold">Profit</th>
                    <th className="px-3 py-3 text-center font-semibold">Stock</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {pageItems.map((p) => {
                    const profit = p.sellingPrice - p.purchasePrice
                    return (
                      <tr
                        key={p.id}
                        className="group cursor-pointer transition-colors hover:bg-ink-50/70"
                        onClick={() => setSelected(p)}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <ProductThumb brand={p.brand} hue={p.imageHue} />
                            <div className="min-w-0">
                              <p className="truncate font-medium text-ink-900">
                                {p.name}
                              </p>
                              <p className="truncate text-xs text-ink-400">
                                {p.brand} · {p.color}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-mono text-xs text-ink-500">
                          {p.sku}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-ink-600">
                          {formatCurrency(p.purchasePrice)}
                        </td>
                        <td className="px-3 py-3 text-right font-medium tabular-nums text-ink-900">
                          {formatCurrency(p.sellingPrice)}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums font-medium text-positive-600">
                          +{formatCurrency(profit)}
                        </td>
                        <td className="px-3 py-3 text-center tabular-nums">
                          <span
                            className={cn(
                              'font-medium',
                              p.stock === 0 ? 'text-negative-600' : 'text-ink-700',
                            )}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <StockStatusBadge status={p.status} />
                        </td>
                        <td className="px-5 py-3 text-right">
                          <RowMenu
                            onView={() => setSelected(p)}
                            onEdit={() => setEditing(p)}
                            onDelete={() => setDeleting(p)}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {pageItems.map((p) => {
              const profit = p.sellingPrice - p.purchasePrice
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="flex w-full items-center gap-3 rounded-xl border border-ink-200/70 bg-white p-3 text-left shadow-card active:scale-[0.99]"
                >
                  <ProductThumb brand={p.brand} hue={p.imageHue} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-ink-900">
                        {p.name}
                      </p>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-ink-900">
                        {formatCurrency(p.sellingPrice)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-ink-400">
                      {p.brand} · {p.color}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <StockStatusBadge status={p.status} />
                      <span className="text-xs font-medium tabular-nums text-positive-600">
                        +{formatCurrency(profit)} · {p.stock} in stock
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
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
      <ProductDetailDrawer
        product={selected}
        onClose={() => setSelected(null)}
        onEdit={(p) => {
          setSelected(null)
          setEditing(p)
        }}
        onDelete={(p) => setDeleting(p)}
        onAdjustStock={(id, delta) => {
          adjustStock(id, delta)
          setSelected((prev) =>
            prev && prev.id === id
              ? { ...prev, stock: Math.max(0, prev.stock + delta) }
              : prev,
          )
        }}
      />

      {/* Add / edit modals */}
      <ProductFormModal open={addOpen} onClose={() => setAddOpen(false)} />
      <ProductFormModal
        open={!!editing}
        editing={editing}
        onClose={() => setEditing(null)}
      />

      {/* Delete confirm */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Remove product?"
        description={
          deleting
            ? `${deleting.name} will be removed from your inventory. This can't be undone in the demo.`
            : ''
        }
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Remove product
            </Button>
          </>
        }
      >
        {deleting && (
          <div className="flex items-center gap-3 rounded-lg border border-ink-100 bg-ink-50 p-3">
            <ProductThumb brand={deleting.brand} hue={deleting.imageHue} />
            <div>
              <p className="text-sm font-medium text-ink-900">{deleting.name}</p>
              <p className="text-xs text-ink-400">{deleting.sku}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

function RowMenu({
  onView,
  onEdit,
  onDelete,
}: {
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Row actions"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 opacity-0 transition-all hover:bg-ink-100 hover:text-ink-700 group-hover:opacity-100 aria-expanded:opacity-100"
        aria-expanded={open}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-ink-200 bg-white py-1 shadow-overlay animate-fade-in-up">
          <MenuItem icon={<Eye className="h-4 w-4" />} label="View details" onClick={() => { setOpen(false); onView() }} />
          <MenuItem icon={<Pencil className="h-4 w-4" />} label="Edit" onClick={() => { setOpen(false); onEdit() }} />
          <MenuItem icon={<Trash2 className="h-4 w-4" />} label="Remove" danger onClick={() => { setOpen(false); onDelete() }} />
        </div>
      )}
    </div>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] font-medium transition-colors',
        danger
          ? 'text-negative-600 hover:bg-negative-50'
          : 'text-ink-700 hover:bg-ink-50',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function ProductDetailDrawer({
  product,
  onClose,
  onEdit,
  onDelete,
  onAdjustStock,
}: {
  product: Product | null
  onClose: () => void
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
  onAdjustStock: (id: string, delta: number) => void
}) {
  if (!product) return null
  const profit = product.sellingPrice - product.purchasePrice
  const margin = (profit / product.sellingPrice) * 100

  return (
    <Drawer
      open={!!product}
      onClose={onClose}
      eyebrow={product.brand}
      title={product.name.replace(`${product.brand} `, '')}
      footer={
        <>
          <Button
            variant="secondary"
            className="flex-1"
            leftIcon={<Pencil className="h-4 w-4" />}
            onClick={() => onEdit(product)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => onDelete(product)}
            className="text-negative-600 hover:bg-negative-50"
          >
            Remove
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div
          className="flex aspect-[4/3] w-full items-center justify-center rounded-xl ring-1 ring-inset ring-black/[0.06]"
          style={{
            backgroundImage: `linear-gradient(145deg, hsl(${product.imageHue} 26% 91%), hsl(${(product.imageHue + 28) % 360} 22% 80%))`,
          }}
        >
          <ProductThumb brand={product.brand} hue={product.imageHue} size="xl" className="h-24 w-24" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StockStatusBadge status={product.status} />
          <Badge tone="neutral">{product.condition}</Badge>
          <Badge tone="neutral">{product.category}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Purchase price" value={formatCurrency(product.purchasePrice)} />
          <Stat label="Selling price" value={formatCurrency(product.sellingPrice)} />
          <Stat label="Profit / unit" value={`+${formatCurrency(profit)}`} accent />
          <Stat label="Margin" value={`${margin.toFixed(1)}%`} accent />
        </div>

        <div className="rounded-xl border border-ink-100 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-medium text-ink-700">
              Stock on hand
            </span>
            <span className="font-display text-2xl font-medium text-ink-900 tabular-nums">
              {product.stock}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              leftIcon={<Minus className="h-4 w-4" />}
              disabled={product.stock === 0}
              onClick={() => onAdjustStock(product.id, -1)}
            >
              Remove
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => onAdjustStock(product.id, 1)}
            >
              Add
            </Button>
          </div>
        </div>

        <dl className="space-y-2.5 text-[13px]">
          <Row label="SKU" value={<span className="font-mono text-xs">{product.sku}</span>} />
          <Row label="Colour / material" value={product.color} />
          <Row label="Sold (30 days)" value={`${product.soldUnits30d} units`} />
          <Row label="Added" value={formatDate(product.addedAt)} />
        </dl>
      </div>
    </Drawer>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2.5">
      <p className="text-2xs text-ink-500">{label}</p>
      <p
        className={cn(
          'mt-0.5 text-[15px] font-semibold tabular-nums',
          accent ? 'text-accent-700' : 'text-ink-900',
        )}
      >
        {value}
      </p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-100 pb-2.5 last:border-0">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-medium text-ink-800">{value}</dd>
    </div>
  )
}
