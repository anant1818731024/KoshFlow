import type {
  BrandPerformance,
  CategoryDistribution,
  Kpi,
  InventoryAlert,
  TimeseriesPoint,
} from '@/types'
import { products } from './products'

// ---------------------------------------------------------------------------
// Timeseries, keyed by range. Values are internally consistent: revenue > profit,
// orders track revenue, and the "current" totals roughly match the KPI cards.
// ---------------------------------------------------------------------------

const months = [
  'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar',
  'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
]

export const timeseries12m: TimeseriesPoint[] = [
  { label: 'Oct', revenue: 31200, profit: 7800, orders: 121 },
  { label: 'Nov', revenue: 38400, profit: 9600, orders: 140 },
  { label: 'Dec', revenue: 47100, profit: 12100, orders: 172 },
  { label: 'Jan', revenue: 34800, profit: 8600, orders: 132 },
  { label: 'Feb', revenue: 36900, profit: 9300, orders: 138 },
  { label: 'Mar', revenue: 41200, profit: 10600, orders: 151 },
  { label: 'Apr', revenue: 39600, profit: 10100, orders: 146 },
  { label: 'May', revenue: 43800, profit: 11400, orders: 158 },
  { label: 'Jun', revenue: 42100, profit: 10900, orders: 154 },
  { label: 'Jul', revenue: 45600, profit: 11900, orders: 166 },
  { label: 'Aug', revenue: 42950, profit: 11420, orders: 171 },
  { label: 'Sep', revenue: 48290, profit: 12840, orders: 186 },
]

void months

function seededDaily(days: number, base: number, variance: number, seed: number) {
  const out: number[] = []
  let s = seed
  for (let i = 0; i < days; i++) {
    s = (s * 9301 + 49297) % 233280
    const rnd = s / 233280
    const weekend = i % 7 === 5 || i % 7 === 6 ? 0.82 : 1.06
    out.push(Math.round((base + (rnd - 0.5) * variance) * weekend))
  }
  return out
}

function buildRange(days: number, revBase: number, seed: number): TimeseriesPoint[] {
  const rev = seededDaily(days, revBase, revBase * 0.9, seed)
  return rev.map((r, i) => ({
    label: `${i + 1}`,
    revenue: r,
    profit: Math.round(r * (0.26 + ((i % 5) - 2) * 0.006)),
    orders: Math.max(1, Math.round(r / 260)),
  }))
}

export const timeseries7d = buildRange(7, 1720, 12).map((p, i) => ({
  ...p,
  label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
}))
export const timeseries30d = buildRange(30, 1610, 44)
export const timeseries90d = (() => {
  // Aggregate 90 days into 13 weekly buckets for readability.
  const daily = buildRange(90, 1550, 77)
  const weeks: TimeseriesPoint[] = []
  for (let w = 0; w < 13; w++) {
    const slice = daily.slice(w * 7, w * 7 + 7)
    if (!slice.length) break
    weeks.push({
      label: `W${w + 1}`,
      revenue: slice.reduce((a, b) => a + b.revenue, 0),
      profit: slice.reduce((a, b) => a + b.profit, 0),
      orders: slice.reduce((a, b) => a + b.orders, 0),
    })
  }
  return weeks
})()

export type RangeKey = '7d' | '30d' | '90d' | '12m'

export const rangeOptions: { key: RangeKey; label: string }[] = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
  { key: '12m', label: '12 months' },
]

export function seriesFor(range: RangeKey): TimeseriesPoint[] {
  switch (range) {
    case '7d':
      return timeseries7d
    case '30d':
      return timeseries30d
    case '90d':
      return timeseries90d
    case '12m':
      return timeseries12m
  }
}

// KPI cards ------------------------------------------------------------------

export const kpis: Kpi[] = [
  {
    label: 'Revenue',
    value: '$48,290',
    raw: 48290,
    delta: 12.4,
    format: 'currency',
    spark: timeseries12m.slice(-8).map((p) => p.revenue),
  },
  {
    label: 'Profit',
    value: '$12,840',
    raw: 12840,
    delta: 8.7,
    format: 'currency',
    spark: timeseries12m.slice(-8).map((p) => p.profit),
  },
  {
    label: 'Orders',
    value: '186',
    raw: 186,
    delta: 5.2,
    format: 'number',
    spark: timeseries12m.slice(-8).map((p) => p.orders),
  },
  {
    label: 'Inventory Value',
    value: '$92,430',
    raw: 92430,
    delta: -2.1,
    format: 'currency',
    spark: [86, 88, 91, 95, 94, 96, 93, 92].map((n) => n * 1000),
  },
]

// Brand performance ----------------------------------------------------------

export const brandPerformance: BrandPerformance[] = [
  { brand: 'Chanel', revenue: 14200, units: 9, margin: 27.8 },
  { brand: 'Louis Vuitton', revenue: 9600, units: 21, margin: 31.2 },
  { brand: 'Dior', revenue: 8100, units: 11, margin: 33.4 },
  { brand: 'Hermès', revenue: 6400, units: 7, margin: 24.1 },
  { brand: 'Gucci', revenue: 5200, units: 18, margin: 35.6 },
  { brand: 'Bottega Veneta', revenue: 3300, units: 6, margin: 30.1 },
  { brand: 'Prada', revenue: 2900, units: 8, margin: 29.4 },
  { brand: 'Celine', revenue: 2100, units: 5, margin: 28.7 },
]

// Inventory value distribution by category (derived from live product data) --

export const categoryDistribution: CategoryDistribution[] = (() => {
  const map = new Map<string, { value: number; units: number }>()
  for (const p of products) {
    const entry = map.get(p.category) ?? { value: 0, units: 0 }
    entry.value += p.sellingPrice * p.stock
    entry.units += p.stock
    map.set(p.category, entry)
  }
  return Array.from(map.entries())
    .map(([category, v]) => ({
      category: category as CategoryDistribution['category'],
      value: v.value,
      units: v.units,
    }))
    .sort((a, b) => b.value - a.value)
})()

// Derived headline analytics -------------------------------------------------

export const avgOrderValue = Math.round(48290 / 186)
export const inventoryTurnover = 3.4 // times / year
export const conversionRate = 4.6 // percent

export const inventoryAlerts: InventoryAlert[] = products
  .filter((p) => p.status === 'low_stock' || p.status === 'out_of_stock')
  .slice(0, 5)
  .map((p, i) => ({
    id: `ALT-${i}`,
    productName: p.name,
    brand: p.brand,
    type: p.status === 'out_of_stock' ? 'low_stock' : 'low_stock',
    detail:
      p.status === 'out_of_stock'
        ? 'Out of stock — 3 sold in 30 days'
        : `Only ${p.stock} left in stock`,
  }))
