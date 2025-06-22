'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { checkPhoneNumber } from './action';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function LoginClient() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <main className='flex items-center justify-center gap-16'>
      <div className='flex h-full flex-col items-center justify-evenly'>
        <div className='flex-shrink-0 flex flex-col items-center'>
          <h1 className='text-6xl font-semibold my-6 lg:text-8xl'>
            <span className='text-miExpo-purple'>M</span>i
            <span className='text-miExpo-gray'>E</span>xpo
          </h1>
          <h3 className='text-lg lg:text-2xl'>
            La app para transformarte en artista
          </h3>
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
              <div className='flex flex-col items-center gap-y-6'>
                <div className='flex flex-col items-center gap-2'>
                  <Input
                    className='py-3 text-center w-72'
                    value={phoneNumber}
                    placeholder='Ingresá tu numero de teléfono'
                    onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                  />
                  {error.length !== 0 && (
                    <p className='text-red-600 font-bold'>{error}</p>
                  )}
                </div>
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
      </div>
      <Image
        className='hidden lg:block'
        alt=''
        src='/login/auth-screen.png'
        width={500}
        height={500}
      />
    </main>
  );
}
