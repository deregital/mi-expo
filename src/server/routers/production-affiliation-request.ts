import { protectedProcedure, router } from '@/server/trpc';
import { productionSchema } from 'expo-backend-types';

export const productionAffiliationRequestRouter = router({
  create: protectedProcedure
    .input(productionSchema.shape.id)
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.POST(
        '/production-affiliation-request/create',
        {
          body: {
            productionId: input,
          },
        },
      );
      console.log('err:', error);
      return data;
    }),
  accept: protectedProcedure
    .input(productionSchema.shape.id)
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.POST(
        '/production-affiliation-request/accept/{id}',
        {
          params: {
            path: {
              id: input,
            },
          },
        },
      );
      console.log('err:', error);
      return data;
    }),
  reject: protectedProcedure
    .input(productionSchema.shape.id)
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.POST(
        '/production-affiliation-request/reject/{id}',
        {
          params: {
            path: {
              id: input,
            },
          },
        },
      );
      console.log('err:', error);
      return data;
    }),
});
