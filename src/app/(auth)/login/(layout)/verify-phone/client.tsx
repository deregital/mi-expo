'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { trpc } from '@/server/trpc/client';
import { type VerifyOtpDto } from 'expo-backend-types';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { GoBack } from '@/components/go-back';
import { TRPCClientError } from '@trpc/client';
import { successVerifyPhone } from './actions';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface VerifyPhoneOtpClientProps {
  phoneNumber: string;
}

export function VerifyPhoneOtpClient({
  phoneNumber,
}: VerifyPhoneOtpClientProps) {
  const form = useForm<Pick<VerifyOtpDto, 'code'>>();
  const verifyOtpMutation = trpc.otp.verify.useMutation({
    onSuccess: async () => {
      await successVerifyPhone({ phoneNumber });
    },
    onError: async (e) => {
      if (e.message.startsWith('[\n')) {
        const parsedError = JSON.parse(e.message);
        setError(parsedError[0].message);
      } else {
        setError(e.message);
      }
    },
  });
  const sentOtpMutation = trpc.otp.send.useMutation();
  const [otpSentFirstTime, setOtpSentFirstTime] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!otpSentFirstTime) {
      sentOtpMutation.mutate({
        phoneNumber: phoneNumber,
      });
      setOtpSentFirstTime(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<Pick<VerifyOtpDto, 'code'>> = (data) => {
    try {
      verifyOtpMutation.mutate({
        phoneNumber: phoneNumber,
        code: data.code,
      });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        setError(error.message);
      }
      setError((error as Error).message);
    }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      console.log(cooldown);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  const handleResend = () => {
    if (cooldown === 0) {
      sentOtpMutation.mutate({
        phoneNumber: phoneNumber,
      });
      setCooldown(30);
    }
  };

  return (
    <>
      <GoBack
        text={`Revisá el código que te enviamos a tu número de teléfono terminado en *${phoneNumber.slice(-4)}`}
      />
      <div className='flex items-center gap-16 justify-center h-full'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full max-w-xs gap-y-5'
          >
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <>
                  <Label variant={'miExpoCard'}>Ingresá los dígitos</Label>
                  <InputOTP
                    autoFocus
                    className='flex w-full justify-center'
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    {...field}
                  >
                    <InputOTPGroup className='p-4 pt-6 border-[1px] rounded-lg rounded-tl-none border-miExpo-gray'>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </>
              )}
            />
            <div className='flex gap-x-2'>
              <Button
                variant={'link'}
                type='button'
                disabled={
                  sentOtpMutation.isPending ||
                  verifyOtpMutation.isPending ||
                  cooldown > 0
                }
                className='underline p-0 font-semibold'
                onClick={handleResend}
              >
                {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'No recibí nada'}
              </Button>
            </div>
            {error && (
              <p className='mt-2 text-sm font-bold text-red-500'>{error}</p>
            )}
            <Button
              variant={'miExpoPrimary'}
              size={'miExpoDefault'}
              className='w-full mt-6'
              disabled={
                verifyOtpMutation.isPending || sentOtpMutation.isPending
              }
              type='submit'
            >
              Continuar registro
            </Button>
          </form>
        </Form>
        <Image
          className='hidden lg:block'
          alt=''
          src='/login/verify-phone.png'
          width={500}
          height={500}
        />
      </div>
    </>
  );
}
