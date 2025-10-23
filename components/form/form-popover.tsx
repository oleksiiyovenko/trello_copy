'use client';
import { toast } from 'sonner';

import { ElementRef, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useScreen } from 'usehooks-ts';

import { useAction } from '@/hooks/use-action';
import { createBoard } from '@/actions/board-actions/create-board';
import { useProModal } from '@/hooks/use-pro-modal';

import { FormInput } from './form-input';
import { FormSubmit } from './form-submit';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FormPicker } from './form-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '@/components/ui/popover';

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
  const proModal = useProModal();
  const router = useRouter();
  const closeRef = useRef<ElementRef<'button'>>(null);

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data);
      toast.success('Board created!');
      closeRef.current?.click();
      router.push(`/board/${data.id}`);
    },
    onError: (error) => {
      toast.error(`${error}`);
      proModal.onOpen();
    },
  });

  const screen = useScreen();
  const width = screen?.width ?? 0;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const image = formData.get('image') as string;
    console.log({ title, image });
    execute({ title, image });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className='w-80 pt-3 mx-4 md:mx-0'
        side={width > 1024 ? side : 'top'}
        sideOffset={width > 1024 ? sideOffset : 8}
      >
        <div className='text-sm font-medium text-center text-neutral-600 pb-4'>
          Create Board
        </div>
        <PopoverClose asChild ref={closeRef}>
          <Button
            className='size-fit p-2 absolute top-2 right-8 md:right-2 text-neutral-600'
            variant='ghost'
            size='icon'
          >
            <X className='size-4' />
          </Button>
        </PopoverClose>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='space-y-4'>
            <FormPicker id='image' errors={fieldErrors} width={width} />
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
