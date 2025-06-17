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
import { successVerifyPhone } from './actions';
import { useEffect, useState } from 'react';

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
  });

  const sentOtpMutation = trpc.otp.send.useMutation();
  const [otpSentFirstTime, setOtpSentFirstTime] = useState<boolean>(false);

  useEffect(() => {
    if (!otpSentFirstTime) {
      sentOtpMutation.mutate({
        phoneNumber: phoneNumber,
      });
      setOtpSentFirstTime(true);
    }
  }, [otpSentFirstTime, sentOtpMutation, phoneNumber]);

  const onSubmit: SubmitHandler<Pick<VerifyOtpDto, 'code'>> = (data) => {
    verifyOtpMutation.mutate({
      phoneNumber: phoneNumber,
      code: data.code,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full max-w-xs gap-y-5'
      >
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <InputOTP
              autoFocus
              className='flex w-full justify-center'
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              {...field}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        <div className='flex gap-x-2'>
          <Button
            variant={'link'}
            type='button'
            disabled={sentOtpMutation.isPending || verifyOtpMutation.isPending}
            className='underline p-0 '
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              sentOtpMutation.mutate({
                phoneNumber: phoneNumber,
              });
            }}
          >
            No recibí nada
          </Button>
        </div>
        <Button
          variant={'miExpoPrimary'}
          size={'miExpoDefault'}
          className='w-full mt-3'
          disabled={verifyOtpMutation.isPending || sentOtpMutation.isPending}
          type='submit'
        >
          Continuar registro
        </Button>
        {sentOtpMutation.isSuccess && (
          <p className='mt-2 text-sm font-bold text-green-500'>
            Código enviado
          </p>
        )}
        {verifyOtpMutation.isError && (
          <p className='mt-2 text-sm font-bold text-red-500'>
            {verifyOtpMutation.error.message}
          </p>
        )}
      </form>
    </Form>
  );
}
