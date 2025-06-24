'use client';

import { GoBack } from '@/components/go-back';
import { Button } from '@/components/ui/button';
import { trpc } from '@/server/trpc/client';
import { type SubmitDynamicFormsDto } from 'expo-backend-types';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup } from '@radix-ui/react-radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { successSubmitDynamicForm } from './action';
export default function DynamicForm({ name }: { name: string }) {
  const role =
    name === 'participant'
      ? 'participante'
      : name === 'producer'
        ? 'productor/a'
        : 'usuario';

  const [formState, setFormState] = useState<SubmitDynamicFormsDto>();
  const [errors, setErrors] = useState('');
  const { data: form, isLoading } = trpc.dynamicForm.getByName.useQuery(name);
  const { mutateAsync } = trpc.dynamicForm.submit.useMutation({
    onError(error) {
      setErrors(error.message);
    },
    onSuccess: async () => {
      await successSubmitDynamicForm();
    },
  });
  useEffect(() => {
    if (form) {
      const initForm = form.questions.map(
        ({ created_at, updated_at, tagGroup, options, ...rest }) => ({
          ...rest,
          answers: [],
        }),
      );
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
    if (form && formState) {
      mutateAsync({ param: form.id, input: formState });
    }
  };

  return isLoading || !formState ? (
    <></>
  ) : (
    <>
      <GoBack text={`Completá tus datos para ser ${role}`} />
      <div className='w-full h-full flex gap-32 items-center justify-center'>
        <form className='w-full h-full max-w-md' onSubmit={handleSubmit}>
          {form?.questions.map((question, index) => {
            if (question.disabled) return;

            return (
              <div key={index} className='space-y-0 my-4'>
                <Label variant={'miExpoCard'}>
                  {question.text}
                  {question.required && (
                    <span className='text-red-600 font-bold'>*</span>
                  )}
                </Label>
                {question.multipleChoice ? (
                  question.options.map((option, index) => {
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
                        <Checkbox
                          className='transition-colors'
                          name={option.id}
                          onClick={() =>
                            handleChange({
                              questionId: question.id,
                              optionId: option.id,
                              multipleChoice: question.multipleChoice,
                            })
                          }
                        />

                        <label htmlFor={option.id}>{option.text}</label>
                      </div>
                    );
                  })
                ) : (
                  <RadioGroup>
                    {question.options.map((option, index) => {
                      return (
                        <div
                          key={index}
                          className={clsx(
                            'px-4 py-2 border-x-[1px] border-miExpo-gray flex items-center gap-2',
                            {
                              'rounded-tr-lg border-[1px] border-b-0 pt-4':
                                index === 0,
                              'rounded-b-lg border-b-[1px] pb-4':
                                index === question.options.length - 1,
                            },
                          )}
                        >
                          <RadioGroupItem
                            value={option.id}
                            onClick={() =>
                              handleChange({
                                questionId: question.id,
                                optionId: option.id,
                                multipleChoice: question.multipleChoice,
                              })
                            }
                          />

                          <label htmlFor={option.id}>{option.text}</label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}
              </div>
            );
          })}
          {errors && <p className='font-bold text-red-600'>{errors}</p>}
          <Button
            className='w-full mt-6'
            disabled={isLoading}
            variant={'miExpoPrimary'}
            size={'miExpoDefault'}
          >
            Registrarse en MiExpo
          </Button>
        </form>
        <Image
          className='hidden lg:block'
          alt=''
          src={
            name === 'producer'
              ? '/login/form-dynamic-producer.png'
              : '/login/form-dynamic-participant.png'
          }
          width={500}
          height={500}
        />
      </div>
    </>
  );
}
