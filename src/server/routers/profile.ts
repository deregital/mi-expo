import { formSchema } from '@/lib/formSchema';
import { handleError, protectedProcedure, router } from '@/server/trpc';
import { profileSchema } from 'expo-backend-types';

export const profileRouter = router({
  edit: protectedProcedure
    .input(
      formSchema.extend({
        id: profileSchema.shape.id,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // const birthDate = input.birthDate?.toISOString() ?? null;
      // const { error, data } = await ctx.fetch.PATCH(`/mi-expo/me`, {
      //   params: {
      //     path: {
      //       id: input.id,
      //     },
      //   },
      //   body: {
      //     ...input,
      //     birthDate: birthDate,
      //   },
      // });
      // if (error) throw handleError(error);
      // return data;
    }),
  getById: protectedProcedure
    .input(profileSchema.shape.id)
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.GET(`/profile/{id}`, {
        params: {
          path: {
            id: input,
          },
        },
      });

      if (error) throw handleError(error);

      return data;
    }),
});
