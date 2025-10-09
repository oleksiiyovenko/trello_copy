import { XCircleIcon } from 'lucide-react';

interface FormErrorsProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export function FormErrors({ id, errors }: FormErrorsProps) {
  if (!errors) return null;
  return (
    <div
      id={`${id}-error`}
      aria-live='polite'
      className='mt-2 text-xs space-y-2 text-rose-500'
    >
      {errors?.[id]?.map((error: string) => (
        <div
          key={error}
          className='flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm'
        >
          <XCircleIcon className='size-4 mr-2' />
          {error}
        </div>
      ))}
    </div>
  );
}
