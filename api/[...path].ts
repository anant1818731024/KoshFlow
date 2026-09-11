import { createApp } from '../server/src/app.js'

const app = createApp()

const handler = (req: any, res: any, next: any) => {
	// Vercel can pass the catch-all path without its /api prefix.
	if (!req.url.startsWith('/api')) {
		req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`
	}
	app(req, res, next)
}

export default handler
