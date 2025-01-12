import { auth } from '@/server/auth';
import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';

export const createTRPCContext = cache(async (opts: { headers: Headers }) => {
  const session = await auth();

  return {
    session,
    ...opts,
  };
});

const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
