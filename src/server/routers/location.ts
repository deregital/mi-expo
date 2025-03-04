import { handleError, publicProcedure, router } from '@/server/trpc';
import { z } from 'zod';

export const locationRouter = router({
  getCitiesByArgState: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.fetch.GET(
        `/location/find-cities-by-arg-state/{argState}`,
        {
          params: {
            path: {
              argState: input,
            },
          },
        },
      );

      if (error) {
        throw handleError(error);
      }

      return data?.cities ?? [];
    }),
  getArgStates: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.fetch.GET('/location/arg-states');

    if (error) {
      throw handleError(error);
    }

    return data.states;
  }),
  getCountries: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.fetch.GET('/location/all-countries');

    if (error) {
      throw handleError(error);
    }

    return data.countries;
  }),
  getStateByCountry: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.fetch.GET(
        `/location/states-by-country/{countryCode}`,
        {
          params: {
            path: {
              countryCode: input,
            },
          },
        },
      );

      if (error) {
        throw handleError(error);
      }

      return data?.states ?? [];
    }),
});
