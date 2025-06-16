import { cookies } from 'next/headers';
import { VerifyPhoneOtpClient } from './client';
import { type RouterOutput } from '@/server/trpc';

export default async function VerifyPhonePage() {
  const profileDataString = (await cookies()).get('profileData')?.value;
  const profileData = JSON.parse(
    profileDataString ?? '',
  ) as RouterOutput['profile']['getByPhoneNumber'];

  if (!profileData.phoneNumber) {
    throw new Error('Phone number not found');
  }

  return <VerifyPhoneOtpClient phoneNumber={profileData.phoneNumber} />;
}
