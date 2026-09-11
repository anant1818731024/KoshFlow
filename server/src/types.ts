// KoshFlow server-side domain types. Field names/shapes mirror what the API returns to
// the frontend (see ../../src/types in the client).

export type Currency = 'USD' | 'GBP' | 'EUR'

export interface ProductSeed {
  id: string
  name: string
  brand: string
  category: string
  sku: string
  purchasePrice: number
  sellingPrice: number
  stock: number
  status: string
  condition: string
  color: string
  addedAt: string // ISO date
  soldUnits30d: number
  imageHue: number
}

export interface OrderSeed {
  id: string
  customer: string
  customerHandle: string
  productName: string
  brand: string
  date: string // ISO
  amount: number
  profit: number
  status: string
  channel: string
  city: string
  imageHue: number
}

export interface SupplierSeed {
  id: string
  name: string
  handle: string
  location: string
  country: string
  verified: boolean
  rating: number
  reviewCount: number
  productsAvailable: number
  responseTime: string
  memberSince: string
  specialties: string[]
  bio: string
  fulfillmentRate: number
  avatarHue: number
}

export interface SupplierReviewSeed {
  id: string
  supplierId: string
  author: string
  rating: number
  date: string
  body: string
}

export interface MarketplaceListingSeed {
  id: string
  name: string
  brand: string
  category: string
  price: number
  currency: Currency
  supplierId: string
  supplierName: string
  availability: string
  verified: boolean
  condition: string
  location: string
  imageHue: number
}

export interface SourcingListingSeed {
  id: string
  type: string
  product: string
  brand: string
  price: number
  currency: Currency
  condition: string
  party: string
  partyVerified: boolean
  source: string
  minutesAgo: number
  status: string
  note?: string
}

export interface MonthlyMetricSeed {
  idx: number
  label: string
  revenue: number
  profit: number
  orders: number
}
