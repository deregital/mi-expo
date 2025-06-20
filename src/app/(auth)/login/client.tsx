'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { checkPhoneNumber } from './action';
import { useRouter } from 'next/navigation';

export function LoginClient() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            {error.length !== 0 && (
              <p className='text-red-600 font-bold'>{error}</p>
            )}
            <div className='flex flex-col items-center gap-y-6'>
              <Input
                className='p-6 text-center'
                value={phoneNumber}
                placeholder='Ingresá tu numero de teléfono'
                onChange={(e) => setPhoneNumber(e.currentTarget.value)}
              />
              <Button
                variant={'miExpoPrimary'}
                size={'miExpoLg'}
                className='bg-miExpo-dark-purple hover:bg-miExpo-purple'
                disabled={isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true);
                  const result = await checkPhoneNumber(phoneNumber);
                  if (result?.errors) {
                    setError(result.errors?.[0]);
                  }
                  setIsSubmitting(false);
                }}
              >
                Continuar registro
              </Button>
            </div>
          </>
        )}
        <Button
          variant={'miExpoSecundary'}
          size={'miExpoLg'}
          onClick={() => {
            router.push('/login/username-password');
          }}
        >
          Iniciá sesión
        </Button>
      </div>
    </main>
  );
}
