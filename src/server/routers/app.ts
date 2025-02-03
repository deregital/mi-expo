import { protectedProcedure } from '@/server/trpc';
import { baseProcedure, createTRPCRouter } from '@/server/trpc/init';
import { z } from 'zod';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(({ input }) => `Hola ${input.name}`),
  protected: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
});

export type AppRouter = typeof appRouter;
