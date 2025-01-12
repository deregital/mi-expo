import { InstallPWAButton } from '@/components/common/install-pwa-button';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='flex items-center justify-center flex-col h-full'>
      <h1 className='text-7xl'>Mi expo</h1>
      <Image
        alt='Alt'
        src='https://media.ambito.com/p/fa02077a75256f92036786bea42ad093/adjuntos/239/imagenes/039/765/0039765942/ricardo-fortjpg.jpg'
        width={500}
        height={500}
      />
      <InstallPWAButton />
    </div>
  );
}
