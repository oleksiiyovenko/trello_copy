import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/db';
import { ENTITY_TYPE } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  try {
    params = await params;
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        entityId: params.cardId,
        entityType: ENTITY_TYPE.Card,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });
    return NextResponse.json(auditLogs);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
