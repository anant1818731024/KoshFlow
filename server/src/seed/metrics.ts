import type { MonthlyMetricSeed } from '../types.js'

// 12 months of history that powers the analytics timeseries and KPI deltas.
export const monthlyMetrics: MonthlyMetricSeed[] = [
  { idx: 0, label: 'Oct', revenue: 31200, profit: 7800, orders: 121 },
  { idx: 1, label: 'Nov', revenue: 38400, profit: 9600, orders: 140 },
  { idx: 2, label: 'Dec', revenue: 47100, profit: 12100, orders: 172 },
  { idx: 3, label: 'Jan', revenue: 34800, profit: 8600, orders: 132 },
  { idx: 4, label: 'Feb', revenue: 36900, profit: 9300, orders: 138 },
  { idx: 5, label: 'Mar', revenue: 41200, profit: 10600, orders: 151 },
  { idx: 6, label: 'Apr', revenue: 39600, profit: 10100, orders: 146 },
  { idx: 7, label: 'May', revenue: 43800, profit: 11400, orders: 158 },
  { idx: 8, label: 'Jun', revenue: 42100, profit: 10900, orders: 154 },
  { idx: 9, label: 'Jul', revenue: 45600, profit: 11900, orders: 166 },
  { idx: 10, label: 'Aug', revenue: 42950, profit: 11420, orders: 171 },
  { idx: 11, label: 'Sep', revenue: 48290, profit: 12840, orders: 186 },
]
