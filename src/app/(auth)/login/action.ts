'use server';

import { trpc } from '@/server/trpc/server';
import { profileSchema } from 'expo-backend-types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkPhoneNumber(phoneNumber: string) {
  try {
    const data = await trpc.profile.getByPhoneNumber(phoneNumber);

    (await cookies()).set('profileData', JSON.stringify(data));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  } catch (e) {
    const validatedData =
      profileSchema.shape.phoneNumber.safeParse(phoneNumber);

    if (!validatedData.success) {
      return {
        success: false,
        errors: Object.values(validatedData.error.flatten().fieldErrors).map(
          (error) => error?.[0] || '',
        ),
        inputs: phoneNumber,
      };
    }

    (await cookies()).set('profileData', JSON.stringify({ phoneNumber }));
  } finally {
    redirect('/login/fill-data');
  }
}
