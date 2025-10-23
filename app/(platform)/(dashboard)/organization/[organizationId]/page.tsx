import { Separator } from '@/components/ui/separator';
import { Info, SkeletonInfo } from './_components/info';
import { BoardList } from './_components/board-list';
import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { checkSubscription } from '@/lib/subscription';

const OrganizationIdPage = async ({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) => {
  const { orgId } = await auth();

  const isPro = await checkSubscription(orgId);
  const { organizationId } = await params;

  return (
    <div className='w-full mb-20'>
      {orgId == organizationId ? (
        <>
          <Info isPro={isPro} />
          <Separator className='my-4' />
          <Suspense fallback={<BoardList.Skeleton />}>
            <BoardList key={orgId} organizationId={organizationId} />
          </Suspense>
        </>
      ) : (
        <>
          <SkeletonInfo />
          <Separator className='my-4' />
          <div className='px-2 md:px-4'>
            <BoardList.Skeleton />
          </div>
        </>
      )}
    </div>
  );
};

export default OrganizationIdPage;
