import { checkSubscription } from '@/lib/subscription';
import { auth } from '@clerk/nextjs/server';
import { Info, SkeletonInfo } from '../_components/info';
import { Separator } from '@/components/ui/separator';
import { SubscriptionButton } from './_components/subscription-button';
import { Button } from '@/components/ui/button';

const BillingPage = async ({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) => {
  const { orgId } = await auth();
  const isPro = await checkSubscription(orgId);

  const { organizationId } = await params;

  return (
    <div className='w-full'>
      {organizationId == orgId ? (
        <>
          <Info isPro={isPro} />
          <Separator className='my-4' />
          <SubscriptionButton isPro={isPro} />
        </>
      ) : (
        <>
          <SkeletonInfo />
          <Separator className='my-4' />
          <Button variant='primary' disabled>
            {isPro ? 'Manage subscription' : 'Upgrade to Pro'}
          </Button>
        </>
      )}
    </div>
  );
};
export default BillingPage;
