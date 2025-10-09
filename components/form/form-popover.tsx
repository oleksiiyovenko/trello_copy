'use client';
import { toast } from 'sonner';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@/components/ui/popover';

import { useAction } from '@/hooks/use-action';
import { createBoard } from '@/actions/create-board';

import { FormInput } from './form-input';
import { FormSubmit } from './form-submit';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FormPopoverProps {
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
}

export function FormPopover({
  children,
  side = 'bottom',
  align,
  sideOffset = 0,
}: FormPopoverProps) {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data);
      toast.success('Board created!');
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Something went wrong! ${error}`);
    },
  });

  function onSubmit(formData: FormData) {
    const title = formData.get('title') as string;
    execute({ title });
  }

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className='w-80 pt-3'
        side={side}
        sideOffset={sideOffset}
      >
        <div className='text-sm font-medium text-center text-neutral-600 pb-4'>
          Create Board
        </div>
        <PopoverClose asChild>
          <Button
            className='size-fit p-2 absolute top-2 right-2 text-neutral-600'
            variant='ghost'
            size='icon'
          >
            <X className='size-4' />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className='space-y-4'>
          <div className='space-y-4'>
            <FormInput
              id='title'
              label='Board title'
              type='text'
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className='w-full'>Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
