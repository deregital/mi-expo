'use server';

import { redirect } from 'next/navigation';
import { signIn } from '@/server/auth';

export async function successVerifyPhone({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  await signIn('phoneNumber', {
    phoneNumber,
    redirect: false,
  });
  redirect('/login/choose-role');
}
