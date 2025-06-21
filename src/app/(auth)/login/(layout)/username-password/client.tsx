'use client';

import {
  authenticate,
  type LoginActionState,
} from '@/app/(auth)/login/(layout)/username-password/actions';
import { GoBack } from '@/components/go-back';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useActionState } from 'react';

const initialState: LoginActionState = {};

export function LoginUsernamePasswordClient() {
  const [state, action, isPending] = useActionState(authenticate, initialState);

  return (
    <>
      <GoBack text='Iniciar sesión' redirect='/login' />
      <div className='w-full h-full flex items-center justify-center'>
        <div className='w-full max-w-3xl h-full flex items-center justify-center flex-col px-16'>
          <div className='w-full'>
            <Label className='border-miExpo-white-gray' variant={'miExpoCard'}>
              Completá tus datos
            </Label>
          </div>
          <fieldset className='w-full rounded-md border-2 rounded-tl-none bg-miExpo-white-gray p-4 pb-4'>
            <form action={action} className='flex flex-col gap-6 p-6'>
              <div className='flex flex-col gap-2'>
                <Label className='font-medium' htmlFor='username'>
                  Nombre de usuario
                </Label>
                <Input
                  variant={'miExpoClassic'}
                  type='text'
                  name='username'
                  id='username'
                  placeholder='Ingresá tu nombre de usuario'
                  defaultValue={state.username}
                />
                {state.errors?.username && (
                  <p className='mt-2 text-sm font-bold text-red-500'>
                    {state.errors?.username}
                  </p>
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <Label className='font-medium' htmlFor='password'>
                  Contraseña
                </Label>
                <Input
                  variant={'miExpoClassic'}
                  type='password'
                  name='password'
                  id='password'
                  placeholder='Ingresá tu contraseña'
                />
                {state.errors?.password && (
                  <p className='mt-2 text-sm font-bold text-red-500'>
                    {state.errors?.password}
                  </p>
                )}
              </div>

              {state.errors?.general && (
                <p className='mt-2 text-sm font-bold text-red-500'>
                  {state.errors.general}
                </p>
              )}
              <Button
                className='mt-6'
                variant={'miExpoPrimary'}
                size={'miExpoDefault'}
                type='submit'
                disabled={isPending}
              >
                Iniciar sesión
              </Button>
            </form>
          </fieldset>
        </div>
        <Image
          className='hidden lg:block'
          alt=''
          src='/login/login-username-password.png'
          width={500}
          height={500}
        />
      </div>
    </>
  );
}
