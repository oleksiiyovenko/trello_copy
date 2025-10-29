'use client';

import { ElementRef, useRef, useState } from 'react';
import { useAction } from '@/hooks/use-action';

import { Button } from '@/components/ui/button';
import { Board } from '@prisma/client';
import { FormInput } from '@/components/form/form-input';

import { toast } from 'sonner';

import { updateBoard } from '@/actions/board-actions/update-board';

interface BoardTitleFormPrors {
  data: Board;
}

export function BoardTitleForm({ data }: BoardTitleFormPrors) {
  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board "${data.title}" updated!`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  function disableEditing() {
    setIsEditing(false);
  }

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }

  function onSubmit(formData: FormData) {
    const title = formData.get('title') as string;

    execute({
      title,
      id: data.id,
    });
  }

  function onBlur() {
    formRef.current?.requestSubmit();
  }

  if (isEditing) {
    return (
      <form
        ref={formRef}
        action={onSubmit}
        className='flex items-center gap-x-2'
      >
        <FormInput
          ref={inputRef}
          id='title'
          onBlur={onBlur}
          defaultValue={title}
          className='text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-white not-focus-visible:border-transparent'
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant='transparent'
      className='font-bold flex justify-start text-lg size-auto min-w-0 overflow-auto max-w-[80%] p-1 px-2'
    >
      {title}
    </Button>
  );
}
