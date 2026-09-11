import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { env } from './env.js'
import { productsRouter } from './routes/products.js'
import { ordersRouter } from './routes/orders.js'
import { suppliersRouter } from './routes/suppliers.js'
import { marketplaceRouter } from './routes/marketplace.js'
import { sourcingRouter } from './routes/sourcing.js'
import { analyticsRouter } from './routes/analytics.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.clientOrigin === '*' ? true : env.clientOrigin.split(','),
    }),
  )
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'koshflow-api', time: new Date().toISOString() })
  })

  app.use('/api/products', productsRouter)
  app.use('/api/orders', ordersRouter)
  app.use('/api/suppliers', suppliersRouter)
  app.use('/api/marketplace', marketplaceRouter)
  app.use('/api/sourcing', sourcingRouter)
  app.use('/api/analytics', analyticsRouter)

  // 404
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  // Central error handler
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('API error:', err)
    const message =
      err instanceof Error ? err.message : 'Internal server error'
    res.status(500).json({ error: message })
  })

  return app
}
