import 'dotenv/config'
import { prisma } from '../src/db.js'
import { products } from '../src/seed/products.js'
import { orders } from '../src/seed/orders.js'
import { suppliers } from '../src/seed/suppliers.js'
import { supplierReviews } from '../src/seed/suppliers.js'
import { marketplaceListings } from '../src/seed/marketplace.js'
import { sourcingSeeds } from '../src/seed/sourcing.js'
import { monthlyMetrics } from '../src/seed/metrics.js'

async function main() {
  console.log('🌱  Seeding KoshFlow database…')

  // Clear in FK-safe order.
  await prisma.supplierReview.deleteMany()
  await prisma.marketplaceListing.deleteMany()
  await prisma.sourcingListing.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.monthlyMetric.deleteMany()
  await prisma.supplier.deleteMany()

  await prisma.supplier.createMany({
    data: suppliers.map((s) => ({ ...s })),
  })
  console.log(`   • ${suppliers.length} suppliers`)

  await prisma.supplierReview.createMany({
    data: supplierReviews.map((r) => ({ ...r, date: new Date(r.date) })),
  })
  console.log(`   • ${supplierReviews.length} reviews`)

  await prisma.marketplaceListing.createMany({
    data: marketplaceListings.map((m) => ({ ...m })),
  })
  console.log(`   • ${marketplaceListings.length} marketplace listings`)

  await prisma.product.createMany({
    data: products.map((p) => ({ ...p, addedAt: new Date(p.addedAt) })),
  })
  console.log(`   • ${products.length} products`)

  await prisma.order.createMany({
    data: orders.map((o) => ({ ...o, date: new Date(o.date) })),
  })
  console.log(`   • ${orders.length} orders`)

  const now = Date.now()
  await prisma.sourcingListing.createMany({
    data: sourcingSeeds.map((s) => {
      const { minutesAgo, ...rest } = s
      return { ...rest, createdAt: new Date(now - minutesAgo * 60_000) }
    }),
  })
  console.log(`   • ${sourcingSeeds.length} sourcing listings`)

  await prisma.monthlyMetric.createMany({ data: monthlyMetrics })
  console.log(`   • ${monthlyMetrics.length} monthly metrics`)

  console.log('✅  Seed complete.')
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
