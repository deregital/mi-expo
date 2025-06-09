'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import React, { useEffect, useMemo } from 'react';

import { trpc } from '@/server/trpc/client';
import type { GetMiExpoMeResponseDto } from 'expo-backend-types';
import { FormFieldRow } from '@/app/(auth)/login/(layout)/fill-data/components/FormFieldRow';
import {
  SignupFormField,
  SignupSelectField,
} from '@/app/(auth)/login/(layout)/fill-data/components/FormFields';
import { PasswordInputs } from '@/app/(auth)/login/(layout)/fill-data/components/PasswordInputs';
import { Button } from '@/components/ui/button';
import { formSchema, type FormSchema } from '@/lib/formSchema';
import { signInUsernmePassword } from '@/app/(auth)/login/(layout)/fill-data/actions';
import { format } from 'date-fns/format';

interface FillDataFormProps {
  data: GetMiExpoMeResponseDto;
}

export function FillDataForm({ data }: FillDataFormProps) {
  const { birthLocation: birth, residenceLocation: residence, ...rest } = data;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...rest,
      secondaryPhoneNumber: rest.secondaryPhoneNumber ?? undefined,
      birthDate: rest.birthDate
        ? (format(rest.birthDate, 'yyyy-MM-dd') as unknown as Date)
        : null,
      residence: residence
        ? {
            city: residence.city,
            state: residence.state,
            country: residence.country,
            latitude: residence.latitude,
            longitude: residence.longitude,
          }
        : undefined,
      birth: birth
        ? {
            city: birth.city,
            state: birth.state,
            country: birth.country,
            latitude: birth.latitude,
            longitude: birth.longitude,
          }
        : undefined,
    },
    context: formSchema,
    reValidateMode: 'onChange',
    mode: 'onChange',
  });
  const birthCountry = useWatch({
    control: form.control,
    name: 'birth.country',
  });
  const residenceState = useWatch({
    control: form.control,
    name: 'residence.state',
  });

  const { data: countriesData, isLoading: isLoadingCountries } =
    trpc.location.getCountries.useQuery();
  const { data: argStatesData, isLoading: isLoadingArgStates } =
    trpc.location.getArgStates.useQuery();
  const { data: citiesData, isLoading: isLoadingCities } =
    trpc.location.getCitiesByArgState.useQuery(residenceState, {
      enabled: !!residenceState,
    });

  const birthCountryCode = useMemo(() => {
    if (!birthCountry) {
      return null;
    }

    return countriesData?.find((country) => country.name === birthCountry)
      ?.isoCode;
  }, [birthCountry, countriesData]);

  useEffect(() => {
    if (data.birthLocation?.latitude) {
      form.setValue('birth.latitude', data.birthLocation.latitude);
      form.setValue('birth.longitude', data.birthLocation.longitude);
      form.setValue('birth.city', data.birthLocation.city);
      form.setValue('birth.country', data.birthLocation.country);
    }
    if (data.residenceLocation?.latitude) {
      form.setValue('residence.latitude', data.residenceLocation.latitude);
      form.setValue('residence.longitude', data.residenceLocation.longitude);
      form.setValue('residence.city', data.residenceLocation.city);
      form.setValue('residence.state', data.residenceLocation.state);
      form.setValue('residence.country', data.residenceLocation.country);
    }
  }, [data, form]);

  const { data: statesData, isLoading: isLoadingStates } =
    trpc.location.getStateByCountry.useQuery(birthCountryCode ?? '', {
      enabled: !!birthCountryCode,
    });
  const updateProfile = trpc.me.update.useMutation({
    onSettled: async () => {
      await signInUsernmePassword({
        username: form.getValues('username')!,
        password: form.getValues('password')!,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        className='space-y-2'
        onSubmit={form.handleSubmit(() => {
          const { password, confirmPassword } = form.getValues();
          if (password !== confirmPassword) {
            form.setError('confirmPassword', {
              type: 'manual',
              message: 'Las contraseñas no coinciden',
            });
            return;
          }

          const { birthDate, ...values } = form.getValues();
          let birthDateString: string | null = null;
          if (birthDate instanceof Date) {
            birthDateString = birthDate?.toISOString() ?? null;
          } else {
            birthDateString = new Date(
              birthDate as unknown as string,
            ).toISOString();
          }

          updateProfile.mutate({
            ...values,
            birthDate: birthDateString,
            secondaryPhoneNumber: values.secondaryPhoneNumber || null,
          });
        })}
      >
        <SignupFormField
          name='username'
          label='Nombre de usuario'
          placeholder='Nombre de usuario'
          inputType='text'
          formControl={form.control}
        />

        <FormFieldRow>
          <PasswordInputs />
        </FormFieldRow>

        <FormFieldRow>
          <SignupFormField
            name='fullName'
            label='Nombre Completo'
            placeholder='Nombre Completo'
            formControl={form.control}
          />
          <SignupFormField
            name='instagram'
            label='Instagram'
            placeholder='@camilita12'
            formControl={form.control}
          />
        </FormFieldRow>
        <FormFieldRow>
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
        </FormFieldRow>
        <FormFieldRow>
          <SignupFormField
            name='mail'
            label='Email'
            placeholder='Correo electrónico'
            inputType='email'
            formControl={form.control}
          />

          <SignupFormField
            name='dni'
            label='DNI'
            placeholder='DNI'
            inputType='number'
            formControl={form.control}
          />
        </FormFieldRow>
        <FormFieldRow>
          <SignupSelectField
            name='gender'
            label='Género'
            placeholder='Género'
            formControl={form.control}
            items={[
              {
                label: 'Masculino',
                value: 'Masculino',
                id: 'Masculino',
              },
              {
                label: 'Femenino',
                value: 'Femenino',
                id: 'Femenino',
              },
              {
                label: 'Otro',
                value: 'Otro',
                id: 'Otro',
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
        </FormFieldRow>
        <FormFieldRow>
          <SignupSelectField
            disabled={isLoadingCountries}
            name='birth.country'
            label='País de nacimiento'
            placeholder='País de nacimiento'
            formControl={form.control}
            items={
              countriesData?.map((country) => ({
                label: country.name,
                value: country.name,
                id: country.isoCode,
              })) || []
            }
            onChange={(value) => {
              const selectedCountry = countriesData?.find(
                (country) => country.name === value,
              );

              if (!selectedCountry) {
                return;
              }
              form.setValue('birth.country', selectedCountry.name);
              form.setValue('birth.city', '');
            }}
          />
          <SignupSelectField
            disabled={isLoadingStates || !birthCountry}
            name='birth.city'
            label='Ciudad de nacimiento'
            placeholder='Ciudad de nacimiento'
            formControl={form.control}
            items={
              statesData?.map((state) => ({
                label: state.name,
                value: state.name,
                id: state.isoCode,
              })) || []
            }
            onChange={(value) => {
              const selectedCity = statesData?.find(
                (state) => state.name === value,
              );
              if (
                !selectedCity ||
                !selectedCity.latitude ||
                !selectedCity.longitude
              ) {
                console.error('Invalid state data', selectedCity);
                return;
              }
              const numberLat = Number(selectedCity.latitude);
              const numberLong = Number(selectedCity.longitude);

              form.setValue('birth.city', selectedCity.name);
              form.setValue('birth.state', '');
              form.setValue('birth.latitude', numberLat);
              form.setValue('birth.longitude', numberLong);
            }}
          />
        </FormFieldRow>
        <FormFieldRow>
          <SignupSelectField
            disabled={isLoadingArgStates}
            name='residence.state'
            label='Provincia de residencia'
            placeholder='Provincia de residencia'
            formControl={form.control}
            items={
              argStatesData?.map((argState) => ({
                label: argState,
                value: argState,
                id: argState,
              })) || []
            }
            onChange={(value) => {
              form.setValue('residence.country', 'Argentina');
              form.setValue('residence.state', value);
              form.setValue('residence.city', '');
            }}
          />
          <SignupSelectField
            disabled={isLoadingCities || !residenceState}
            name='residence.city'
            label='Ciudad de residencia'
            placeholder='Ciudad de residencia'
            formControl={form.control}
            items={
              citiesData?.map((city) => ({
                label: city.name,
                value: city.name,
                id: city.id,
              })) || []
            }
            onChange={(value) => {
              const selectedCity = citiesData?.find(
                (city) => city.name === value,
              );
              if (
                !selectedCity ||
                !selectedCity.centroid.lat ||
                !selectedCity.centroid.lon
              ) {
                console.error('Invalid state data', selectedCity);
                return;
              }
              const numberLat = Number(selectedCity.centroid.lat);
              const numberLong = Number(selectedCity.centroid.lon);
              form.setValue('residence.city', selectedCity.name);
              form.setValue('residence.latitude', numberLat);
              form.setValue('residence.longitude', numberLong);
            }}
          />
        </FormFieldRow>
        <Button
          type='submit'
          disabled={
            form.formState.isSubmitting ||
            Object.keys(form.formState.errors).length > 0
          }
        >
          Guardar
        </Button>
      </form>
    </Form>
  );
}
