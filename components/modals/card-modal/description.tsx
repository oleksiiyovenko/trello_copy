'use client';

import { ElementRef, RefObject, useRef, useState } from 'react';
import { CardWithList } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

import { useParams } from 'next/navigation';
import { useAction } from '@/hooks/use-action';
import { updateCard } from '@/actions/card-actions/update-card';
import { toast } from 'sonner';

import { FormSubmit } from '@/components/form/form-submit';
import { FormTextarea } from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlignLeft } from 'lucide-react';

interface DescriptionProps {
  data: CardWithList;
}

export function Description({ data }: DescriptionProps) {
  const queryClient = useQueryClient();
  const params = useParams();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const textareaRef = useRef<ElementRef<'textarea'>>(null);
  const formRef = useRef<ElementRef<'form'>>(null);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['card', data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['card-logs', data.id],
      });
      toast.success(`Card "${data.title}" updated`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    });
  }

  function disableEditing() {
    setIsEditing(false);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      disableEditing();
    }
  }

  useEventListener('keydown', onKeyDown);
  useOnClickOutside(
    formRef as unknown as RefObject<HTMLFormElement>,
    disableEditing
  );

  function onSubmit(formData: FormData) {
    const description = formData.get('description') as string;
    const boardId = params.boardId as string;

    if (description === data.description) return disableEditing();
    execute({ id: data.id, description, boardId });
    disableEditing();
  }

  return (
    <div className='flex items-start gap-x-3 w-full'>
      <AlignLeft className='size-5 mt-0.5 text-neutral-700' />
      <div className='w-full'>
        <p className='font-semibold text-neutral-700 mb-2'>Description</p>
        {isEditing ? (
          <form ref={formRef} action={onSubmit} className='space-y-2'>
            <FormTextarea
              ref={textareaRef}
              id='description'
              className='w-full min-h-[78px] mt-2 text-sm'
              placeholder='Add a more detailed description...'
              errors={fieldErrors}
              defaultValue={data.description || undefined}
            />
            <div className='flex items-center gap-x-2'>
              <FormSubmit>Save</FormSubmit>
              <Button
                type='button'
                onClick={disableEditing}
                size='sm'
                variant='ghost'
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            role='button'
            onClick={enableEditing}
            className='min-h-[78px] border-transparent border-[1px] bg-neutral-200 text-sm  py-2 mb-6 md:mb-10 px-3 rounded-md'
          >
            {data.description || 'Add a more detailed description...'}
          </div>
        )}
      </div>
    </div>
  );
}

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className='flex items-start gap-x-3 w-full'>
      <Skeleton className='size-6 bg-neutral-200' />
      <div className='w-full'>
        <Skeleton className='w-24 h-5 mb-2 bg-neutral-200' />
        <Skeleton className='w-full h-[78px] mb-6 md:mb-10 bg-neutral-200' />
      </div>
    </div>
  );
};
