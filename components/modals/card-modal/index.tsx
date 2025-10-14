'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useCardModal } from '@/hooks/use-card-modal';
import { fetcher } from '@/lib/fetcher';
import { CardWithList } from '@/types';
import { skipToken, useQuery } from '@tanstack/react-query';
import { Header } from './header';
import { Description } from './description';
import { Actions } from './actions';

export function CardModal() {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: id ? () => fetcher(`/api/cards/${id}`) : skipToken,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='gap-0'
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}

        <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
          <div className='col-span-3'>
            <div className='w-full space-y-6'>
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData} />
              )}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
        <DialogTitle className='hidden' />
      </DialogContent>
    </Dialog>
  );
}
