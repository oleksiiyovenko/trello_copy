import { Separator } from '@/components/ui/separator';
import { Info, SkeletonInfo } from '../_components/info';
import { ActivityList } from './_components/activity-list';
import { Suspense } from 'react';
import { checkSubscription } from '@/lib/subscription';
import { auth } from '@clerk/nextjs/server';

export default async function ActivityPage({
  params,
}: {
  params: { organizationId: string };
}) {
  params = await params;
  const { orgId } = await auth();

  const isPro = await checkSubscription(orgId);
  console.log(orgId);
  console.log(params.organizationId);
  return (
    <div className='w-full'>
      {orgId == params.organizationId ? (
        <>
          <Info isPro={isPro} />
          <Separator className='my-2' />
          <Suspense fallback={<ActivityList.Skeleton />}>
            <ActivityList />
          </Suspense>
        </>
      ) : (
        <>
          <SkeletonInfo />
          <Separator className='my-2' />
          <ActivityList.Skeleton />
        </>
      )}
    </div>
  );
}
