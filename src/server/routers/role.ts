import { handleError, protectedProcedure, router } from '@/server/trpc';
import {
  allocateParticipantRoleSchema,
  allocateProductionRoleSchema,
} from 'expo-backend-types';

export const roleRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { data } = await ctx.fetch.GET('/role/all');
    return data;
  }),
  allocateParticipant: protectedProcedure
    .input(allocateParticipantRoleSchema)
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.POST(
        '/role/allocate-participant',
        {
          body: input,
        },
      );

      if (error) handleError(error);

      return data;
    }),
  allocateProduction: protectedProcedure
    .input(allocateProductionRoleSchema)
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.fetch.POST(
        '/role/allocate-production/{id}',
        {
          params: {
            path: {
              id: input.profileId,
            },
          },
        },
      );

      if (error) handleError(error);

      return data;
    }),
});
