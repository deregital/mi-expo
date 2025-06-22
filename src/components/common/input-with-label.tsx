import { type HTMLInputTypeAttribute } from 'react';
import { Input } from '../ui/input';

export function InputWithLabel({
  label,
  name,
  onChange,
  value,
  type = 'text',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
}) {
  return (
    <div className='overflow-hidden'>
      <div className='py-2 bg-white w-3/4 border border-MiExpo_gray rounded-t-[10px] px-3 text-center border-b-0'>
        <p className='text-sm text-center font-medium text-MiExpo_black'>
          {label}
        </p>
      </div>
      <Input
        required
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className='w-full h-10 rounded-[10px] border border-MiExpo_gray bg-MiExpo_white rounded-tl-none focus:ring-0 focus:outline-none focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none px-4'
      />
    </div>
  );
}
