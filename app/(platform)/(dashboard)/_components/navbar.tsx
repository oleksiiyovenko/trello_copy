import { Logo } from '@/components/assets/logo';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import MobileSidebar from './mobile-sidebar';

export const Navbar = () => {
  return (
    <nav className='fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center'>
      <MobileSidebar />
      <div className='flex items-center gap-x-4'>
        <div className='hidden md:flex'>
          <Logo />
        </div>
        <Button
          size={'sm'}
          variant={'primary'}
          className='rounded-sm  h-auto py-1.5 px-2 cursor-pointer'
        >
          <span className='hidden md:inline'>Create</span>
          <Plus className='h-4 w-4 block md:hidden' />
        </Button>
      </div>
      <div className='ml-auto flex items-center gap-x-2'>
        <OrganizationSwitcher
          afterCreateOrganizationUrl={'/organization/:id'}
          afterSelectOrganizationUrl={'/organization/:id'}
          afterLeaveOrganizationUrl='/select-org'
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
    </nav>
  );
};
