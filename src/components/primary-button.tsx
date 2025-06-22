import { Button } from './ui/button';

export function PrimaryButton({ title }: { title: string }) {
  return (
    <Button className='bg-miExpo-purple text-white text-xl h-12 min-w-72'>
      {title}
    </Button>
  );
}
