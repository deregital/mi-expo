'use server';

import { signOut } from '@/server/auth';
import { redirect } from 'next/navigation';

export async function successSubmitDynamicForm() {
  await signOut({
    redirect: false,
  });
  redirect('/login/username-password');
}
