import { Router } from 'express'
import { prisma } from '../db.js'
import { asyncHandler } from '../lib/helpers.js'

export const marketplaceRouter = Router()

marketplaceRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const listings = await prisma.marketplaceListing.findMany({
      orderBy: { id: 'asc' },
    })
    res.json(listings)
  }),
)
