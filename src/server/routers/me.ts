import {
  handleError,
  protectedProcedure,
  publicProcedure,
  router,
} from '@/server/trpc';
import {
  updateMiExpoMeFirstTimeSchema,
  updateMiExpoMeSchema,
} from 'expo-backend-types';

export const meRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.fetch.GET(`/mi-expo/me`);
    return data;
  }),
  update: publicProcedure
    .input(updateMiExpoMeFirstTimeSchema)
    .mutation(async ({ input, ctx }) => {
      const { data: dataLogin, error: errorLogin } = await ctx.fetch.POST(
        '/auth/login',
        {
          body: {
            username: process.env.ADMIN_USERNAME ?? '',
            password: process.env.ADMIN_PASSWORD ?? '',
          },
        },
      );

      if (errorLogin) throw handleError(errorLogin);
      const birthDate = input.birthDate?.toISOString();
      const { data, error } = await ctx.fetch.PATCH(`/mi-expo/me-first-time`, {
        body: {
          ...input,
          birthDate: birthDate ?? null,
        },
        headers: {
          Authorization: `Bearer ${dataLogin.backendTokens.accessToken}`,
        },
      });
      console.log('DATA:', data);

      if (error) throw handleError(error);

      return data;
    }),
  update2: protectedProcedure
    .input(updateMiExpoMeSchema)
    .mutation(async ({ input, ctx }) => {
      const birthDate = input.birthDate?.toISOString();
      const { data, error } = await ctx.fetch.PATCH(`/mi-expo/me`, {
        body: {
          ...input,
          birthDate: birthDate ?? null,
        },
      });
      console.log('DATA:', data);

      if (error) throw handleError(error);

      return data;
    }),
});
