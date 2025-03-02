import { protectedProcedure, router } from '@/server/trpc';
import { updateMiExpoMeSchema } from 'expo-backend-types';

export const meRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.fetch.GET(`/mi-expo/me`);
    return data;
  }),
  update: protectedProcedure
    .input(updateMiExpoMeSchema)
    .mutation(async ({ input, ctx }) => {
      const birthDate = input.birthDate?.toISOString();
      const { data } = await ctx.fetch.PATCH(`/mi-expo/me`, {
        body: {
          ...input,
          birthDate: birthDate ?? null,
        },
      });
      return data;
    }),
});
