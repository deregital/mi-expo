import { locationRouter } from '@/server/routers/location';
import { otpRouter } from '@/server/routers/otp';
import { router } from '@/server/trpc';

export const appRouter = router({
  otp: otpRouter,
  location: locationRouter,
});

export type AppRouter = typeof appRouter;
