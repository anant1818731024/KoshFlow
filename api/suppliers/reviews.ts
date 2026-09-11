import { prisma } from '../../server/src/db.js'
import { serializeReview } from '../../server/src/lib/serialize.js'

export default async function handler(_req: any, res: any) {
  try {
    const reviews = await prisma.supplierReview.findMany({
      orderBy: { date: 'desc' },
    })
    return res.status(200).json(reviews.map(serializeReview))
  } catch (error) {
    console.error('Supplier reviews API error:', error)
    return res.status(500).json({ error: 'Could not load supplier reviews' })
  }
}
