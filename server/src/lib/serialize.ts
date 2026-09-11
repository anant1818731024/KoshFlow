// Convert database rows (with Date objects) into the JSON shapes the frontend
// expects: dates become strings, sourcing timestamps become epoch millis.

interface ProductRow {
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
  addedAt: Date
  soldUnits30d: number
  imageHue: number
}

export function serializeProduct(p: ProductRow) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    sku: p.sku,
    purchasePrice: p.purchasePrice,
    sellingPrice: p.sellingPrice,
    stock: p.stock,
    status: p.status,
    condition: p.condition,
    color: p.color,
    addedAt: p.addedAt.toISOString().slice(0, 10),
    soldUnits30d: p.soldUnits30d,
    imageHue: p.imageHue,
  }
}

interface OrderRow {
  id: string
  customer: string
  customerHandle: string
  productName: string
  brand: string
  date: Date
  amount: number
  profit: number
  status: string
  channel: string
  city: string
  imageHue: number
}

export function serializeOrder(o: OrderRow) {
  return { ...o, date: o.date.toISOString() }
}

interface ReviewRow {
  id: string
  supplierId: string
  author: string
  rating: number
  date: Date
  body: string
}

export function serializeReview(r: ReviewRow) {
  return { ...r, date: r.date.toISOString().slice(0, 10) }
}

interface SourcingRow {
  id: string
  type: string
  product: string
  brand: string
  price: number
  currency: string
  condition: string
  party: string
  partyVerified: boolean
  source: string
  createdAt: Date
  status: string
  note: string | null
}

export function serializeSourcing(s: SourcingRow) {
  return {
    id: s.id,
    type: s.type,
    product: s.product,
    brand: s.brand,
    price: s.price,
    currency: s.currency,
    condition: s.condition,
    party: s.party,
    partyVerified: s.partyVerified,
    source: s.source,
    createdAt: s.createdAt.getTime(),
    status: s.status,
    note: s.note ?? undefined,
  }
}
