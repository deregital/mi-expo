'use client';

import { authenticate } from '@/app/(auth)/login/(layout)/username-password/actions';
import { GoBack } from '@/components/go-back';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type ActionResponse } from '@/lib/action-type';
import { type LoginDto } from 'expo-backend-types';
import { useActionState } from 'react';

const initialState: ActionResponse<LoginDto> = {
  success: false,
};

export function LoginUsernamePasswordClient() {
  const [state, action, isPending] = useActionState(authenticate, initialState);

  return (
    <div className='w-full h-full bg-white flex items-center justify-center flex-col'>
      <GoBack text='Iniciar sesión' />
      <div className='overflow-hidden w-full h-full flex items-center justify-center flex-col px-16'>
        <div className='py-2 border rounded-t-[10px] px-3 text-center self-start border-b-0'>
          <p className='text-sm text-center font-medium'>Completá tus datos</p>
        </div>
        <fieldset className='w-full rounded-md border-2 p-4 pb-4 lg:max-w-xl'>
          <form action={action} className='flex flex-col gap-4'>
            <Label htmlFor='username'>Nombre de usuario</Label>
            <Input
              className='text-black'
              type='text'
              name='username'
              id='username'
              placeholder='Ingresá tu nombre de usuario'
              defaultValue={state.inputs?.username}
            />
            <Label htmlFor='password'>Contraseña</Label>
            <Input
              className='text-black'
              type='password'
              name='password'
              id='password'
              placeholder='Ingresá tu contraseña'
              defaultValue={state.inputs?.password}
            />
            <Button
              variant={'miExpoPrimary'}
              size={'miExpoDefault'}
              type='submit'
              disabled={isPending}
            >
              Iniciar sesión
            </Button>
          </form>
          {state.errors && (
            <p className='mt-2 text-sm font-bold text-red-500'>
              {Array.isArray(state.errors) ? state.errors[0] : state.errors}
            </p>
          )}
        </fieldset>
      </div>
    </div>
  );
}
