import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex px-3 py-1 w-full rounded-md border border-input bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm file:border-0 file:bg-transparent text-base transition-colors',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        miExpoClassic:
          'bg-white border-[1px] border-miExpo-gray px-4 py-2 rounded-xl text-black placeholder:text-miExpo-gray',
        MiExpoCard:
          'border-[1px] rounded-lg rounded-tl-none border-miExpo-gray px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface InputProps
  extends React.ComponentProps<'input'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
