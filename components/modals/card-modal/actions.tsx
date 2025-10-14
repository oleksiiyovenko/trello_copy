'use client';

import { CardWithList } from '@/types';

import { useAction } from '@/hooks/use-action';
import { copyCard } from '@/actions/card-actions/copy-card';
import { deleteCard } from '@/actions/card-actions/delete-card';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCardModal } from '@/hooks/use-card-modal';
import { toast } from 'sonner';

interface ActionsProps {
  data: CardWithList;
}

export function Actions({ data }: ActionsProps) {
  const params = useParams();

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title} copied"`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title} deleted"`);
        cardModal.onClose();
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const cardModal = useCardModal();

  const boardId = params.boardId as string;
  function onCopy() {
    executeCopyCard({ id: data.id, boardId });
  }

  function onDelete() {
    executeDeleteCard({ id: data.id, boardId });
  }

  return (
    <div className='space-y-2 mt-2'>
      <p className='text-xs font-semibold'>Actions</p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant='gray'
        className='w-full justify-start'
        size='inline'
      >
        <Copy />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant='gray'
        className='w-full justify-start'
        size='inline'
      >
        <Trash />
        Delete
      </Button>
    </div>
  );
}

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className='space-y-2 mt-2'>
      <Skeleton className='w-20 h-4 bg-neutral-200' />
      <Skeleton className='w-full h-8 bg-neutral-200' />
      <Skeleton className='w-full h-8 bg-neutral-200' />
    </div>
  );
};
