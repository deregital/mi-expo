'use client';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import {} from 'next/navigation';
import { useRouter } from 'next/navigation';

export function GoBack({
  text,
  redirect,
}: {
  text: string;
  redirect?: string;
}) {
  const router = useRouter();

  return (
    <div className='flex gap-4 items-center p-6 w-full'>
      <Button
        size={'icon'}
        variant={'outline'}
        className='bg-white border-[1px] border-black p-4'
        onClick={() => {
          if (redirect) {
            router.replace(redirect);
          } else {
            router.back();
          }
        }}
      >
        <ArrowLeft />
      </Button>
      <p className='w-full font-medium'>{text}</p>
    </div>
  );
}
