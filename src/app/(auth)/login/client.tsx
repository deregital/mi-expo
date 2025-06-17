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
    <main className='flex flex-col items-center justify-evenly'>
      <div className='flex flex-col items-center'>
        <h1 className='text-6xl font-semibold my-6'>
          <span className='text-miExpo-purple'>M</span>i
          <span className='text-miExpo-gray'>E</span>xpo
        </h1>
        <h3 className='text-lg'>La app para transformarte en artista</h3>
      </div>
      <div className='flex flex-col items-center gap-y-6'>
        {!isOpen ? (
          <Button
            variant={'miExpoPrimary'}
            size={'miExpoLg'}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Registrate
          </Button>
        ) : (
          <>
            <Input
              className='p-6 text-center'
              value={phoneNumber}
              placeholder='Ingresá tu numero de teléfono'
              onChange={(e) => setPhoneNumber(e.currentTarget.value)}
            />
            <Button
              variant={'miExpoPrimary'}
              size={'miExpoLg'}
              className='bg-miExpo-dark-purple'
              onClick={() => checkPhoneNumber(phoneNumber)}
            >
              Continuar registro
            </Button>
          </>
        )}

        <Button
          variant={'miExpoSecundary'}
          size={'miExpoLg'}
          onClick={() => {
            redirect('/login/username-password');
          }}
        >
          Iniciá sesión
        </Button>
      </div>
    </main>
  );
}
