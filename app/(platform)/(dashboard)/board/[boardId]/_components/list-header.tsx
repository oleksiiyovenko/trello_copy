'use client';

import { toast } from 'sonner';

import { ElementRef, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

import { List } from '@prisma/client';
import { FormInput } from '@/components/form/form-input';

import { useAction } from '@/hooks/use-action';
import { updateList } from '@/actions/update-list';
import { ListOptions } from './list-options';

interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

export function ListHeader({ data, onAddCard }: ListHeaderProps) {
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(data.title);

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }

  function disableEditing() {
    setIsEditing(false);
  }

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  function handleSubmit(formData: FormData) {
    const title = formData.get('title') as string;
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;

    if (title === data.title) {
      return disableEditing();
    }

    execute({ title, id, boardId });
  }

  function onBlur() {
    formRef.current?.requestSubmit();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      formRef.current?.requestSubmit();
      disableEditing();
    }
  }

  useEventListener('keydown', onKeyDown);

  return (
    <div className='pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2'>
      {isEditing ? (
        <form ref={formRef} action={handleSubmit} className='flex-1 px-[2px]'>
          <input
            id='id'
            name='id'
            value={data.id}
            hidden
            readOnly
            type='text'
          />
          <input
            id='boardId'
            name='boardId'
            value={data.boardId}
            hidden
            readOnly
            type='text'
          />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id='title'
            placeholder='Enter list title...'
            defaultValue={title}
            className='text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white'
          />
          <button type='submit' hidden></button>
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className='w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent truncate'
        >
          {title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
}
