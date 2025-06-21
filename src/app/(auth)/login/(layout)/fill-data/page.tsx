import { trpc } from '@/server/trpc/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { FillDataForm } from './components/FillDataForm';
import { type RouterOutput } from '@/server/trpc';
import { GoBack } from '@/components/go-back';
import Image from 'next/image';

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
    <div className='w-full px-2'>
      <GoBack text='Completá tus datos para registrarte' />
      <div className='h-full flex gap-16 lg:mx-24'>
        <FillDataForm data={profileData} />
        <div className='hidden h-full lg:flex flex-col items-center justify-evenly w-1/2'>
          <Image
            className='hidden lg:block'
            alt=''
            src='/login/form-fill-data-1.png'
            width={400}
            height={400}
          />
          <Image
            className='hidden lg:block'
            alt=''
            src='/login/form-fill-data-2.png'
            width={400}
            height={400}
          />
          <Image
            className='hidden lg:block'
            alt=''
            src='/login/form-fill-data-3.png'
            width={400}
            height={400}
          />
          <Image
            className='hidden lg:block'
            alt=''
            src='/login/form-fill-data-4.png'
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}
