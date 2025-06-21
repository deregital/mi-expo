import { trpc } from '@/server/trpc/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { FillDataForm } from './components/FillDataForm';
import { type RouterOutput } from '@/server/trpc';
import { GoBack } from '@/components/go-back';

export default async function FillDataPage() {
  const profileDataString = (await cookies()).get('profileData')?.value;

  if (!profileDataString) {
    redirect('/login');
  }

  const profileData = JSON.parse(
    profileDataString ?? '',
  ) as RouterOutput['profile']['getByPhoneNumber'];

  if (!profileData) {
    redirect('/login');
  }

  await trpc.location.getCountries.prefetch();
  await trpc.location.getArgStates.prefetch();

  return (
    <div className='h-[80%] w-full px-2'>
      <GoBack text='Completá tus datos para registrarte' />
      <FillDataForm data={profileData} />
    </div>
  );
}
