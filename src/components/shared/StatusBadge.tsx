import { Badge } from '@/components/ui/Badge'
import type {
  Availability,
  OrderStatus,
  SourcingStatus,
  StockStatus,
} from '@/types'

const orderMap: Record<OrderStatus, { label: string; tone: Parameters<typeof Badge>[0]['tone'] }> = {
  pending: { label: 'Pending', tone: 'neutral' },
  paid: { label: 'Paid', tone: 'info' },
  processing: { label: 'Processing', tone: 'warn' },
  shipped: { label: 'Shipped', tone: 'accent' },
  completed: { label: 'Completed', tone: 'positive' },
  cancelled: { label: 'Cancelled', tone: 'negative' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, tone } = orderMap[status]
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  )
}

const stockMap: Record<StockStatus, { label: string; tone: Parameters<typeof Badge>[0]['tone'] }> = {
  in_stock: { label: 'In stock', tone: 'positive' },
  low_stock: { label: 'Low stock', tone: 'warn' },
  reserved: { label: 'Reserved', tone: 'info' },
  out_of_stock: { label: 'Out of stock', tone: 'negative' },
}

export function StockStatusBadge({ status }: { status: StockStatus }) {
  const { label, tone } = stockMap[status]
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  )
}

const availabilityMap: Record<Availability, { label: string; tone: Parameters<typeof Badge>[0]['tone'] }> = {
  available: { label: 'Available', tone: 'positive' },
  limited: { label: 'Limited', tone: 'warn' },
  pre_order: { label: 'Pre-order', tone: 'info' },
  sold: { label: 'Sold', tone: 'neutral' },
}

export function AvailabilityBadge({ status }: { status: Availability }) {
  const { label, tone } = availabilityMap[status]
  return <Badge tone={tone}>{label}</Badge>
}

const sourcingMap: Record<SourcingStatus, { label: string; tone: Parameters<typeof Badge>[0]['tone'] }> = {
  active: { label: 'Active', tone: 'positive' },
  pending: { label: 'On hold', tone: 'warn' },
  fulfilled: { label: 'Fulfilled', tone: 'neutral' },
  expired: { label: 'Expired', tone: 'neutral' },
}

export function SourcingStatusBadge({ status }: { status: SourcingStatus }) {
  const { label, tone } = sourcingMap[status]
  return (
    <Badge tone={tone} size="sm">
      {label}
    </Badge>
  )
}
