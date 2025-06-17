'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { checkPhoneNumber } from './action';

export function LoginClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <main className='flex flex-col items-center'>
      <h1 className='text-5xl font-semibold'>MiExpo</h1>
      <h3 className='text-lg'>La app para transformarte en artista</h3>
      <div className='flex h-full flex-col items-center gap-y-6'>
        {!isOpen ? (
          <Button
            variant={'miExpoPrimary'}
            size={'miExpoDefault'}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Registrate
          </Button>
        ) : (
          <>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.currentTarget.value)}
            />
            <Button
              variant={'miExpoPrimary'}
              size={'miExpoDefault'}
              className='bg-miExpo-dark-purple'
              onClick={() => checkPhoneNumber(phoneNumber)}
            >
              Continuar registro
            </Button>
          </>
        )}

        <Button
          variant={'miExpoSecundary'}
          size={'miExpoDefault'}
          onClick={() => {
            redirect('/login/username-password');
          }}
        >
          Iniciá sesión
        </Button>
      </div>

      <div className='flex h-full items-center gap-x-2'></div>
    </main>
  );
}
