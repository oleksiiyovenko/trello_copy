import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ cardId: string }> }
) {
  const { cardId } = await params;
  try {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const card = await db.card.findUnique({
      where: { id: cardId, list: { board: { orgId } } },
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
    });
    return NextResponse.json(card);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
