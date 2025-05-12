import { protectedProcedure, router } from '@/server/trpc';

export const productionRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.fetch.GET('/production/all');
    return data;
  }),
});
