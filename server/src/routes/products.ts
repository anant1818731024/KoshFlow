import { Router } from 'express'
import { prisma } from '../db.js'
import { serializeProduct } from '../lib/serialize.js'
import { asyncHandler, genId, skuFor, statusForStock } from '../lib/helpers.js'

export const productsRouter = Router()

productsRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(products.map(serializeProduct))
  }),
)

interface ProductInput {
  name?: string
  brand?: string
  category?: string
  condition?: string
  color?: string
  purchasePrice?: number
  sellingPrice?: number
  stock?: number
}

function validate(body: ProductInput): string | null {
  if (!body.name?.trim()) return 'name is required'
  if (!body.brand?.trim()) return 'brand is required'
  if (!body.category?.trim()) return 'category is required'
  if (!body.color?.trim()) return 'color is required'
  if (!(Number(body.purchasePrice) > 0)) return 'purchasePrice must be > 0'
  if (!(Number(body.sellingPrice) > 0)) return 'sellingPrice must be > 0'
  if (body.stock == null || Number(body.stock) < 0) return 'stock must be >= 0'
  return null
}

productsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = req.body as ProductInput
    const error = validate(body)
    if (error) return res.status(400).json({ error })

    const id = genId('PRD')
    const stock = Math.floor(Number(body.stock))
    const product = await prisma.product.create({
      data: {
        id,
        name: body.name!.trim(),
        brand: body.brand!,
        category: body.category!,
        sku: skuFor(body.brand!, id, body.color!),
        purchasePrice: Math.round(Number(body.purchasePrice)),
        sellingPrice: Math.round(Number(body.sellingPrice)),
        stock,
        status: statusForStock(stock),
        condition: body.condition ?? 'Excellent',
        color: body.color!.trim(),
        addedAt: new Date(),
        soldUnits30d: 0,
        imageHue: Math.floor(Math.random() * 360),
      },
    })
    res.status(201).json(serializeProduct(product))
  }),
)

productsRouter.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const body = req.body as ProductInput
    const error = validate(body)
    if (error) return res.status(400).json({ error })

    const existing = await prisma.product.findUnique({
      where: { id: req.params.id },
    })
    if (!existing) return res.status(404).json({ error: 'Product not found' })

    const stock = Math.floor(Number(body.stock))
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: body.name!.trim(),
        brand: body.brand!,
        category: body.category!,
        condition: body.condition ?? existing.condition,
        color: body.color!.trim(),
        purchasePrice: Math.round(Number(body.purchasePrice)),
        sellingPrice: Math.round(Number(body.sellingPrice)),
        stock,
        status: existing.status === 'reserved' ? 'reserved' : statusForStock(stock),
      },
    })
    res.json(serializeProduct(product))
  }),
)

productsRouter.patch(
  '/:id/stock',
  asyncHandler(async (req, res) => {
    const delta = Number((req.body as { delta?: number }).delta)
    if (!Number.isFinite(delta)) {
      return res.status(400).json({ error: 'delta must be a number' })
    }
    const existing = await prisma.product.findUnique({
      where: { id: req.params.id },
    })
    if (!existing) return res.status(404).json({ error: 'Product not found' })

    const stock = Math.max(0, existing.stock + Math.trunc(delta))
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        stock,
        status: existing.status === 'reserved' ? 'reserved' : statusForStock(stock),
      },
    })
    res.json(serializeProduct(product))
  }),
)

productsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = await prisma.product.findUnique({
      where: { id: req.params.id },
    })
    if (!existing) return res.status(404).json({ error: 'Product not found' })
    await prisma.product.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  }),
)
