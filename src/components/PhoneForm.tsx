'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/server/trpc/client';
import { type SendOtpDto } from 'expo-backend-types';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';

export function VerifyPhoneForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SendOtpDto>();
  const sendOtpMutation = trpc.otp.send.useMutation({
    onSuccess: ({ hasVerified, hasUsername, success, ...rest }) => {
      if ('message' in rest) {
        throw new Error(rest.message);
      } else if (!hasVerified) {
        router.push('/login/verify-phone/otp');
      }
    },
  });
  const onSubmit: SubmitHandler<SendOtpDto> = (data) => {
    sendOtpMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder='Número de teléfono' {...register('phoneNumber')} />
      <Button
        type='submit'
        disabled={sendOtpMutation.isPending}
        className='w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600'
      >
        Enviar código
      </Button>
      {sendOtpMutation.isError && (
        <p className='mt-2 text-sm font-bold text-red-500'>
          {sendOtpMutation.error.message}
        </p>
      )}
    </form>
  );
}
