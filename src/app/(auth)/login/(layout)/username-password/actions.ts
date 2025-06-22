'use server';

import { signIn } from '@/server/auth';
import { loginSchema, type LoginDto } from 'expo-backend-types';
import { redirect } from 'next/navigation';

export type LoginActionState = {
  username?: string;
  password?: string;
  errors?: {
    username?: string[];
    password?: string[];
    general?: string;
  };
};

export async function authenticate(
  prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const rawData: LoginDto = {
    username: formData.get('username') as string,
    password: formData.get('password') as string,
  };
  try {
    const validatedData = loginSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        ...rawData,
        errors: {
          username: validatedData.error.flatten().fieldErrors.username,
          password: validatedData.error.flatten().fieldErrors.password,
        },
      };
    }

    await signIn('usernamePassword', {
      username: validatedData.data.username,
      password: validatedData.data.password,
      redirect: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return {
      errors: {
        general: err.message,
      },
    };
  }

  redirect('/');
}
