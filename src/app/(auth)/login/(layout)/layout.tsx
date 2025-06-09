import { Separator } from '@/components/ui/separator';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-[100dvh] w-full flex flex-col items-center justify-center'>
      <h1 className='text-4xl font-semibold my-2'>MiExpo</h1>
      <Separator className='bg-black' />
      {children}
    </div>
  );
}
