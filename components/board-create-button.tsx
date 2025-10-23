'use client';

import { FormPopover } from '@/components/form/form-popover';
import { Hint } from '@/components/hint';

import { CreditCard, HelpCircle, Plus } from 'lucide-react';

import { MAX_FREE_BOARDS } from '@/constants/boards';
import { useProModal } from '@/hooks/use-pro-modal';
import { Button } from '@/components/ui/button';

interface BoardCreateButtonProps {
  variant: 'navbar' | 'board-list';
  availableCount: number;
  isPro: boolean;
}

export function BoardCreateButton({
  variant,
  availableCount,
  isPro,
}: BoardCreateButtonProps) {
  const proModal = useProModal();

  if (variant == 'board-list') {
    return (
      <>
        {!isPro && MAX_FREE_BOARDS - availableCount <= 0 ? (
          <button
            onClick={proModal.onOpen}
            className='aspect-video relative size-full bg-muted 
    rounded-sm flex flex-col gap-y-1 items-center justify-center 
    hover:opacity-75 transition cursor-pointer'
          >
            <p className='text-sm'>Upgrade to Pro</p>
            <span className='text-xs'>No free boards</span>
            <Hint
              sideOffset={5}
              description='Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace'
            >
              <HelpCircle className='absolute bottom-2 right-2 size-[14px]' />
            </Hint>
          </button>
        ) : (
          <FormPopover sideOffset={18} side='bottom'>
            <button
              className='aspect-video relative size-full bg-muted 
                rounded-sm flex flex-col gap-y-1 items-center justify-center 
                hover:opacity-75 transition cursor-pointer'
            >
              <p className='text-sm'>Create new board</p>
              <span className='text-xs'>
                {isPro
                  ? 'Unlimited '
                  : `${MAX_FREE_BOARDS - availableCount} remaining`}
              </span>
              <Hint
                sideOffset={5}
                description='Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace'
              >
                <HelpCircle className='absolute bottom-2 right-2 size-[14px]' />
              </Hint>
            </button>
          </FormPopover>
        )}
      </>
    );
  } else {
    return (
      <>
        {!isPro && MAX_FREE_BOARDS - availableCount <= 0 ? (
          <Button
            size='inline'
            variant='primary'
            className='rounded-sm h-auto p-2 md:py-1.5 md:px-2 cursor-pointer'
            onClick={proModal.onOpen}
          >
            <span className='hidden md:inline'>Upgrade to Pro</span>
            <CreditCard className='h-4 w-4 block md:hidden' />
          </Button>
        ) : (
          <FormPopover align='start' side='bottom' sideOffset={18}>
            <Button
              size='sm'
              variant='primary'
              className='rounded-sm h-auto py-1.5 px-2 cursor-pointer'
            >
              <span className='hidden md:inline'>Create</span>
              <Plus className='h-4 w-4 block md:hidden' />
            </Button>
          </FormPopover>
        )}
      </>
    );
  }
}
