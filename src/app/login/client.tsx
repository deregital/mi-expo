'use client';

import { authenticate } from '@/app/login/actions';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

export function LoginClient() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const target = event.target as HTMLFormElement;
      const res = await authenticate({
        username: (target.elements.namedItem('username') as HTMLInputElement)
          .value,
        password: (target.elements.namedItem('password') as HTMLInputElement)
          .value,
      });

      if (!res.success) {
        setError(res.error?.message);
      } else {
        setError(null);
        router.push('/');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error);
    }
  };

  return (
    <div className='w-full h-full bg-white flex items-center justify-center flex-col'>
      <legend className='mb-4 text-center'>
        <h1 className='text-3xl font-bold text-slate-900'>Iniciar Sesión</h1>
      </legend>
      <fieldset className='w-full max-w-[calc(100%-16px)] rounded-md border-2 border-slate-500/50 p-7 bg-black/20 pb-4 lg:max-w-xl'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            className='text-black'
            type='text'
            name='username'
            id='username'
            placeholder='Nombre de Usuario'
          />
          <input
            className='text-black'
            type='password'
            name='password'
            id='password'
            placeholder='Contraseña'
          />
          <button type='submit' className='bg-blue-500 p-2'>
            Log In
          </button>
        </form>
        {error && (
          <p className='mt-2 text-sm font-bold text-red-500'>{error}</p>
        )}
      </fieldset>
    </div>
  );
}
