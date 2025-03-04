interface FormFieldRowProps {
  children: React.ReactNode;
}

export function FormFieldRow({ children }: FormFieldRowProps) {
  return (
    <div className='flex w-full md:flex-row flex-col gap-2 [&>*]:flex-1'>
      {children}
    </div>
  );
}
