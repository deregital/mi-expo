'use server';

import { trpc } from '@/server/trpc/server';
import { profileSchema } from 'expo-backend-types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkPhoneNumber(phoneNumber: string) {
  let hasError = false;
  try {
    const data = await trpc.profile.getByPhoneNumber(phoneNumber);
    if (data.isPhoneVerified) {
      hasError = true;
      return {
        success: false,
        errors: ['El teléfono ya fue verificado, por favor inicie sesión'],
        inputs: phoneNumber,
      };
    }
    (await cookies()).set('profileData', JSON.stringify(data));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  } catch (e) {
    const validatedData =
      profileSchema.shape.phoneNumber.safeParse(phoneNumber);

    if (!validatedData.success) {
      hasError = true;
      return {
        success: false,
        errors: validatedData.error.flatten().formErrors || [],
        inputs: phoneNumber,
      };
    }

    (await cookies()).set('profileData', JSON.stringify({ phoneNumber }));
  } finally {
    if (!hasError) {
      redirect('/login/fill-data');
    }
  }
}
