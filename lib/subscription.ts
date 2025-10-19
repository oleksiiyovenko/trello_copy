import { db } from '@/lib/db';

const DAY_IN_MS = 86_400_000;

export async function checkSubscription(orgId: string | null | undefined) {
  if (!orgId) return false;

  const orgSubscription = await db.orgSubscription.findUnique({
    where: { orgId },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!orgSubscription) return false;

  const isValid =
    orgSubscription.stripePriceId &&
    (orgSubscription.stripeCurrentPeriodEnd?.getTime()
      ? orgSubscription.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS >
        Date.now()
      : false);

  return !!isValid;
}
