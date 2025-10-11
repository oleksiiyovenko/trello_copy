'use client';

import {
  forwardRef,
  useRef,
  ElementRef,
  KeyboardEventHandler,
  RefObject,
} from 'react';
import { useParams } from 'next/navigation';

import { toast } from 'sonner';

import { FormTextarea } from '@/components/form/form-textarea';
import { FormSubmit } from '@/components/form/form-submit';
import { Button } from '@/components/ui/button';

import { useAction } from '@/hooks/use-action';
import { createCard } from '@/actions/create-card';

import { useEventListener, useOnClickOutside } from 'usehooks-ts';

import { Plus, X } from 'lucide-react';

interface CardFormProps {
  listId: string;
  //  ref={textareaRef}
  isEditing: boolean;
  enebleEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, enebleEditing, disableEditing, isEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<'form'>>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card ${data.title} created`);
        formRef.current?.reset();
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

    useOnClickOutside(
      formRef as unknown as RefObject<HTMLFormElement>,
      disableEditing
    );
    useEventListener('keypress', onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    function onSubmit(formData: FormData) {
      const title = formData.get('title') as string;
      const listId = formData.get('listId') as string;
      const boardId = formData.get('boardId') as string;

      execute({
        title,
        listId,
        boardId,
      });
    }

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className='m-1 py-0.5 px-1 space-y-4'
        >
          <FormTextarea
            id='title'
            onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder='Enter a title to this card...'
            errors={fieldErrors}
          />
          <input hidden readOnly id='listId' name='listId' value={listId} />
          <input
            hidden
            readOnly
            id='boardId'
            name='boardId'
            value={params.boardId}
          />
          <div className='flex items-center gap-x-1'>
            <FormSubmit>AddCard</FormSubmit>
            <Button onClick={disableEditing} size='sm' variant='ghost'>
              <X className='size-5' />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className='pt-2 px-2'>
        <Button
          onClick={enebleEditing}
          className='h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm'
          size='sm'
          variant='ghost'
        >
          <Plus className='size-4 mr-2' />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = 'CardForm';
