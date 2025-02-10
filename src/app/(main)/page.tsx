import { InstallPWAButton } from '@/components/common/install-pwa-button';
import { auth, signIn, signOut } from '@/server/auth';
import Image from 'next/image';

export default async function Home() {
  const session = await auth();

  return (
    <div className='flex items-center justify-center flex-col h-full'>
      <h1 className='text-7xl'>Mi expo</h1>
      <p>Hola Ricky Fort</p>
      <Image
        alt='Alt'
        src='https://media.ambito.com/p/fa02077a75256f92036786bea42ad093/adjuntos/239/imagenes/039/765/0039765942/ricardo-fortjpg.jpg'
        width={500}
        height={500}
      />
      <InstallPWAButton />
      {session ? (
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button type='submit'>Logout</button>
        </form>
      ) : (
        <form
          action={async () => {
            'use server';
            await signIn();
          }}
        >
          <button type='submit'>Login</button>
        </form>
      )}
    </div>
  );
}
