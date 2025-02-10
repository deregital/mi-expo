import { type VerifyOtpResponseDto } from 'expo-backend-types';
import { cookies } from 'next/headers';

export default async function FillDataPage() {
  const cookiesStore = await cookies();
  const profileDataRaw = cookiesStore.get('profileData');
  if (!profileDataRaw) {
    return <></>;
  }

  const profileData = JSON.parse(
    profileDataRaw.value,
  ) as VerifyOtpResponseDto['profile'];

  return <pre>{JSON.stringify(profileData, null, 2)}</pre>;
}
