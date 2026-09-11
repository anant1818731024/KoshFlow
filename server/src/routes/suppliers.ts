import { Router } from 'express'
import { prisma } from '../db.js'
import { serializeReview } from '../lib/serialize.js'
import { asyncHandler } from '../lib/helpers.js'

export const suppliersRouter = Router()

suppliersRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { rating: 'desc' },
    })
    res.json(suppliers)
  }),
)

// All reviews, so the client can render them per-supplier without N requests.
suppliersRouter.get(
  '/reviews',
  asyncHandler(async (_req, res) => {
    const reviews = await prisma.supplierReview.findMany({
      orderBy: { date: 'desc' },
    })
    res.json(reviews.map(serializeReview))
  }),
)
