'use client';

import { trpc } from '@/server/trpc/client';
import { useSearchParams } from 'next/navigation';

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const { data, isLoading } =
    trpc.dynamicForm.getByName.useQuery('participant');
  console.log(data);

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div>
      <p>Preguntas, {role}</p>
      <form>
        {data ? (
          data?.questions.map((question, index) => {
            return (
              <div key={index}>
                <p>{question.text}</p>
                {question.options.map((option, index) => {
                  return (
                    <ul key={index}>
                      <li> - {option.text}</li>
                    </ul>
                  );
                })}
              </div>
            );
          })
        ) : (
          <p>loadign</p>
        )}
      </form>
    </div>
  );
}
