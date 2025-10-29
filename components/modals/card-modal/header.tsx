'use client';

import { ElementRef, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { CardWithList } from '@/types';

import { useAction } from '@/hooks/use-action';
import { updateCard } from '@/actions/card-actions/update-card';
import { toast } from 'sonner';

import { FormInput } from '@/components/form/form-input';
import { Skeleton } from '@/components/ui/skeleton';
import { Layout } from 'lucide-react';

interface HeaderProps {
  data: CardWithList;
}

export function Header({ data }: HeaderProps) {
  const queryClient = useQueryClient();
  const params = useParams();

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['card', data.id] });
      queryClient.invalidateQueries({ queryKey: ['card-logs', data.id] });

      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const inputRef = useRef<ElementRef<'input'>>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(data.title);

  useEffect(() => {
    setTitle(data.title);
  }, [data.title]);

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

  async function onBlur() {
    inputRef.current?.form?.requestSubmit();
  }

  function onSubmit(formData: FormData) {
    const title = formData.get('title') as string;
    const boardId = params.boardId as string;

    if (title === data.title) return disableEditing();
    execute({ boardId, id: data.id, title });
    disableEditing();
  }

  return (
    <div className='flex items-start gap-x-3 mb-3 w-full'>
      <Layout className='size-5 min-w-5 mt-1 text-neutral-700' />
      <div className='w-full'>
        {isEditing ? (
          <form action={onSubmit}>
            <FormInput
              id='title'
              defaultValue={title}
              className='font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate shadow-none'
              ref={inputRef}
              onBlur={onBlur}
            />
          </form>
        ) : (
          <div
            onClick={enableEditing}
            className='w-full text-xl relative -left-[1px] text-neutral-700 mb-0.5 font-medium border-transparent truncate'
          >
            {title}
          </div>
        )}
        <p className='text-sm text-muted-foreground'>
          in list <span className='underline'>{data.list.title}</span>
        </p>
      </div>
    </div>
  );
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className='flex items-start gap-x-3 mb-6'>
      <Skeleton className='size-5 min-w-5 mt-1 bg-neutral-200' />
      <div>
        <Skeleton className='w-24 h-5 mb-1 bg-neutral-200' />
        <Skeleton className='w-12 h-3 bg-neutral-200' />
      </div>
    </div>
  );
};
