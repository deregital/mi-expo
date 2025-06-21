'use server';
import { trpc } from '@/server/trpc/server';
import {
  createProductionSchema,
  type CreateProductionDto,
} from 'expo-backend-types';
import { redirect } from 'next/navigation';

export type ChooseRoleActionState = {
  role?: string;
  name?: string;
  description?: string;
  errors?: {
    role?: string[];
    name?: string[];
    description?: string[];
    general?: string;
  };
};

export async function chooseRole(
  prevState: ChooseRoleActionState,
  formData: FormData,
): Promise<ChooseRoleActionState> {
  const me = await trpc.me.get();
  const role = formData.get('role') as string;

  if (!me) {
    return {
      ...prevState,
      errors: {
        general:
          'No se pudo encontrar el perfil, vuelva la verificar el telefono',
      },
    };
  }

  const rawData: CreateProductionDto = {
    administratorId: me?.id ?? '',
    name: formData.get('name') as string,
    description: formData.get('description') as string,
  };

  if (role === 'participant') {
    redirect('/login/questions/participant');
  } else if (role === 'producer') {
    const validatedData = createProductionSchema.safeParse(rawData);

    console.log(validatedData);
    if (!validatedData.success) {
      return {
        ...rawData,
        errors: {
          name: validatedData.error.flatten().fieldErrors.name,
          description: validatedData.error.flatten().fieldErrors.description,
        },
      };
    }

    await trpc.production.create(validatedData.data);
    redirect('/login/questions/producer');
  }

  return { role, ...rawData };
}
