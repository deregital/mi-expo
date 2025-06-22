'use server';

import { signIn, signOut } from '@/server/auth';

export async function signOutAction() {
  await signOut();
}

export async function signInAction() {
  await signIn();
}
