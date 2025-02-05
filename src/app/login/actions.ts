'use server';

import { signIn } from '@/server/auth';
import { loginSchema, type LoginDto } from 'expo-backend-types';
import { redirect } from 'next/navigation';

export interface ActionResponse {
  success: boolean;
  errors?: string | string[];
  inputs?: LoginDto;
}

export async function authenticate(
  prevState: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  const rawData: LoginDto = {
    username: formData.get('username') as string,
    password: formData.get('password') as string,
  };
  try {
    const validatedData = loginSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: Object.values(validatedData.error.flatten().fieldErrors).map(
          (error) => error[0],
        ),
        inputs: rawData,
      };
    }

    await signIn('credentials', {
      username: validatedData.data.username,
      password: validatedData.data.password,
      redirectTo: '/',
      redirect: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return {
      success: false,
      errors: err.message,
      inputs: rawData,
    };
  }

  redirect('/');
}
