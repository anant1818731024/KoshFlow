import { createApp } from './app.js'
import { env } from './env.js'
import { prisma } from './db.js'

async function start() {
  const app = createApp()

  // Fail fast if the database isn't reachable.
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (err) {
    console.error(
      '\n❌  Could not connect to the database. Is DATABASE_URL set and Postgres running?\n',
    )
    console.error(err)
    process.exit(1)
  }

  app.listen(env.port, () => {
    console.log(`\n🟢  KoshFlow API listening on http://localhost:${env.port}`)
    console.log(`   Health:  http://localhost:${env.port}/api/health`)
    console.log(`   CORS:    ${env.clientOrigin}\n`)
  })
}

start()
