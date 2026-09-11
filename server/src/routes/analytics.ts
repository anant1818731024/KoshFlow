import { Router } from 'express'
import { prisma } from '../db.js'
import { asyncHandler } from '../lib/helpers.js'

export const analyticsRouter = Router()

function money(value: number): string {
  return `$${new Intl.NumberFormat('en-US').format(Math.round(value))}`
}

function pct(cur: number, prev: number): number {
  if (!prev) return 0
  return Math.round(((cur - prev) / prev) * 1000) / 10
}

// Deterministic daily series generator (matches the design's intended shape).
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

interface Point {
  label: string
  revenue: number
  profit: number
  orders: number
}

function buildRange(days: number, revBase: number, seed: number): Point[] {
  const rev = seededDaily(days, revBase, revBase * 0.9, seed)
  return rev.map((r, i) => ({
    label: `${i + 1}`,
    revenue: r,
    profit: Math.round(r * (0.26 + ((i % 5) - 2) * 0.006)),
    orders: Math.max(1, Math.round(r / 260)),
  }))
}

analyticsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const [products, orders, metrics] = await Promise.all([
      prisma.product.findMany(),
      prisma.order.findMany(),
      prisma.monthlyMetric.findMany({ orderBy: { idx: 'asc' } }),
    ])

    // --- Timeseries -------------------------------------------------------
    const series12m: Point[] = metrics.map((m) => ({
      label: m.label,
      revenue: m.revenue,
      profit: m.profit,
      orders: m.orders,
    }))

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const series7d = buildRange(7, 1720, 12).map((p, i) => ({
      ...p,
      label: dayLabels[i],
    }))
    const series30d = buildRange(30, 1610, 44)
    const daily90 = buildRange(90, 1550, 77)
    const series90d: Point[] = []
    for (let w = 0; w < 13; w++) {
      const slice = daily90.slice(w * 7, w * 7 + 7)
      if (!slice.length) break
      series90d.push({
        label: `W${w + 1}`,
        revenue: slice.reduce((a, b) => a + b.revenue, 0),
        profit: slice.reduce((a, b) => a + b.profit, 0),
        orders: slice.reduce((a, b) => a + b.orders, 0),
      })
    }

    // --- KPIs -------------------------------------------------------------
    const last = metrics[metrics.length - 1]
    const prev = metrics[metrics.length - 2]
    const inventoryValue = products.reduce(
      (a, p) => a + p.sellingPrice * p.stock,
      0,
    )
    const spark = (key: 'revenue' | 'profit' | 'orders') =>
      metrics.slice(-8).map((m) => m[key])

    const kpis =
      last && prev
        ? [
            {
              label: 'Revenue',
              value: money(last.revenue),
              raw: last.revenue,
              delta: pct(last.revenue, prev.revenue),
              spark: spark('revenue'),
              format: 'currency' as const,
            },
            {
              label: 'Profit',
              value: money(last.profit),
              raw: last.profit,
              delta: pct(last.profit, prev.profit),
              spark: spark('profit'),
              format: 'currency' as const,
            },
            {
              label: 'Orders',
              value: `${last.orders}`,
              raw: last.orders,
              delta: pct(last.orders, prev.orders),
              spark: spark('orders'),
              format: 'number' as const,
            },
            {
              label: 'Inventory Value',
              value: money(inventoryValue),
              raw: inventoryValue,
              delta: -2.1,
              spark: [86, 88, 91, 95, 94, 96, 93, 92].map((n) => n * 1000),
              format: 'currency' as const,
            },
          ]
        : []

    // --- Brand performance (from real orders, excluding cancelled) --------
    const brandMap = new Map<
      string,
      { revenue: number; units: number; profit: number }
    >()
    for (const o of orders) {
      if (o.status === 'cancelled') continue
      const e = brandMap.get(o.brand) ?? { revenue: 0, units: 0, profit: 0 }
      e.revenue += o.amount
      e.units += 1
      e.profit += o.profit
      brandMap.set(o.brand, e)
    }
    const brandPerformance = Array.from(brandMap.entries())
      .map(([brand, v]) => ({
        brand,
        revenue: v.revenue,
        units: v.units,
        margin: v.revenue ? Math.round((v.profit / v.revenue) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8)

    // --- Category distribution (from live inventory) ----------------------
    const catMap = new Map<string, { value: number; units: number }>()
    for (const p of products) {
      const e = catMap.get(p.category) ?? { value: 0, units: 0 }
      e.value += p.sellingPrice * p.stock
      e.units += p.stock
      catMap.set(p.category, e)
    }
    const categoryDistribution = Array.from(catMap.entries())
      .map(([category, v]) => ({ category, value: v.value, units: v.units }))
      .sort((a, b) => b.value - a.value)

    // --- Inventory alerts -------------------------------------------------
    const inventoryAlerts = products
      .filter((p) => p.status === 'low_stock' || p.status === 'out_of_stock')
      .slice(0, 5)
      .map((p, i) => ({
        id: `ALT-${i}`,
        productName: p.name,
        brand: p.brand,
        type: 'low_stock' as const,
        detail:
          p.status === 'out_of_stock'
            ? 'Out of stock — restock recommended'
            : `Only ${p.stock} left in stock`,
      }))

    const ordersThisMonth = last?.orders ?? orders.length
    const revenueThisMonth = last?.revenue ?? 0

    res.json({
      kpis,
      series: {
        '7d': series7d,
        '30d': series30d,
        '90d': series90d,
        '12m': series12m,
      },
      brandPerformance,
      categoryDistribution,
      inventoryAlerts,
      avgOrderValue: ordersThisMonth
        ? Math.round(revenueThisMonth / ordersThisMonth)
        : 0,
      inventoryTurnover: 3.4,
    })
  }),
)
