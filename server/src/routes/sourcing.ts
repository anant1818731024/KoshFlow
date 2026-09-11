import { Router } from 'express'
import { prisma } from '../db.js'
import { serializeSourcing } from '../lib/serialize.js'
import { asyncHandler } from '../lib/helpers.js'

export const sourcingRouter = Router()

sourcingRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const listings = await prisma.sourcingListing.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(listings.map(serializeSourcing))
  }),
)
