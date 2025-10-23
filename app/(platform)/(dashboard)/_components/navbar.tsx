import { Logo } from '@/components/assets/logo';

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { BoardCreateButton } from '@/components/board-create-button';

import { MobileSidebar } from './mobile-sidebar';
import { cn } from '@/lib/utils';
import { getAvailableCount } from '@/lib/org-limit';
import { checkSubscription } from '@/lib/subscription';
import { auth } from '@clerk/nextjs/server';

interface NavbarProps {
  width_full: boolean;
}

export async function Navbar({ width_full }: NavbarProps) {
  const { orgId } = await auth();

  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription(orgId);

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
          <BoardCreateButton
            variant='navbar'
            availableCount={availableCount}
            isPro={isPro}
          />
        </div>
        <div className='ml-auto flex items-center gap-x-2'>
          <OrganizationSwitcher
            afterCreateOrganizationUrl='/organization/:id'
            afterSelectOrganizationUrl='/organization/:id'
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
