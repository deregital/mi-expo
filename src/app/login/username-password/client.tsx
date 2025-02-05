'use client';

import { type ActionResponse, authenticate } from '@/app/login/actions';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';

const initialState: ActionResponse = {
  success: false,
};

export function LoginUsernamePasswordClient() {
  const [state, action, isPending] = useActionState(authenticate, initialState);

  return (
    <div className='w-full h-full bg-white flex items-center justify-center flex-col'>
      <legend className='mb-4 text-center'>
        <h1 className='text-3xl font-bold text-slate-900'>Iniciar Sesión</h1>
      </legend>
      <fieldset className='w-full max-w-[calc(100%-16px)] rounded-md border-2 border-slate-500/50 p-7 bg-black/20 pb-4 lg:max-w-xl'>
        <form action={action} className='flex flex-col gap-4'>
          <input
            className='text-black'
            type='text'
            name='username'
            id='username'
            placeholder='Nombre de Usuario'
            defaultValue={state.inputs?.username}
          />
          <input
            className='text-black'
            type='password'
            name='password'
            id='password'
            placeholder='Contraseña'
            defaultValue={state.inputs?.password}
          />
          <Button type='submit' disabled={isPending}>
            Log In
          </Button>
        </form>
        {state.errors && (
          <p className='mt-2 text-sm font-bold text-red-500'>
            {Array.isArray(state.errors) ? state.errors[0] : state.errors}
          </p>
        )}
      </fieldset>
    </div>
  );
}
