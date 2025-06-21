'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useState } from 'react';
import { chooseRole } from './actions';
import { GoBack } from '@/components/go-back';

export default function ChooseRolePage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [state, formAction, isPending] = useActionState(chooseRole, {});

  return (
    <>
      <GoBack text='Elegí tu rol principal' />
      <form className='w-full max-w-xs space-y-8' action={formAction}>
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
              </Label>
              <textarea
                className='flex w-full border-input bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:border-0 file:bg-transparent text-base transition-colors border-[1px] rounded-lg rounded-tl-none border-miExpo-gray px-4 py-2'
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
        {state.errors?.description && (
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
    </>
  );
}
