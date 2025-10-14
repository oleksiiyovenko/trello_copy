'use client';

import { useState, useRef, ElementRef, RefObject } from 'react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { useParams, useRouter } from 'next/navigation';

import { useAction } from '@/hooks/use-action';
import { createList } from '@/actions/list-actions/create-list';

import { ListWrapper } from './list-wrapper';
import { FormInput } from '@/components/form/form-input';

import { Plus, X } from 'lucide-react';
import { FormSubmit } from '@/components/form/form-submit';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ListForm() {
  const router = useRouter();
  const params = useParams();

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" created`);
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      disableEditing();
    }
  }

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(
    formRef as unknown as RefObject<HTMLUListElement>,
    disableEditing
  );

  function onSubmit(formData: FormData) {
    const title = formData.get('title') as string;
    const boardId = formData.get('boardId') as string;

    execute({
      title,
      boardId,
    });
  }

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className='w-full p-3 rounded-md bg-white space-y-4 shadow-md'
        >
          <FormInput
            ref={inputRef}
            errors={fieldErrors}
            id='title'
            className='text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition'
            placeholder='Enter list title...'
          />
          <input hidden readOnly value={params.boardId} name='boardId' />
          <div className='flex items-center gap-x-1'>
            <FormSubmit>Add list</FormSubmit>
            <Button onClick={disableEditing} size='sm' variant='ghost'>
              <X className='size-5' />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        className='w-full rounded-md bg-white hover:bg-white/50 transition p-3 flex items-center font-medium text-sm'
        onClick={enableEditing}
      >
        <Plus className='size-2 mr-2' />
        Add a list
      </button>
    </ListWrapper>
  );
}
