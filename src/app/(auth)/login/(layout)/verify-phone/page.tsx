import { cookies } from 'next/headers';
import { VerifyPhoneOtpClient } from './client';
import { type RouterOutput } from '@/server/trpc';
import { redirect } from 'next/navigation';
import { trpc } from '@/server/trpc/server';

export default async function VerifyPhonePage() {
  const profileDataString = (await cookies()).get('profileData')?.value;
  if (!profileDataString) {
    redirect('/login');
  }
  const profileData = JSON.parse(
    profileDataString ?? '',
  ) as RouterOutput['profile']['getByPhoneNumber'];

  if (!profileData.phoneNumber) {
    redirect('/login');
  }

  await trpc.otp.send({
    phoneNumber: profileData.phoneNumber,
  });

  return <VerifyPhoneOtpClient phoneNumber={profileData.phoneNumber} />;
}
