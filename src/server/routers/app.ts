import { locationRouter } from '@/server/routers/location';
import { meRouter } from '@/server/routers/me';
import { otpRouter } from '@/server/routers/otp';
import { profileRouter } from '@/server/routers/profile';
import { router } from '@/server/trpc';
import { productionRouter } from '@/server/routers/production';
import { productionAffiliationRequestRouter } from '@/server/routers/production-affiliation-request';
import { dynamicFormRouter } from '@/server/routers/dynamic-form';

export const appRouter = router({
  otp: otpRouter,
  location: locationRouter,
  profile: profileRouter,
  me: meRouter,
  production: productionRouter,
  productionAfilliationRequest: productionAffiliationRequestRouter,
  dynamicForm: dynamicFormRouter,
});

export type AppRouter = typeof appRouter;
