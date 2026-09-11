import { Router } from 'express'
import { prisma } from '../db.js'
import { serializeOrder } from '../lib/serialize.js'
import { asyncHandler } from '../lib/helpers.js'

export const ordersRouter = Router()

const ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
]

ordersRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const orders = await prisma.order.findMany({ orderBy: { date: 'desc' } })
    res.json(orders.map(serializeOrder))
  }),
)

ordersRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const status = (req.body as { status?: string }).status
    if (!status || !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    const existing = await prisma.order.findUnique({
      where: { id: req.params.id },
    })
    if (!existing) return res.status(404).json({ error: 'Order not found' })

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    })
    res.json(serializeOrder(order))
  }),
)
