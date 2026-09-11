import { createApp } from '../../../server/src/app.js'

const app = createApp()

export default function handler(req: any, res: any, next: any) {
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
  req.url = `/api/suppliers/reviews${query}`
  return app(req, res, next)
}
