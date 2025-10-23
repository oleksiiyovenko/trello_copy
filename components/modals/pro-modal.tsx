'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useProModal } from '@/hooks/use-pro-modal';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useAction } from '@/hooks/use-action';
import { stripeRedirect } from '@/actions/stripe-redirect';
import { toast } from 'sonner';

export function ProModal() {
  const proModal = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  function onClick() {
    execute({});
  }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className='max-w-md p-0 overflow-hidden'>
        <div className='aspect-video relative flex items-center justify-center'>
          <Image src='/hero.svg' alt='Hero' className='object-cover' fill />
        </div>
        <DialogTitle className='text-neutral-700 mx-auto space-y-6 p-6'>
          <div className='font-semibold text-xl'>
            Upgrade to Taskify Pro Today
          </div>
          <p className='text-xs font-semibold text-neutral-600'>
            Explore the best of Taskify
          </p>
          <div className='pl-3'>
            <ul className='text-sm list-disc'>
              <li>Unlimited Boards</li>
            </ul>
          </div>
          <Button
            disabled={isLoading}
            onClick={onClick}
            className='w-full'
            variant='primary'
          >
            Upgrade
          </Button>
        </DialogTitle>
      </DialogContent>
    </Dialog>
  );
}
