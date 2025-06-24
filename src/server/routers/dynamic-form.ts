import { handleError, protectedProcedure, router } from '@/server/trpc';
import { submitDynamicFormsSchema } from 'expo-backend-types';
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

      if (error) throw handleError(error);

      return data;
    }),
  submit: protectedProcedure
    .input(
      z.object({
        param: z.string(),
        input: submitDynamicFormsSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.POST(
        '/dynamic-form/submit/{id}',
        {
          params: {
            path: {
              id: input.param,
            },
          },
          body: input.input,
        },
      );

      console.log(error);

      if (error) throw handleError(error);

      return data;
    }),
});
