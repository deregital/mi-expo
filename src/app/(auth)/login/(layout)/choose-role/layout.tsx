import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.type !== 'phoneNumber') {
    redirect('/login');
  }

  return <>{children}</>;
}
