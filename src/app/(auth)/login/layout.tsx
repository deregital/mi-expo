import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log(session?.type);
  if (session?.type === 'usernamePassword') {
    redirect('/');
  }

  return (
    <div className='h-[100dvh] w-full flex justify-center'>{children}</div>
  );
}
