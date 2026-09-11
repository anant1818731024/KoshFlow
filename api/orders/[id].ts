import { prisma } from '../../server/src/db.js'
import { serializeOrder } from '../../server/src/lib/serialize.js'

const orderStatuses = new Set([
  'pending',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
])

export default async function handler(req: any, res: any) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const status = req.body?.status
  if (!status || !orderStatuses.has(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  try {
    const orderId = req.query?.id ?? req.url?.split('/').pop()
    const existing = await prisma.order.findUnique({
      where: { id: orderId },
    })
    if (!existing) return res.status(404).json({ error: 'Order not found' })

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
    return res.status(200).json(serializeOrder(order))
  } catch (error) {
    console.error('Order update API error:', error)
    return res.status(500).json({ error: 'Could not update order' })
  }
}
