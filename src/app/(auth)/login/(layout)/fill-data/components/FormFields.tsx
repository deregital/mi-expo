import { type FormSchema } from '@/lib/formSchema';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { type Control, type FieldPath } from 'react-hook-form';
import { Label } from '@/components/ui/label';

interface SignupFormFieldProps {
  name: FieldPath<FormSchema>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formControl: Control<FormSchema, any>;
  validate?: (value: unknown, formValues: FormSchema) => boolean | string;
}

export function SignupFormField({
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
        <FormItem className='space-y-0'>
          <Label variant={'miExpoCard'}>
            <FormLabel>{label}</FormLabel>
          </Label>
          <FormControl>
            <Input
              variant={'MiExpoCard'}
              placeholder={placeholder}
              type={inputType || 'text'}
              value={value?.toString() || ''}
              className={cn(
                inputType === 'number' &&
                  '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
              )}
              {...rest}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
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
    id: string;
    label: string;
  }>;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export function SignupSelectField({
  formControl,
  label,
  name,
  placeholder,
  description,
  items,
  disabled,
  onChange: customOnChange,
}: SignupSelectFieldProps) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className='space-y-0'>
            <Label variant={'miExpoCard'}>
              <FormLabel>{label}</FormLabel>
            </Label>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                customOnChange?.(value);
              }}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className='border-[1px] rounded-lg rounded-tl-none border-miExpo-gray px-4 py-5'>
                  <p>
                    {field.value?.toString() !== ''
                      ? items.find((item) => item.value === field.value)?.label
                      : placeholder}
                  </p>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
