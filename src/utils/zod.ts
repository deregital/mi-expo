import { useMemo } from 'react';
import { type ZodAny, type ZodSchema } from 'zod';

const TEMPORARY_REPLACEMENT_PLACEHOLDER = '__PLACEHOLDER__';
const ZOD_OBJECT_FIELD_PATH = '.shape.';
const ZOD_ARRAY_FIELD_PATH = '._def.type';

function get(obj: object, path: string, def: string): unknown {
  const fullPath: string[] = path
    .replace(/\[/g, '.')
    .replace(/]/g, '')
    .split('.')
    .filter(Boolean);

  return fullPath.every(everyFunc) ? obj : def;

  function everyFunc(step: string): boolean {
    if (typeof obj === 'object' && obj !== null && step in obj) {
      obj = obj[step as keyof typeof obj];
      return true;
    }
    return false;
  }
}
export const generateZodFieldPath = (fieldName: string) => {
  return fieldName
    .replaceAll(/\.\d+/g, TEMPORARY_REPLACEMENT_PLACEHOLDER)
    .replaceAll(/\./g, ZOD_OBJECT_FIELD_PATH)
    .replaceAll(
      new RegExp(TEMPORARY_REPLACEMENT_PLACEHOLDER, 'g'),
      ZOD_ARRAY_FIELD_PATH,
    );
};

const handleNotFoundField = (fieldName: string) => {
  throw new Error(
    `Field ${fieldName} not found in schema. Make sure the field exists in the schema or do not 
    pass the schema inside the Form - in this case you could manually set the required property for FormLabel.`,
  );
};

export type UseFieldOptionalityCheck = (
  fieldName: string,
  schema?: ZodSchema,
) => boolean | null;

export const useFieldOptionalityCheck: UseFieldOptionalityCheck = (
  fieldName,
  schema,
) => {
  return useMemo(() => {
    if (!schema) {
      return null;
    }

    const zodFieldPath = generateZodFieldPath(fieldName);
    // @ts-expect-error - form schema is always object
    const zodField: ZodAny | undefined = get(schema?.shape, zodFieldPath);
    if (!zodField) handleNotFoundField(fieldName);

    // @ts-expect-error - we are checking if the field is optional
    return zodField?._def.typeName === 'ZodOptional';
  }, [fieldName, schema]);
};
