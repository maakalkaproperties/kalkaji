import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function cleanDatabaseUrl(raw?: string): string | undefined {
  if (!raw) return undefined;

  let url = raw.trim();

  // Remove surrounding quotes if user added quotes inside Vercel env
  if (
    (url.startsWith('"') && url.endsWith('"')) ||
    (url.startsWith("'") && url.endsWith("'"))
  ) {
    url = url.slice(1, -1);
  }

  // Remove square brackets around password, e.g. :[ashishJI@9968]@ -> :ashishJI@9968@
  url = url.replace(/:\[(.*?)\]@/, ':$1@');

  // If password contains raw '@', URL encode it to '%40'
  // e.g. postgresql://postgres:ashishJI@9968@db.xxx -> postgresql://postgres:ashishJI%409968@db.xxx
  const protocolIdx = url.indexOf('://');
  if (protocolIdx !== -1) {
    const afterProtocol = url.slice(protocolIdx + 3);
    const lastAtIdx = afterProtocol.lastIndexOf('@');
    if (lastAtIdx !== -1) {
      const authPart = afterProtocol.slice(0, lastAtIdx);
      const hostPart = afterProtocol.slice(lastAtIdx + 1);
      const firstColonIdx = authPart.indexOf(':');
      if (firstColonIdx !== -1) {
        const username = authPart.slice(0, firstColonIdx);
        let password = authPart.slice(firstColonIdx + 1);
        password = encodeURIComponent(decodeURIComponent(password));
        url = `${url.slice(0, protocolIdx + 3)}${username}:${password}@${hostPart}`;
      }
    }
  }

  return url;
}

function getPrismaClient(): PrismaClient {
  const url = cleanDatabaseUrl(process.env.DATABASE_URL);

  return new PrismaClient({
    datasourceUrl: url,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
