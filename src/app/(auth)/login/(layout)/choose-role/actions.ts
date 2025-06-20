'use server';
import { trpc } from '@/server/trpc/server';
import {
  createProductionSchema,
  type CreateProductionDto,
} from 'expo-backend-types';
import { redirect } from 'next/navigation';

export type ChooseRoleActionState = {
  role?: string;
  productionName?: string;
  productionDescription?: string;
  errors?: {
    role?: string[];
    productionName?: string[];
    productionDescription?: string[];
  };
};

export async function chooseRole(
  prevState: ChooseRoleActionState,
  formData: FormData,
): Promise<ChooseRoleActionState> {
  const me = await trpc.me.get();
  const role = formData.get('role') as string;
  const rawData: CreateProductionDto = {
    administratorId: me?.id ?? '',
    name: formData.get('productionName') as string,
    description: formData.get('productionDescription') as string,
  };

  if (role === 'participant') {
    redirect('/login/questions/participant');
  } else if (role === 'producer') {
    const validatedData = createProductionSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        ...rawData,
        errors: {
          productionName: validatedData.error.flatten().fieldErrors.name,
          productionDescription:
            validatedData.error.flatten().fieldErrors.description,
        },
      };
    }

    await trpc.production.create(validatedData.data);
    redirect('/login/questions/producer');
  }

  return { role, ...rawData };
}
