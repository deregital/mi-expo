'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useState } from 'react';
import { chooseRole } from './actions';
import { GoBack } from '@/components/go-back';
import Image from 'next/image';
import { RadioGroup } from '@/components/ui/radio-group';
import { trpc } from '@/server/trpc/client';
import clsx from 'clsx';
import { Checkbox } from '@/components/ui/checkbox';

export default function ChooseRolePage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [state, formAction, isPending] = useActionState(chooseRole, {});
  const { data } = trpc.role.getAll.useQuery();

  return (
    <>
      <GoBack text='Elegí tu rol principal' />
      <div className='flex items-center gap-32 justify-center h-full'>
        <form
          className='w-full max-w-xs lg:max-w-sm space-y-8'
          action={formAction}
        >
          <input type='hidden' name='role' value={selectedRole} />
          <article
            onClick={() => setSelectedRole('participant')}
            className={`flex flex-col items-center justify-between rounded-xl border-[1px] p-4 cursor-pointer transition-colors text-white border-miExpo-gray ${
              selectedRole === 'participant'
                ? 'bg-miExpo-dark-cranberry'
                : 'bg-miExpo-cranberry'
            }`}
          >
            <p className='text-2xl mb-2'>Participante</p>
            <p className='text-sm'>
              Los participantes son una parte esencial de los proyectos. Son
              quienes tienen un rol activo en lo que pasa en el show.
            </p>
          </article>
          {data && selectedRole === 'participant' && (
            <div className='space-y-8 animate-in slide-in-from-top-2 duration-200'>
              <div className='space-y-0'>
                <Label variant={'miExpoCard'} htmlFor='name'>
                  Selecciona tu/s rol/es
                  <span className='text-red-600 font-bold'>*</span>
                </Label>
                <RadioGroup name='roles' className='gap-0'>
                  {data.map((role, index) => {
                    return (
                      <div
                        key={index}
                        className={clsx(
                          'px-4 py-2 border-x-[1px] border-miExpo-gray flex items-center gap-2 ',
                          {
                            'rounded-tr-lg border-[1px] border-b-0 pt-4':
                              index === 0,
                            'rounded-b-lg border-b-[1px] pb-4':
                              index === data.length - 1,
                          },
                        )}
                      >
                        <Checkbox
                          className='transition-colors'
                          name='roles[]'
                          value={role.id}
                          id={role.id}
                        />

                        <label htmlFor={role.id}>{role.name}</label>
                      </div>
                    );
                  })}
                </RadioGroup>
                {state.errors?.roles && (
                  <p className='text-sm font-bold text-red-500'>
                    {state.errors.roles}
                  </p>
                )}
              </div>
            </div>
          )}

          <article
            onClick={() => setSelectedRole('producer')}
            className={`flex flex-col items-center justify-between rounded-xl border-[1px] p-4 cursor-pointer transition-colors text-white border-miExpo-gray ${
              selectedRole === 'producer'
                ? 'bg-miExpo-dark-grape'
                : 'bg-miExpo-grape'
            }`}
          >
            <p className='text-2xl mb-2'>Productor/a</p>
            <p className='text-sm'>
              Los productores son la otra parte de los proyectos. Son quienes
              organizan y gestionan todo lo que se ve en el show.
            </p>
          </article>

          {selectedRole === 'producer' && (
            <div className='space-y-8 animate-in slide-in-from-top-2 duration-200'>
              <div className='space-y-0'>
                <Label variant={'miExpoCard'} htmlFor='name'>
                  Nombre de la producción
                  <span className='text-red-600 font-bold'>*</span>
                </Label>
                <Input
                  variant={'MiExpoCard'}
                  name='name'
                  id='name'
                  placeholder='Ingresá el nombre de la producción'
                />
                {state.errors?.name && (
                  <p className='text-sm font-bold text-red-500'>
                    {state.errors.name}
                  </p>
                )}
              </div>
              <div className='space-y-0'>
                <Label variant={'miExpoCard'} htmlFor='description'>
                  Descripción de la producción
                  <span className='text-red-600 font-bold'>*</span>
                </Label>
                <textarea
                  className='min-h-20 max-h-48 flex w-full border-input bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:border-0 file:bg-transparent text-base transition-colors border-[1px] rounded-lg rounded-tl-none border-miExpo-gray px-4 py-2'
                  name='description'
                  id='description'
                  placeholder='Ingresá toda la información sobre tu producción'
                />
                {state.errors?.description && (
                  <p className='text-sm font-bold text-red-500'>
                    {state.errors.description}
                  </p>
                )}
              </div>
            </div>
          )}
          {state.errors?.general && (
            <p className='text-sm font-bold text-red-500'>
              {state.errors.general}
            </p>
          )}
          <Button
            variant={'miExpoPrimary'}
            size={'miExpoDefault'}
            type='submit'
            className='w-full'
            disabled={!selectedRole || isPending}
          >
            Continuar registro
          </Button>
        </form>
        <Image
          className='hidden lg:block'
          alt=''
          src='/login/choose-role.png'
          width={500}
          height={500}
        />
      </div>
    </>
  );
}
