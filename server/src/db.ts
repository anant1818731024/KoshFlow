import { PrismaClient } from '@prisma/client'

// A single Prisma client for the process. In dev with tsx watch, reuse the
// instance across reloads to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
