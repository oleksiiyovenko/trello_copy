'use client';

import { FormPopover } from '@/components/form/form-popover';
import { Hint } from '@/components/hint';

import { HelpCircle } from 'lucide-react';

import { MAX_FREE_BOARDS } from '@/constants/boards';
import { useProModal } from '@/hooks/use-pro-modal';

interface BoardCreateButtonProps {
  availableCount: number;
  isPro: boolean;
}

export function BoardCreateButton({
  availableCount,
  isPro,
}: BoardCreateButtonProps) {
  const proModal = useProModal();

  return (
    <>
      {!isPro && MAX_FREE_BOARDS - availableCount <= 0 ? (
        <button
          onClick={() => {
            proModal.onOpen();
          }}
          className='aspect-video relative size-full bg-muted 
    rounded-sm flex flex-col gap-y-1 items-center justify-center 
    hover:opacity-75 transition cursor-pointer'
        >
          <p className='text-sm'>Upgrade to Pro</p>
          <span className='text-xs'>
            {`${MAX_FREE_BOARDS - availableCount} free boards remaining`}
          </span>
          <Hint
            sideOffset={5}
            description='Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace'
          >
            <HelpCircle className='absolute bottom-2 right-2 size-[14px]' />
          </Hint>
        </button>
      ) : (
        <FormPopover sideOffset={18} side='bottom'>
          <div
            role='button'
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
          </div>
        </FormPopover>
      )}
    </>
  );
}
