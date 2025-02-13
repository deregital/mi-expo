'use client';

import { Input } from '@/components/ui/input';
import { type ProfileDto, type VerifyOtpResponseDto } from 'expo-backend-types';
import {
  type Control,
  type FieldPath,
  useForm,
  type Validate,
} from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React, { useEffect } from 'react';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';

interface FillDataFormProps {
  data: VerifyOtpResponseDto['profile'];
}

type FormSchema = Omit<
  ProfileDto,
  'firstName' | 'isInTrash' | 'movedToTrashDate' | 'created_at' | 'updated_at'
> & {
  confirmPassword: string;
};

export function FillDataForm({ data }: FillDataFormProps) {
  const form = useForm<FormSchema>({
    defaultValues: data,
    mode: 'all',
  });
  const { handleSubmit, watch } = form;
  const password = watch('password');

  const validatePasswords: NonNullable<SignupFormFieldProps['validate']> = (
    value,
    formValues,
  ) => {
    if (value !== formValues.password) {
      return 'Las contraseñas no coinciden';
    }
    return true;
  };

  useEffect(() => {
    if (password) {
      form.trigger('confirmPassword');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(() => {})}>
        <SignupFormField
          name='username'
          label='Nombre de usuario'
          placeholder='Nombre de usuario'
          inputType='text'
          formControl={form.control}
        />
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
          validate={validatePasswords}
          formControl={form.control}
        />
        <SignupFormField
          name='mail'
          label='Email'
          placeholder='Correo electrónico'
          inputType='email'
          formControl={form.control}
        />
        <SignupFormField
          name='phoneNumber'
          label='Teléfono'
          placeholder='Teléfono'
          inputType='tel'
          formControl={form.control}
        />
        <SignupFormField
          name='secondaryPhoneNumber'
          label='Teléfono secundario'
          placeholder='Teléfono secundario'
          inputType='tel'
          formControl={form.control}
        />
        <SignupFormField
          name='fullName'
          label='Nombre Completo'
          placeholder='Nombre Completo'
          formControl={form.control}
        />
        <SignupSelectField
          name='gender'
          label='Género'
          placeholder='Género'
          formControl={form.control}
          items={[
            {
              label: 'Masculino',
              value: 'Masculino',
            },
            {
              label: 'Femenino',
              value: 'Femenino',
            },
            {
              label: 'Otro',
              value: 'Otro',
            },
          ]}
        />
        <SignupFormField
          name='birthDate'
          label='Fecha de nacimiento'
          placeholder='Fecha de nacimiento'
          inputType='date'
          formControl={form.control}
        />
        <SignupFormField
          name='dni'
          label='DNI'
          placeholder='DNI'
          formControl={form.control}
        />
        {/* apodos (?) */}
        {/* nacimiento y residencia */}
      </form>
    </Form>
  );
}

interface SignupFormFieldProps {
  name: FieldPath<FormSchema>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formControl: Control<FormSchema, any>;
  validate?: Validate<
    string | number | boolean | Date | string[] | null,
    FormSchema
  >;
}

function SignupFormField({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
  validate,
}: SignupFormFieldProps) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field: { value, ...rest } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={inputType || 'text'}
              value={value?.toString() || ''}
              {...rest}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
      rules={{
        validate: validate,
      }}
    />
  );
}

interface SignupSelectFieldProps {
  name: FieldPath<FormSchema>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formControl: Control<FormSchema, any>;
  items: Array<{
    value: string;
    label: string;
  }>;
}

function SignupSelectField({
  formControl,
  label,
  name,
  placeholder,
  description,
  items,
}: SignupSelectFieldProps) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value?.toString() || ''}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
