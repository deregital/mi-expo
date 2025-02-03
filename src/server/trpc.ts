import { auth } from '@/server/auth';
import { fetchClient } from '@/server/fetchClient';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();

  return {
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          (error.cause as ZodError).name === 'ZodError' ||
          error.cause instanceof ZodError
            ? (error.cause as ZodError).flatten()
            : null,
      },
    };
  },
});

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  const session = ctx.session;

  if (!session || !session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      session: { ...session, user: session.user },
      fetch: fetchClient,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
