import { protectedProcedure, router } from '@/server/trpc';

export const meRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.fetch.GET(`/mi-expo/me`);
    return data;
  }),
});
