import { FillDataForm } from '@/app/(auth)/login/fill-data/components/fill-data-form';
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

  return (
    <div className='h-[80%] overflow-y-auto w-full px-2'>
      <FillDataForm data={profileData} />
    </div>
  );
}
