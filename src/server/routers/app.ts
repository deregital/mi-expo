import { locationRouter } from '@/server/routers/location';
import { meRouter } from '@/server/routers/me';
import { otpRouter } from '@/server/routers/otp';
import { profileRouter } from '@/server/routers/profile';
import { router } from '@/server/trpc';

export const appRouter = router({
  otp: otpRouter,
  location: locationRouter,
  profile: profileRouter,
  me: meRouter,
});

export type AppRouter = typeof appRouter;
