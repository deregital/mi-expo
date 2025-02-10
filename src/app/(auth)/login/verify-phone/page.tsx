'use client';

import { Input } from '@/components/ui/input';
import { trpc } from '@/server/trpc/client';
import { type SendOtpDto } from 'expo-backend-types';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';

export default function VerifyPhonePage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SendOtpDto>();
  const sendOtpMutation = trpc.otp.send.useMutation({
    onSuccess: () => {
      router.push('/login/verify-phone/otp');
    },
  });
  const onSubmit: SubmitHandler<SendOtpDto> = (data) => {
    sendOtpMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder='Número de teléfono' {...register('phoneNumber')} />
      {sendOtpMutation.isError && (
        <p className='mt-2 text-sm font-bold text-red-500'>
          {sendOtpMutation.error.message}
        </p>
      )}
    </form>
  );
}
