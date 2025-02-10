'use client';

import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export function LoginClient() {
  return (
    <div className='flex h-full items-center gap-x-2'>
      <Button
        className='h-fit'
        onClick={() => {
          redirect('/login/username-password');
        }}
      >
        Ya participaste en algún evento? <br /> Inicia sesión
      </Button>
      <Button
        onClick={() => {
          redirect('/register');
        }}
      >
        Es tu primera vez? Registrate
      </Button>
      <Button
        onClick={() => {
          redirect('/login/verify-phone');
        }}
      >
        Ya participé y quiero verificar mi teléfono
      </Button>
    </div>
  );
}
