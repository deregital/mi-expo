import { handleError, protectedProcedure, router } from '@/server/trpc';
import { profileSchema } from 'expo-backend-types';

export const profileRouter = router({
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
