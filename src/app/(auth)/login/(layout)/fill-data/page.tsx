import { trpc } from '@/server/trpc/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { FillDataForm } from './components/FillDataForm';
import { type RouterOutput } from '@/server/trpc';

export default async function FillDataPage() {
  const profileDataString = (await cookies()).get('profileData')?.value;
  const profileData = JSON.parse(
    profileDataString ?? '',
  ) as RouterOutput['profile']['getByPhoneNumber'];

  if (!profileData) {
    redirect('/login');
  }

  await trpc.location.getCountries.prefetch();
  await trpc.location.getArgStates.prefetch();

  return (
    <div className='h-[80%] overflow-y-auto w-full px-2'>
      <FillDataForm data={profileData} />
    </div>
  );
}
