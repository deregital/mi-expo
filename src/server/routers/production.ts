import { handleError, protectedProcedure, router } from '@/server/trpc';
import { createProductionSchema } from 'expo-backend-types';

export const productionRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.fetch.GET('/production/all');
    return data;
  }),
  create: protectedProcedure
    .input(createProductionSchema)
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.POST('/production/create', {
        body: input,
      });

      if (error) handleError(error);

      return data;
    }),
});
