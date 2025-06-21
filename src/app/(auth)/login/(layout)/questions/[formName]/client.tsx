'use client';

import { GoBack } from '@/components/go-back';
import { Button } from '@/components/ui/button';
import { trpc } from '@/server/trpc/client';
import { type SubmitDynamicFormsDto } from 'expo-backend-types';
import { useEffect, useState } from 'react';
import { successSubmitDynamicForm } from './action';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup } from '@radix-ui/react-radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group';
export default function DynamicForm({ name }: { name: string }) {
  const role =
    name === 'participant'
      ? 'participante'
      : name === 'producer'
        ? 'productor/a'
        : 'usuario';

  const [formState, setFormState] = useState<SubmitDynamicFormsDto>();
  const { data: form, isLoading } = trpc.dynamicForm.getByName.useQuery(name);
  const { mutateAsync } = trpc.dynamicForm.submit.useMutation({
    onSuccess: async () => {
      await successSubmitDynamicForm();
    },
  });
  useEffect(() => {
    if (form) {
      const initForm = form.questions.map(
        ({ created_at, updated_at, text, tagGroup, options, ...rest }) => ({
          ...rest,
          answers: [],
        }),
      );
      console.log('INITFORM', initForm);
      setFormState(initForm);
    }
  }, [form]);

  const handleChange = ({
    questionId,
    optionId,
    multipleChoice,
  }: {
    questionId: string;
    optionId: string;
    multipleChoice: boolean;
  }) => {
    setFormState((prev) => {
      if (multipleChoice) {
        return prev?.map((q) => {
          if (q.id === questionId) {
            const alreadySelected = q.answers.includes(optionId);
            const updatedAnswers = alreadySelected
              ? q.answers.filter((a) => a !== optionId)
              : [...q.answers, optionId];
            return {
              ...q,
              answers: updatedAnswers,
            };
          }
          return q;
        });
      } else {
        return prev?.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              answers: [optionId],
            };
          }
          return q;
        });
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(formState);
    if (form && formState) {
      mutateAsync({ param: form.id, input: formState });
    }
  };

  return isLoading || !formState ? (
    <p>Cargando...</p>
  ) : (
    <>
      <GoBack text={`Completá tus datos para ser ${role}`} />
      <form className='h-full' onSubmit={handleSubmit}>
        {form?.questions.map((question, index) => {
          return (
            <div key={index} className='space-y-0 my-4'>
              <Label variant={'miExpoCard'}>{question.text}</Label>
              {question.options.map((option, index) => {
                return (
                  <div
                    key={index}
                    className={clsx(
                      'px-4 py-2 border-x-[1px] border-miExpo-gray flex items-center gap-2 ',
                      {
                        'rounded-tr-lg border-[1px] border-b-0 pt-4':
                          index === 0,
                        'rounded-b-lg border-b-[1px] pb-4':
                          index === question.options.length - 1,
                      },
                    )}
                  >
                    {question.multipleChoice ? (
                      <Checkbox
                        name={question.id}
                        onChange={() =>
                          handleChange({
                            questionId: question.id,
                            optionId: option.id,
                            multipleChoice: question.multipleChoice,
                          })
                        }
                      />
                    ) : (
                      <RadioGroup>
                        <RadioGroupItem
                          value={question.id}
                          onChange={() =>
                            handleChange({
                              questionId: question.id,
                              optionId: option.id,
                              multipleChoice: question.multipleChoice,
                            })
                          }
                        />
                      </RadioGroup>
                    )}
                    {/* <input
                      type={question.multipleChoice ? 'checkbox' : 'radio'}
                      name={question.id}
                      onChange={() =>
                        handleChange({
                          questionId: question.id,
                          optionId: option.id,
                          multipleChoice: question.multipleChoice,
                        })
                      }
                    /> */}
                    <label htmlFor={question.id}>{option.text}</label>
                  </div>
                );
              })}
            </div>
          );
        })}
        <Button
          className='mt-6'
          disabled={isLoading}
          variant={'miExpoPrimary'}
          size={'miExpoDefault'}
        >
          Registrarse en MiExpo
        </Button>
      </form>
    </>
  );
}
