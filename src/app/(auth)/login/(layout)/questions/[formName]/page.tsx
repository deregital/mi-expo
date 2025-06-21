import { auth } from '@/server/auth';
import DynamicForm from './client';
import { redirect } from 'next/navigation';

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ formName: string }>;
}) {
  const { formName } = await params;

  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  return <DynamicForm name={formName} />;
}
