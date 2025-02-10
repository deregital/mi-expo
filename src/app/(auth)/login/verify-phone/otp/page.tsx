import { VerifyPhoneOtpClient } from '@/app/(auth)/login/verify-phone/otp/client';

import { cookies } from 'next/headers';

export default async function VerifyPhoneOtpPage() {
  const cookieStore = await cookies();
  const phoneNumber = cookieStore.get('phoneNumber');

  if (!phoneNumber?.value) {
    throw new Error('Phone number not found');
  }

  return <VerifyPhoneOtpClient phoneNumber={phoneNumber.value} />;
}
