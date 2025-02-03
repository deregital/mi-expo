import { LoginClient } from '@/app/login/client';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return <LoginClient />;
}
