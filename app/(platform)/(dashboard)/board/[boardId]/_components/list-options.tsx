'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { ElementRef, useRef } from 'react';

import { Separator } from '@/components/ui/separator';
import { FormSubmit } from '@/components/form/form-submit';

import { List } from '@prisma/client';
import { useAction } from '@/hooks/use-action';
import { deletelist } from '@/actions/list-actions/delete-list';
import { copylist } from '@/actions/list-actions/copy-list';

import { MoreHorizontal, X } from 'lucide-react';

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export function ListOptions({ data, onAddCard }: ListOptionsProps) {
  const closeRef = useRef<ElementRef<'button'>>(null);

  const { execute: executeDelete } = useAction(deletelist, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeCopy } = useAction(copylist, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  function onDelete(formData: FormData) {
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;
    executeDelete({ id, boardId });
  }

  function onCopy(formData: FormData) {
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;
    executeCopy({ id, boardId });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className='size-auto p-2' variant='ghost'>
          <MoreHorizontal className='size-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='px-0 py-3' side='bottom' align='start'>
        <div className='text-sm font-medium text-center text-neutral-600 pb-4'>
          List Options
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className='size-fit p-2 absolute top-2 right-2 text-neutral-600'
            variant='ghost'
            size='icon'
          >
            <X className='size-4' />
          </Button>
        </PopoverClose>
        <Button
          variant='ghost'
          onClick={onAddCard}
          className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
        >
          Add Card
        </Button>
        <form action={onCopy}>
          <input
            type='hidden'
            readOnly
            className='id'
            name='id'
            value={data.id}
          />
          <input
            type='hidden'
            readOnly
            className='boardId'
            name='boardId'
            value={data.boardId}
          />
          <FormSubmit
            className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
            variant='ghost'
          >
            Copy list...
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input
            type='hidden'
            readOnly
            className='id'
            name='id'
            value={data.id}
          />
          <input
            type='hidden'
            readOnly
            className='boardId'
            name='boardId'
            value={data.boardId}
          />
          <FormSubmit
            className='rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm'
            variant='ghost'
          >
            Delete this List
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
