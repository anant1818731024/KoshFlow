import 'dotenv/config'

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. ` +
        `Copy server/.env.example to server/.env and fill it in.`,
    )
  }
  return value
}

export const env = {
  databaseUrl: required('DATABASE_URL'),
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
