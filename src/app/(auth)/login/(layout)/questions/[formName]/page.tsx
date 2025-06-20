import DynamicForm from './client';

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ formName: string }>;
}) {
  const { formName } = await params;

  // return <DynamicForm name={formName} />;
  return <DynamicForm name={formName} />;
}
