import { handleError, protectedProcedure, router } from '@/server/trpc';
import { DynamicFormType, submitDynamicFormsSchema } from 'expo-backend-types';
import { z } from 'zod';

export const dynamicFormRouter = router({
  getByType: protectedProcedure
    .input(z.nativeEnum(DynamicFormType))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.GET(
        '/dynamic-form/by-type/{type}',
        {
          params: {
            path: {
              type: input,
            },
          },
        },
      );

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

      if (error) throw handleError(error);

      return data;
    }),
});
