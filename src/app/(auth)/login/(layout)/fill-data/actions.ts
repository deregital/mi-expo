'use server';

import { signIn } from '@/server/auth';
import { redirect } from 'next/navigation';

export async function signInUsernmePassword({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  await signIn('UsernamePassword', {
    username,
    password,
    redirect: false,
  });
  redirect('/');
}
