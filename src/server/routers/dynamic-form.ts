import { handleError, protectedProcedure, router } from '@/server/trpc';
import { z } from 'zod';

export const dynamicFormRouter = router({
  getByName: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.GET('/dynamic-form/{name}', {
        params: {
          path: {
            name: input,
          },
        },
      });

      if (error) handleError(error);

      return data;
    }),
});
