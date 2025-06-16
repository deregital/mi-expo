import {
  handleError,
  protectedProcedure,
  publicProcedure,
  router,
} from '@/server/trpc';
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
  getByPhoneNumber: publicProcedure
    .input(profileSchema.shape.phoneNumber)
    .query(async ({ input, ctx }) => {
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

      const { data, error } = await ctx.fetch.GET(
        '/profile/find-by-phone-number/{phoneNumber}',
        {
          params: {
            path: {
              phoneNumber: input,
            },
          },
          headers: {
            Authorization: `Bearer ${dataLogin.backendTokens.accessToken}`,
          },
        },
      );

      console.log(data);

      if (error) throw handleError(error);

      return data;
    }),
});
