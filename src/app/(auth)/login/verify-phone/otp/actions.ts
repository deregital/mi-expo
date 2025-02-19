'use server';

import { signIn } from '@/server/auth';

export async function signInPhoneNumber({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  await signIn('phoneNumber', {
    phoneNumber,
    redirect: false,
  });
}
