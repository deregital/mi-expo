import { baseProcedure, createTRPCRouter } from '@/server/trpc/init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure.query(() => 'Hello, world!'),
});

export type AppRouter = typeof appRouter;
