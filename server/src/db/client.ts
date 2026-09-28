import { PrismaClient } from '@prisma/client';

/**
 * Lazily-created Prisma client.
 *
 * Instantiating PrismaClient throws when DATABASE_URL is absent, and the unit
 * tests import the Express app without a database, so the client must only be
 * constructed on first use (routes / seeding) — never at module load.
 */
let client: PrismaClient | undefined;

export const getPrisma = (): PrismaClient => {
  if (!client) {
    client = new PrismaClient();
  }
  return client;
};
