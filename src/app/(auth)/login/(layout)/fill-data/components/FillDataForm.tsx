'use client';

import React, { useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { type FormSchema } from '@/lib/formSchema';
import { SignupFormField, SignupSelectField } from './FormFields';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns/format';
import { type RouterOutput } from '@/server/trpc';
import { trpc } from '@/server/trpc/client';

import { successSubmit } from '../actions';
interface FillDataFormProps {
  data: RouterOutput['profile']['getByPhoneNumber'];
}
//RouterOutput['profile']['getByPhoneNumber']
export function FillDataForm({ data }: FillDataFormProps) {
  const { birthLocation, residenceLocation, ...rest } = data;
  const updateProfile = trpc.me.update.useMutation({
    onSuccess: async () => {
      successSubmit();
    },
  });
  const form = useForm<FormSchema>({
    defaultValues: {
      ...rest,
      birthDate: rest.birthDate
        ? (format(rest.birthDate, 'yyyy-MM-dd') as unknown as Date)
        : null,
      residence: residenceLocation
        ? {
            city: residenceLocation.city,
            state: residenceLocation.state,
            country: residenceLocation.country,
            latitude: residenceLocation.latitude,
            longitude: residenceLocation.longitude,
          }
        : undefined,
      birth: birthLocation
        ? {
            city: birthLocation.city,
            state: birthLocation.state,
            country: birthLocation.country,
            latitude: birthLocation.latitude,
            longitude: birthLocation.longitude,
          }
        : undefined,
    },
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
  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    try {
      // const { password, confirmPassword } = form.getValues();
      // if (password !== confirmPassword) {
      //   form.setError('confirmPassword', {
      //     type: 'manual',
      //     message: 'Las contraseñas no coinciden',
      //   });
      //   return;
      // }

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
        id: rest.id,
        birthDate: birthDateString,
        secondaryPhoneNumber: values.secondaryPhoneNumber || null,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* <input {...form.register('fullName')} type='text' /> */}
        <SignupFormField
          name='fullName'
          label='Nombre Completo'
          placeholder='Nombre Completo'
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
          name='mail'
          label='Email'
          placeholder='Correo electrónico'
          inputType='email'
          formControl={form.control}
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
          label='Número de documento'
          placeholder='12.345.678'
          inputType='number'
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
          name='instagram'
          label='Instagram'
          placeholder='@'
          formControl={form.control}
        />
        <SignupFormField
          name='birthDate'
          label='Fecha de nacimiento'
          placeholder='Fecha de nacimiento'
          inputType='date'
          formControl={form.control}
        />
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
        <Separator className='bg-gray-600 my-8' />
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
        <Button
          className='w-full'
          variant={'miExpoPrimary'}
          size={'miExpoDefault'}
          type='submit'
          disabled={form.formState.isSubmitting}
        >
          Registrate
        </Button>
      </form>
    </Form>
  );
}
