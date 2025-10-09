'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom';

interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary';
}

export function FormSubmit({
  children,
  disabled,
  className,
  variant,
}: FormSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      disabled={pending || disabled}
      className={cn(className)}
      variant={variant}
      size='sm'
    >
      {children}
    </Button>
  );
}
