// ---------------------------------------------------------------------------
// KoshFlow — domain types
// A single source of truth for the shapes flowing through the app.
// ---------------------------------------------------------------------------

export type Currency = 'USD' | 'GBP' | 'EUR'

export type Category =
  | 'Handbags'
  | 'Small Leather Goods'
  | 'Shoes'
  | 'Accessories'
  | 'Jewelry'
  | 'Ready-to-Wear'

export type Brand =
  | 'Chanel'
  | 'Louis Vuitton'
  | 'Dior'
  | 'Hermès'
  | 'Gucci'
  | 'Prada'
  | 'Bottega Veneta'
  | 'Saint Laurent'
  | 'Celine'
  | 'Fendi'

export type Condition =
  | 'New'
  | 'Pristine'
  | 'Excellent'
  | 'Very Good'
  | 'Good'

export type StockStatus = 'in_stock' | 'low_stock' | 'reserved' | 'out_of_stock'

export interface Product {
  id: string
  name: string
  brand: Brand
  category: Category
  sku: string
  purchasePrice: number
  sellingPrice: number
  stock: number
  status: StockStatus
  condition: Condition
  color: string
  addedAt: string // ISO date
  soldUnits30d: number
  imageHue: number // deterministic swatch hue for the generated product image
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'completed'
  | 'cancelled'

export interface Order {
  id: string
  customer: string
  customerHandle: string
  productName: string
  brand: Brand
  date: string // ISO
  amount: number
  profit: number
  status: OrderStatus
  channel: 'Website' | 'Instagram' | 'WhatsApp' | 'Marketplace'
  city: string
  imageHue: number
}

export type Availability = 'available' | 'limited' | 'pre_order' | 'sold'

export interface MarketplaceListing {
  id: string
  name: string
  brand: Brand
  category: Category
  price: number
  currency: Currency
  supplierId: string
  supplierName: string
  availability: Availability
  verified: boolean
  condition: Condition
  location: string
  imageHue: number
}

export interface Supplier {
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
  specialties: Brand[]
  bio: string
  fulfillmentRate: number
  avatarHue: number
}

export interface SupplierReview {
  id: string
  supplierId: string
  author: string
  rating: number
  date: string
  body: string
}

export type ListingType = 'WTS' | 'WTB'
export type SourcingStatus = 'active' | 'pending' | 'fulfilled' | 'expired'

export interface SourcingListing {
  id: string
  type: ListingType
  product: string
  brand: Brand
  price: number // for WTS: asking price; for WTB: budget
  currency: Currency
  condition: Condition | 'Any'
  party: string // seller or buyer handle
  partyVerified: boolean
  source: string // community / channel name
  createdAt: number // epoch ms
  status: SourcingStatus
  note?: string
  isNew?: boolean // transient UI flag for the live feed
}

export interface TimeseriesPoint {
  label: string
  revenue: number
  profit: number
  orders: number
}

export interface BrandPerformance {
  brand: Brand
  revenue: number
  units: number
  margin: number // percent
}

export interface CategoryDistribution {
  category: Category
  value: number // inventory value
  units: number
}

export interface Kpi {
  label: string
  value: string
  raw: number
  delta: number // percent vs previous period
  spark: number[]
  format: 'currency' | 'number'
}

export interface InventoryAlert {
  id: string
  productName: string
  brand: Brand
  type: 'low_stock' | 'reserved' | 'aged'
  detail: string
}

// AI assistant --------------------------------------------------------------

export interface AiProductRef {
  name: string
  brand: Brand
  price: number
  currency: Currency
  margin: number
  supplier?: string
}

export interface AiResponse {
  intro: string
  products?: AiProductRef[]
  insights?: { label: string; value: string; trend?: 'up' | 'down' }[]
  footnote?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text?: string
  response?: AiResponse
  pending?: boolean
  time: number
}

export interface SuggestedPrompt {
  label: string
  query: string
}

// Aggregated analytics returned by the API (GET /api/analytics).
export interface AnalyticsData {
  kpis: Kpi[]
  series: {
    '7d': TimeseriesPoint[]
    '30d': TimeseriesPoint[]
    '90d': TimeseriesPoint[]
    '12m': TimeseriesPoint[]
  }
  brandPerformance: BrandPerformance[]
  categoryDistribution: CategoryDistribution[]
  inventoryAlerts: InventoryAlert[]
  avgOrderValue: number
  inventoryTurnover: number
}
