import { type FormSchema } from '@/lib/formSchema';
import { SignupFormField } from '@/app/(auth)/login/fill-data/components/FormFields';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export function PasswordInputs() {
  const form = useFormContext<FormSchema>();
  const password = useWatch({
    control: form.control,
    name: 'password',
  });

  const confirmPassword = useWatch({
    control: form.control,
    name: 'confirmPassword',
  });

  // Trigger re-validation of confirmPassword when password changes
  useEffect(() => {
    if (confirmPassword === password || !password || !confirmPassword) {
      form.clearErrors('confirmPassword');
      return;
    }

    form.setError('confirmPassword', {
      message: 'Las contraseñas no coinciden',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, confirmPassword]);

  return (
    <>
      <SignupFormField
        name='password'
        label='Contraseña'
        placeholder='Contraseña'
        inputType='password'
        formControl={form.control}
      />
      <SignupFormField
        name='confirmPassword'
        label='Confirmar contraseña'
        placeholder='Confirmar contraseña'
        inputType='password'
        formControl={form.control}
      />
    </>
  );
}
