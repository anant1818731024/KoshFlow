import type {
  AnalyticsData,
  MarketplaceListing,
  Order,
  OrderStatus,
  Product,
  SourcingListing,
  Supplier,
  SupplierReview,
} from '@/types'
import type { NewProductInput } from '@/hooks/useAppStore'

// Base URL of the API. Configure with VITE_API_URL in a `.env` file.
export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:4000'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new ApiError(
      `Can't reach the KoshFlow API at ${API_BASE}. Is the server running?`,
      0,
    )
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.error) message = body.error
    } catch {
      /* ignore parse errors */
    }
    throw new ApiError(message, res.status)
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const api = {
  products: {
    list: () => request<Product[]>('/api/products'),
    create: (input: NewProductInput) =>
      request<Product>('/api/products', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    update: (id: string, input: NewProductInput) =>
      request<Product>(`/api/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    remove: (id: string) =>
      request<{ ok: boolean }>(`/api/products/${id}`, { method: 'DELETE' }),
    adjustStock: (id: string, delta: number) =>
      request<Product>(`/api/products/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ delta }),
      }),
  },
  orders: {
    list: () => request<Order[]>('/api/orders'),
    updateStatus: (id: string, status: OrderStatus) =>
      request<Order>(`/api/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
  suppliers: {
    list: () => request<Supplier[]>('/api/suppliers'),
    reviews: () => request<SupplierReview[]>('/api/suppliers/reviews'),
  },
  marketplace: {
    list: () => request<MarketplaceListing[]>('/api/marketplace'),
  },
  sourcing: {
    list: () => request<SourcingListing[]>('/api/sourcing'),
  },
  analytics: {
    get: () => request<AnalyticsData>('/api/analytics'),
  },
}
