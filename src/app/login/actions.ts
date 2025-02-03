'use server';

import { CustomError, signIn } from '@/server/auth';

export async function authenticate({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    await signIn('credentials', {
      username,
      password,
      redirectTo: '/',
      redirect: false,
    });

    return { success: true, message: 'login successful' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === CustomError.CUSTOM_ERROR_CODE) {
      return {
        error: { message: err.message },
      };
    }
    return {
      success: false,
      error: { message: 'Failed to login', error: err },
    };
  }
}
