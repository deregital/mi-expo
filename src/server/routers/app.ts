import { locationRouter } from '@/server/routers/location';
import { meRouter } from '@/server/routers/me';
import { otpRouter } from '@/server/routers/otp';
import { profileRouter } from '@/server/routers/profile';
import { router } from '@/server/trpc';
import { productionRouter } from './production';
import { productionAffiliationRequestRouter } from './production-affiliation-request';

export const appRouter = router({
  otp: otpRouter,
  location: locationRouter,
  profile: profileRouter,
  me: meRouter,
  production: productionRouter,
  productionAfilliationRequest: productionAffiliationRequestRouter,
});

export type AppRouter = typeof appRouter;
