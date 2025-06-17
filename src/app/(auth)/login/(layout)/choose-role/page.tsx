'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useActionState, useState } from 'react';
import { chooseRole } from './actions';

export default function ChooseRolePage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [state, formAction, isPending] = useActionState(chooseRole, {});

  return (
    <div className='w-full px-8'>
      <form action={formAction} className='space-y-6'>
        <div className='space-y-3'>
          <RadioGroup
            name='role'
            value={selectedRole}
            onValueChange={setSelectedRole}
            className='grid gap-3'
          >
            <div className='relative'>
              <RadioGroupItem
                value='participant'
                id='participant'
                className='peer sr-only'
              />
              <Label
                htmlFor='participant'
                className={`flex items-center justify-between rounded-lg border-2 bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors ${
                  selectedRole === 'participant'
                    ? 'border-primary'
                    : 'border-muted'
                }`}
              >
                <div className='flex items-center space-x-3'>
                  <div className='w-4 h-4 rounded-full border-2 border-muted-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary relative'>
                    <div
                      className={`w-4 h-4 rounded-full border-2 relative transition-colors ${
                        selectedRole === 'participant'
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {selectedRole === 'participant' && (
                        <div className='absolute inset-1 rounded-full bg-white' />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className='font-medium'>Participant</div>
                    <div className='text-sm text-muted-foreground'>
                      Join as a participant
                    </div>
                  </div>
                </div>
              </Label>
            </div>
            <div className='relative'>
              <RadioGroupItem
                value='producer'
                id='producer'
                className='peer sr-only'
              />
              <Label
                htmlFor='producer'
                className={`flex items-center justify-between rounded-lg border-2 bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors ${
                  selectedRole === 'producer'
                    ? 'border-primary'
                    : 'border-muted'
                }`}
              >
                <div className='flex items-center space-x-3'>
                  <div className='w-4 h-4 rounded-full border-2 border-muted-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary relative'>
                    <div
                      className={`w-4 h-4 rounded-full border-2 relative transition-colors ${
                        selectedRole === 'producer'
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {selectedRole === 'producer' && (
                        <div className='absolute inset-1 rounded-full bg-white' />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className='font-medium'>Producer</div>
                    <div className='text-sm text-muted-foreground'>
                      Create and manage productions
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {selectedRole === 'producer' && (
          <div className='space-y-4 animate-in slide-in-from-top-2 duration-200'>
            <div className='space-y-2'>
              <Label htmlFor='productionName'>Production Name</Label>
              <Input
                name='productionName'
                id='productionName'
                placeholder='Enter production name'
              />
              {state.errors?.productionName && (
                <p className='text-sm text-red-500'>
                  {state.errors.productionName}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='productionDescription'>Description</Label>
              <Input
                name='productionDescription'
                id='productionDescription'
                placeholder='Enter description'
              />
              {state.errors?.productionDescription && (
                <p className='text-sm text-red-500'>
                  {state.errors.productionDescription}
                </p>
              )}
            </div>
          </div>
        )}

        <Button
          type='submit'
          className='w-full'
          disabled={!selectedRole || isPending}
        >
          Continuar Registro
        </Button>
      </form>
    </div>
  );
}
