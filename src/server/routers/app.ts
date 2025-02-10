import { otpRouter } from '@/server/routers/otp';
import { router } from '@/server/trpc';

export const appRouter = router({
  otp: otpRouter,
});

export type AppRouter = typeof appRouter;
