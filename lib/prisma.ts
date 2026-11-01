import { PrismaClient } from '@prisma/client';

// Ensure DATABASE_URL is resolved from any Vercel integration variable
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) {
  const fallbackUrl =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_URL;
  if (fallbackUrl) {
    process.env.DATABASE_URL = fallbackUrl;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
