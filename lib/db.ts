import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

// One client for the whole app. In development, hot reload would create a new one each time,
// so it is kept on globalThis.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  // Set DB_TIMING=1 to print how long each query takes, to find slow ones. Off by default.
  const timing = process.env.DB_TIMING === "1";
  const client = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    ...(timing ? { log: [{ emit: "event" as const, level: "query" as const }] } : {}),
  });
  if (timing) {
    (client as unknown as { $on: (event: "query", cb: (e: { duration: number; query: string }) => void) => void }).$on("query", (e) =>
      console.log(`[db] ${String(e.duration).padStart(4)}ms ${e.query.replace(/\s+/g, " ").slice(0, 110)}`),
    );
  }
  return client;
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
