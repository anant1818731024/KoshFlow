import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
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
import { api, ApiError } from '@/lib/api'
import { useToast } from '@/hooks/useToast'

export interface NewProductInput {
  name: string
  brand: Product['brand']
  category: Product['category']
  condition: Product['condition']
  color: string
  purchasePrice: number
  sellingPrice: number
  stock: number
}

interface AppStore {
  // data
  products: Product[]
  orders: Order[]
  suppliers: Supplier[]
  supplierReviews: SupplierReview[]
  marketplaceListings: MarketplaceListing[]
  sourcingInitial: SourcingListing[]
  analytics: AnalyticsData | null
  sourcingList: MarketplaceListing[]
  // status
  loading: boolean
  error: string | null
  refetch: () => void
  // mutations
  addProduct: (input: NewProductInput) => void
  updateProduct: (id: string, input: NewProductInput) => void
  deleteProduct: (id: string) => void
  adjustStock: (id: string, delta: number) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  addToSourcingList: (listing: MarketplaceListing) => boolean
  removeFromSourcingList: (id: string) => void
}

const AppStoreContext = createContext<AppStore | null>(null)

function statusForStock(stock: number): Product['status'] {
  if (stock === 0) return 'out_of_stock'
  if (stock <= 2) return 'low_stock'
  return 'in_stock'
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [supplierReviews, setSupplierReviews] = useState<SupplierReview[]>([])
  const [marketplaceListings, setMarketplaceListings] = useState<
    MarketplaceListing[]
  >([])
  const [sourcingInitial, setSourcingInitial] = useState<SourcingListing[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [sourcingList, setSourcingList] = useState<MarketplaceListing[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      api.products.list(),
      api.orders.list(),
      api.suppliers.list(),
      api.suppliers.reviews(),
      api.marketplace.list(),
      api.sourcing.list(),
      api.analytics.get(),
    ])
      .then(([p, o, s, r, m, src, a]) => {
        if (cancelled) return
        setProducts(p)
        setOrders(o)
        setSuppliers(s)
        setSupplierReviews(r)
        setMarketplaceListings(m)
        setSourcingInitial(src)
        setAnalytics(a)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message =
          err instanceof ApiError
            ? err.message
            : 'Something went wrong loading your data.'
        setError(message)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // Refresh just analytics after inventory/order changes (fire-and-forget).
  const refreshAnalytics = useCallback(() => {
    api.analytics
      .get()
      .then(setAnalytics)
      .catch(() => {
        /* non-critical */
      })
  }, [])

  // --- Mutations (optimistic, reconciled against the API) ----------------

  const addProduct = useCallback(
    (input: NewProductInput) => {
      const tempId = `tmp-${Date.now()}`
      const temp: Product = {
        id: tempId,
        name: input.name,
        brand: input.brand,
        category: input.category,
        sku: `${input.brand.slice(0, 3).toUpperCase()}-NEW`,
        purchasePrice: input.purchasePrice,
        sellingPrice: input.sellingPrice,
        stock: input.stock,
        status: statusForStock(input.stock),
        condition: input.condition,
        color: input.color,
        addedAt: new Date().toISOString().slice(0, 10),
        soldUnits30d: 0,
        imageHue: Math.floor(Math.random() * 360),
      }
      setProducts((prev) => [temp, ...prev])
      api.products
        .create(input)
        .then((created) => {
          setProducts((prev) => prev.map((p) => (p.id === tempId ? created : p)))
          refreshAnalytics()
        })
        .catch((err: unknown) => {
          setProducts((prev) => prev.filter((p) => p.id !== tempId))
          toast({
            title: 'Could not add product',
            description: err instanceof ApiError ? err.message : undefined,
            tone: 'error',
          })
        })
    },
    [toast, refreshAnalytics],
  )

  const updateProduct = useCallback(
    (id: string, input: NewProductInput) => {
      const before = products.find((p) => p.id === id)
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...input,
                status:
                  p.status === 'reserved'
                    ? 'reserved'
                    : statusForStock(input.stock),
              }
            : p,
        ),
      )
      api.products
        .update(id, input)
        .then((updated) => {
          setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
          refreshAnalytics()
        })
        .catch((err: unknown) => {
          if (before) setProducts((prev) => prev.map((p) => (p.id === id ? before : p)))
          toast({
            title: 'Could not save changes',
            description: err instanceof ApiError ? err.message : undefined,
            tone: 'error',
          })
        })
    },
    [products, toast, refreshAnalytics],
  )

  const deleteProduct = useCallback(
    (id: string) => {
      const before = products
      setProducts((prev) => prev.filter((p) => p.id !== id))
      api.products
        .remove(id)
        .then(() => refreshAnalytics())
        .catch((err: unknown) => {
          setProducts(before)
          toast({
            title: 'Could not remove product',
            description: err instanceof ApiError ? err.message : undefined,
            tone: 'error',
          })
        })
    },
    [products, toast, refreshAnalytics],
  )

  const adjustStock = useCallback(
    (id: string, delta: number) => {
      const before = products.find((p) => p.id === id)
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p
          const stock = Math.max(0, p.stock + delta)
          return {
            ...p,
            stock,
            status: p.status === 'reserved' ? 'reserved' : statusForStock(stock),
          }
        }),
      )
      api.products
        .adjustStock(id, delta)
        .then((updated) => {
          setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
          refreshAnalytics()
        })
        .catch((err: unknown) => {
          if (before) setProducts((prev) => prev.map((p) => (p.id === id ? before : p)))
          toast({
            title: 'Could not update stock',
            description: err instanceof ApiError ? err.message : undefined,
            tone: 'error',
          })
        })
    },
    [products, toast, refreshAnalytics],
  )

  const updateOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      const before = orders.find((o) => o.id === id)
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
      api.orders.updateStatus(id, status).catch((err: unknown) => {
        if (before) setOrders((prev) => prev.map((o) => (o.id === id ? before : o)))
        toast({
          title: 'Could not update order',
          description: err instanceof ApiError ? err.message : undefined,
          tone: 'error',
        })
      })
    },
    [orders, toast],
  )

  const addToSourcingList = useCallback((listing: MarketplaceListing) => {
    let added = false
    setSourcingList((prev) => {
      if (prev.some((l) => l.id === listing.id)) return prev
      added = true
      return [...prev, listing]
    })
    return added
  }, [])

  const removeFromSourcingList = useCallback((id: string) => {
    setSourcingList((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const value = useMemo<AppStore>(
    () => ({
      products,
      orders,
      suppliers,
      supplierReviews,
      marketplaceListings,
      sourcingInitial,
      analytics,
      sourcingList,
      loading,
      error,
      refetch,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      updateOrderStatus,
      addToSourcingList,
      removeFromSourcingList,
    }),
    [
      products,
      orders,
      suppliers,
      supplierReviews,
      marketplaceListings,
      sourcingInitial,
      analytics,
      sourcingList,
      loading,
      error,
      refetch,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      updateOrderStatus,
      addToSourcingList,
      removeFromSourcingList,
    ],
  )

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used within an AppStoreProvider')
  return ctx
}
