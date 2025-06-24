import { fetchClient } from '@/server/fetchClient';
import { publicProcedure, router } from '@/server/trpc';
import { sendOtpSchema, verifyOtpSchema } from 'expo-backend-types';

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
