import { Logo } from '@/components/assets/logo';
import { Plus } from 'lucide-react';

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { FormPopover } from '@/components/form/form-popover';

import { MobileSidebar } from './mobile-sidebar';
import { cn } from '@/lib/utils';

interface NavbarProps {
  width_full: boolean;
}

export function Navbar({ width_full }: NavbarProps) {
  return (
    <nav className='sticky z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center justify-center'>
      <div
        className={cn(
          'w-full flex items-center',
          width_full ? '' : 'max-w-[1248px]'
        )}
      >
        <MobileSidebar />
        <div className='flex items-center gap-x-4'>
          <div className='hidden md:flex'>
            <Logo />
          </div>
          <FormPopover align='start' side='bottom' sideOffset={18}>
            <Button
              size={'sm'}
              variant={'primary'}
              className='rounded-sm h-auto py-1.5 px-2 cursor-pointer'
            >
              <span className='hidden md:inline'>Create</span>
              <Plus className='h-4 w-4 block md:hidden' />
            </Button>
          </FormPopover>
        </div>
        <div className='ml-auto flex items-center gap-x-2'>
          <OrganizationSwitcher
            afterCreateOrganizationUrl={'/organization/:id'}
            afterSelectOrganizationUrl={'/organization/:id'}
            afterLeaveOrganizationUrl='/select-org'
            hidePersonal
            appearance={{
              elements: {
                rootBox: {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              },
            }}
          />
          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: {
                  height: 30,
                  width: 30,
                },
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
}
