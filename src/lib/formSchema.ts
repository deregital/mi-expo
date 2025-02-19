import { locationSchema, profileSchema } from 'expo-backend-types/schema';
import { type z } from 'zod';

export const formSchema = profileSchema
  .partial({
    secondaryPhoneNumber: true,
  })
  .pick({
    username: true,
    fullName: true,
    instagram: true,
    phoneNumber: true,
    secondaryPhoneNumber: true,
    mail: true,
    dni: true,
    birthDate: true,
    gender: true,
    password: true,
  })
  .extend({
    confirmPassword: profileSchema.shape.password.optional(),
    residence: locationSchema.pick({
      city: true,
      country: true,
      latitude: true,
      longitude: true,
      state: true,
    }),
    birth: locationSchema.pick({
      city: true,
      country: true,
      latitude: true,
      longitude: true,
      state: true,
    }),
  });

export type FormSchema = z.infer<typeof formSchema>;
