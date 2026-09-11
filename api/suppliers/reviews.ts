import { createApp } from '../../../server/src/app.js'

const app = createApp()

export default function handler(req: any, res: any) {
  req.url = '/api/suppliers/reviews'
  return app(req, res)
}
