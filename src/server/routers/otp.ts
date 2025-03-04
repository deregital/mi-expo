import { fetchClient } from '@/server/fetchClient';
import { publicProcedure, router } from '@/server/trpc';
import { sendOtpSchema, verifyOtpSchema } from 'expo-backend-types';
import { cookies } from 'next/headers';

export const otpRouter = router({
  send: publicProcedure.input(sendOtpSchema).mutation(async ({ input }) => {
    const { error, data } = await fetchClient.POST('/otp/send', {
      body: {
        phoneNumber: input.phoneNumber,
      },
    });

    if (error) {
      throw new Error(error.message[0]);
    }

    if (data.response.hasVerified && !data.response.hasUsername) {
      return data.response;
    }

    const cookieStore = await cookies();
    cookieStore.set('phoneNumber', input.phoneNumber);

    return data.response;
  }),
  verify: publicProcedure.input(verifyOtpSchema).mutation(async ({ input }) => {
    const { error, data } = await fetchClient.POST('/otp/verify', {
      body: {
        phoneNumber: input.phoneNumber,
        code: input.code,
      },
    });

    if (error) {
      throw new Error(error.message[0]);
    }
    if (data.success) {
      return;
    } else {
      throw new Error('Algo salió mal');
    }
  }),
});
