import { FillDataForm } from '@/app/(auth)/login/(layout)/fill-data/components/FillDataForm';
import { auth } from '@/server/auth';
import { trpc } from '@/server/trpc/server';
import { redirect } from 'next/navigation';

export default async function FillDataPage() {
  const user = await auth();

  if (!user?.user?.id) {
    redirect('/login');
  }

  const profileData = await trpc.me.get();

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
